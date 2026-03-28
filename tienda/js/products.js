/**
 * products.js — Catálogo de productos de NovaMart
 */

const PRODUCTS = [
  // ── Electrónica ──────────────────────────────────────────────
  {
    id: 1,
    name: 'Audífonos Inalámbricos Pro',
    category: 'electronics',
    categoryLabel: 'Electrónica',
    emoji: '🎧',
    price: 79.99,
    oldPrice: 129.99,
    rating: 4.8,
    reviews: 312,
    badge: 'Oferta',
    description:
      'Sonido envolvente de 360°, cancelación activa de ruido y 30 h de batería. Diseño ergonómico plegable con almohadillas de memory foam.',
  },
  {
    id: 2,
    name: 'Smartwatch Série 5',
    category: 'electronics',
    categoryLabel: 'Electrónica',
    emoji: '⌚',
    price: 149.00,
    oldPrice: null,
    rating: 4.6,
    reviews: 198,
    badge: null,
    description:
      'Monitor de ritmo cardíaco, SpO₂, GPS integrado, 50 m resistente al agua. Compatible con iOS y Android.',
  },
  {
    id: 3,
    name: 'Teclado Mecánico RGB',
    category: 'electronics',
    categoryLabel: 'Electrónica',
    emoji: '⌨️',
    price: 59.99,
    oldPrice: 89.99,
    rating: 4.5,
    reviews: 87,
    badge: 'Oferta',
    description:
      'Switches táctiles blue, retroiluminación RGB personalizable por tecla, formato TKL. Cable desmontable Type-C.',
  },
  {
    id: 4,
    name: 'Bocina Portátil 360°',
    category: 'electronics',
    categoryLabel: 'Electrónica',
    emoji: '🔊',
    price: 44.90,
    oldPrice: null,
    rating: 4.3,
    reviews: 154,
    badge: null,
    description:
      'Sonido omnidireccional de 20 W, IPX7, 12 h de batería, carga USB-C. Perfecta para exteriores y viajes.',
  },
  {
    id: 5,
    name: 'Cámara Web 4K Ultra',
    category: 'electronics',
    categoryLabel: 'Electrónica',
    emoji: '📷',
    price: 89.00,
    oldPrice: 110.00,
    rating: 4.7,
    reviews: 63,
    badge: 'Nuevo',
    description:
      'Video 4K/30fps, autofoco con IA, micrófono estéreo con cancelación de ruido. Ideal para streaming y videollamadas.',
  },

  // ── Ropa ─────────────────────────────────────────────────────
  {
    id: 6,
    name: 'Sudadera Minimalista',
    category: 'clothing',
    categoryLabel: 'Ropa',
    emoji: '👕',
    price: 38.50,
    oldPrice: null,
    rating: 4.4,
    reviews: 230,
    badge: null,
    description:
      'Algodón 100% orgánico, corte oversize, 6 colores disponibles. Suave al tacto, lavable a máquina.',
  },
  {
    id: 7,
    name: 'Jeans Slim Stretch',
    category: 'clothing',
    categoryLabel: 'Ropa',
    emoji: '👖',
    price: 54.99,
    oldPrice: 69.99,
    rating: 4.2,
    reviews: 176,
    badge: 'Oferta',
    description:
      'Denim elástico 2-way, tiro medio, cinco bolsillos. Disponibles en azul claro, midnight y negro.',
  },
  {
    id: 8,
    name: 'Zapatillas Runner X',
    category: 'clothing',
    categoryLabel: 'Ropa',
    emoji: '👟',
    price: 99.00,
    oldPrice: null,
    rating: 4.9,
    reviews: 401,
    badge: 'Nuevo',
    description:
      'Suela BOOST de rebote máximo, upper en mesh transpirable, refuerzo en talón. Unisex, tallas 35-46.',
  },
  {
    id: 9,
    name: 'Mochila Urban Pack',
    category: 'clothing',
    categoryLabel: 'Ropa',
    emoji: '🎒',
    price: 65.00,
    oldPrice: 85.00,
    rating: 4.6,
    reviews: 95,
    badge: 'Oferta',
    description:
      '25 L de capacidad, bolsillo para laptop 15", resistente al agua, puerto USB externo. Diseño modular.',
  },

  // ── Hogar ────────────────────────────────────────────────────
  {
    id: 10,
    name: 'Lámpara LED Ambiental',
    category: 'home',
    categoryLabel: 'Hogar',
    emoji: '🪔',
    price: 29.90,
    oldPrice: null,
    rating: 4.3,
    reviews: 118,
    badge: null,
    description:
      'Control por app, 16 millones de colores, compatible con Alexa y Google Home. Consumo 7 W = 60 W equivalente.',
  },
  {
    id: 11,
    name: 'Set de Cuchillos Profesional',
    category: 'home',
    categoryLabel: 'Hogar',
    emoji: '🔪',
    price: 74.99,
    oldPrice: 110.00,
    rating: 4.8,
    reviews: 88,
    badge: 'Oferta',
    description:
      'Acero inoxidable alemán 1.4116, bloque de madera incluido, 6 piezas. Mango ergonómico antideslizante.',
  },
  {
    id: 12,
    name: 'Robot Aspirador SLIM',
    category: 'home',
    categoryLabel: 'Hogar',
    emoji: '🤖',
    price: 199.00,
    oldPrice: 270.00,
    rating: 4.5,
    reviews: 222,
    badge: 'Oferta',
    description:
      'Mapeo LiDAR, 3 modos de succión, 150 min de autonomía, autorecarga. App para programación y zonas restringidas.',
  },
  {
    id: 13,
    name: 'Cafetera de Goteo Selecta',
    category: 'home',
    categoryLabel: 'Hogar',
    emoji: '☕',
    price: 49.99,
    oldPrice: null,
    rating: 4.4,
    reviews: 145,
    badge: null,
    description:
      '12 tazas, sistema anti-goteo, placa calefactora regulable, filtro permanente lavable. Diseño compacto.',
  },

  // ── Deportes ─────────────────────────────────────────────────
  {
    id: 14,
    name: 'Colchoneta Yoga Premium',
    category: 'sports',
    categoryLabel: 'Deportes',
    emoji: '🧘',
    price: 34.00,
    oldPrice: null,
    rating: 4.6,
    reviews: 307,
    badge: null,
    description:
      'TPE ecológico 6 mm, doble capa anti-deslizante, 183×61 cm, bolsa de transporte incluida.',
  },
  {
    id: 15,
    name: 'Pesas Ajustables 20 kg',
    category: 'sports',
    categoryLabel: 'Deportes',
    emoji: '🏋️',
    price: 119.00,
    oldPrice: 148.00,
    rating: 4.7,
    reviews: 73,
    badge: 'Oferta',
    description:
      'Sistema de discos intercambiables de 2-20 kg por mancuerna. Agarre hexagonal antideslizante. Par incluido.',
  },
  {
    id: 16,
    name: 'Bicicleta Estacionaria X3',
    category: 'sports',
    categoryLabel: 'Deportes',
    emoji: '🚴',
    price: 289.00,
    oldPrice: 350.00,
    rating: 4.5,
    reviews: 56,
    badge: 'Oferta',
    description:
      'Volante de inercia 18 kg, 32 niveles de resistencia magnética, pantalla LCD, compatible con Zwift.',
  },

  // ── Belleza ──────────────────────────────────────────────────
  {
    id: 17,
    name: 'Sérum Vitamina C SPF30',
    category: 'beauty',
    categoryLabel: 'Belleza',
    emoji: '✨',
    price: 24.90,
    oldPrice: 34.90,
    rating: 4.9,
    reviews: 520,
    badge: 'Bestseller',
    description:
      'Vitamina C 15%, ácido hialurónico, niacinamida. Ilumina, hidrata y protege. Apto piel sensible.',
  },
  {
    id: 18,
    name: 'Secadora de Pelo Iónica',
    category: 'beauty',
    categoryLabel: 'Belleza',
    emoji: '💇',
    price: 52.00,
    oldPrice: null,
    rating: 4.4,
    reviews: 189,
    badge: null,
    description:
      '2200 W, tecnología iónica antifrizz, 3 temperaturas, 2 velocidades, boquilla concentradora.',
  },
  {
    id: 19,
    name: 'Paleta de Sombras 18 Col.',
    category: 'beauty',
    categoryLabel: 'Belleza',
    emoji: '🎨',
    price: 18.99,
    oldPrice: 29.99,
    rating: 4.3,
    reviews: 344,
    badge: 'Oferta',
    description:
      '18 tonos entre mates, brillantes y satinados. Fórmula de larga duración, altamente pigmentada.',
  },
  {
    id: 20,
    name: 'Kit Skincare 5 Pasos',
    category: 'beauty',
    categoryLabel: 'Belleza',
    emoji: '🧴',
    price: 64.00,
    oldPrice: 95.00,
    rating: 4.7,
    reviews: 211,
    badge: 'Oferta',
    description:
      'Limpiador, tónico, sérum, hidratante y SPF 50. Formulado sin parabenos, sin sulfatos. Apto todo tipo de piel.',
  },
];

/**
 * Devuelve los productos filtrados por categoría.
 * @param {string} cat - 'all' o id de categoría
 */
function getProducts(cat = 'all') {
  if (cat === 'all') return [...PRODUCTS];
  return PRODUCTS.filter(p => p.category === cat);
}

/**
 * Busca un producto por id.
 * @param {number} id
 */
function getProductById(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}
