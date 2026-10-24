import type { BeerStyle } from '../types/beerStyle'

/**
 * Objeto demo del nuevo modelo BeerStyle: American Pale Ale (18B).
 * Se usa para validar el diseño de la página de detalle antes de migrar
 * el catálogo completo `beers.json`.
 */
export const americanPaleAle: BeerStyle = {
  id: '18B',
  nombre: 'American Pale Ale',
  categoria: 'Standard American Beer',
  guiaBjcp: '2021',
  colorSrm: {
    hex: '#E6A100',
    min: 5,
    max: 10,
  },
  rangosTecnicos: {
    abv: {
      min: 4.5,
      max: 6.2,
      unit: '% vol',
      scaleMin: 0,
      scaleMax: 10,
      label: 'Graduación alcohólica',
    },
    ibu: {
      min: 30,
      max: 50,
      unit: 'IBU',
      scaleMin: 0,
      scaleMax: 100,
      label: 'Amargor',
    },
    temperaturaServicio: {
      min: 7,
      max: 10,
      unit: '°C',
      scaleMin: 0,
      scaleMax: 25,
      label: 'Temperatura de servicio',
    },
  },
  perfilSensorial: {
    aroma: 4,
    malta: 3,
    lupulo: 4,
    amargor: 3.5,
    dulzor: 2.5,
    cuerpo: 3,
  },
  notasSabor: ['Cítricos', 'Pomelo', 'Pino', 'Floral', 'Caramelo suave', 'Melocotón'],
  resumenNotas:
    'Los descriptores resaltan los aromas y sabores dominantes que un catador debe buscar en la copa: la combinación de lúpulo cítrico y maltas de soporte es la firma de una American Pale Ale bien elaborada.',
  maridajes: [
    {
      categoria: 'carnes',
      descripcion:
        'El amargor limpio y la carbonatación cortan las grasas y las proteínas densas, mientras los lúpulos cítricos realzan los jugos de la carne.',
      platos: ['Salmón a la parrilla', 'Pollo al ajonjolí', 'Chuleta de cerdo glaseada', 'Hamburguesa clásica'],
    },
    {
      categoria: 'quesos',
      descripcion:
        'La carbonatación lava el paladar de la grasa y el perfil lupulado contrasta con la untuosidad de los quesos medias curas.',
      platos: ['Cheddar joven', 'Gouda ahumado', 'Manchego curado', 'Queso de cabra fresco'],
    },
    {
      categoria: 'postres',
      descripcion:
        'El dulzor residual moderado dialoga con los postres sin empalagarse, y el amargor equilibra las notas de caramelo y fruta.',
      platos: ['Tarta de zanahoria', 'Crumble de manzana', 'Cheesecake de frutos rojos', 'Flan de caramelo'],
    },
  ],
}
