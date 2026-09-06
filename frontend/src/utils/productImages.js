const SLUG_IMAGE_MAP = {
  'sparkle-pro-whitening-kit': '/images/kit-deluxe.jpg',
  'sparkle-deluxe-home-kit': '/images/kit-deluxe.jpg',
  'sparkle-lite-led-accelerator': '/images/led.jpg',
  'ultraviolet-led-light-pro': '/images/led-uv.jpg',
  'advanced-whitening-strips-28-pack': '/images/strips.jpg',
  'whitening-strips-sensitive-14-pack': '/images/strips-sensitive.jpg',
  'whitening-pen-2-pack': '/images/pen.jpg',
  'charcoal-whitening-toothpaste': '/images/toothpaste.jpg',
  'desensitizing-gel-3-pack': '/images/gel.jpg',
}

const CATEGORY_IMAGE_MAP = {
  'Whitening Kits': '/images/kit-deluxe.jpg',
  'LED Lights': '/images/led.jpg',
  'Whitening Strips': '/images/strips.jpg',
  'Gels & Pens': '/images/pen.jpg',
  'Accessories': '/images/toothpaste.jpg',
}

export function getProductImage(product) {
  if (!product) return '/images/kit-deluxe.jpg'

  // If a custom image was uploaded via admin / backend
  if (product.image && typeof product.image === 'string' && product.image.trim() !== '') {
    return product.image
  }

  const slug = (product.slug || '').toLowerCase()
  if (SLUG_IMAGE_MAP[slug]) {
    return SLUG_IMAGE_MAP[slug]
  }

  const name = (product.name || '').toLowerCase()
  if (name.includes('deluxe') || slug.includes('deluxe')) return '/images/kit-deluxe.jpg'
  if (name.includes('ultraviolet') || slug.includes('uv')) return '/images/led-uv.jpg'
  if (name.includes('led') || slug.includes('led')) return '/images/led.jpg'
  if (name.includes('sensitive') || slug.includes('sensitive')) return '/images/strips-sensitive.jpg'
  if (name.includes('strip') || slug.includes('strip')) return '/images/strips.jpg'
  if (name.includes('pen') || slug.includes('pen')) return '/images/pen.jpg'
  if (name.includes('toothpaste') || name.includes('charcoal') || slug.includes('toothpaste')) return '/images/toothpaste.jpg'
  if (name.includes('gel') || slug.includes('gel')) return '/images/gel.jpg'
  if (name.includes('kit') || slug.includes('kit')) return '/images/kit-deluxe.jpg'

  if (product.category_name && CATEGORY_IMAGE_MAP[product.category_name]) {
    return CATEGORY_IMAGE_MAP[product.category_name]
  }

  return '/images/kit-deluxe.jpg'
}
