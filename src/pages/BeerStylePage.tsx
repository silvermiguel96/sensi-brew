import { motion, useReducedMotion } from 'framer-motion'
import { americanPaleAle } from '../data/americanPaleAle'
import { BarraDetalle } from '../components/BarraDetalle'
import { BeerStyleDetail } from '../components/beerstyle/BeerStyleDetail'
import { useMetaPagina } from '../hooks/useMetaPagina'

/** Ruta showcase de la nueva página de detalle (modelo BeerStyle). */
export function BeerStylePage() {
  const reduceMotion = useReducedMotion()
  const estilo = americanPaleAle

  useMetaPagina(
    `${estilo.nombre} (${estilo.id}) — SensiBrew BJCP 2021`,
    `Perfil sensorial, rangos técnicos y maridajes para el estilo ${estilo.nombre} (BJCP ${estilo.id}).`,
  )

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6">
        <BarraDetalle titulo={`${estilo.nombre} (${estilo.id}) — SensiBrew`} />
      </div>
      <BeerStyleDetail style={estilo} />
    </motion.div>
  )
}
