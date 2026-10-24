import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig, type Plugin } from 'vite'

function inlineCss(): Plugin {
  return {
    name: 'inline-css',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html
        let newHtml = html
        for (const [fileName, asset] of Object.entries(ctx.bundle)) {
          if (fileName.endsWith('.css') && 'source' in asset) {
            const cssContent =
              typeof asset.source === 'string'
                ? asset.source
                : asset.source.toString()
            const linkRegex = new RegExp(
              `<link[^>]*href=["'][^"']*${fileName}["'][^>]*>`,
              'i',
            )
            newHtml = newHtml.replace(linkRegex, `<style>${cssContent}</style>`)
            delete ctx.bundle[fileName]
          }
        }
        return newHtml
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    inlineCss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'SensiBrew — Guía sensorial de cerveza BJCP 2021',
        short_name: 'SensiBrew',
        description:
          'Perfiles sensoriales, estadísticas vitales y maridajes gastronómicos de estilos cerveceros según la guía BJCP 2021. Funciona sin internet.',
        lang: 'es',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#09090b',
        background_color: '#09090b',
        categories: ['food', 'education'],
        icons: [
          {
            src: 'icons/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'icons/icon-maskable.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,ico}'],
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
  build: {
    modulePreload: {
      resolveDependencies(_filename, deps, { hostType }) {
        if (hostType === 'html') {
          return deps.filter((dep) => !dep.includes('vendor-charts'))
        }
        return deps
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/recharts')) {
            return 'vendor-charts'
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion'
          }
          if (id.includes('src/data/beers.json')) {
            return 'beers-data'
          }
        },
      },
    },
  },
})
