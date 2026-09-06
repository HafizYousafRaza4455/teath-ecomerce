const UNIQUE_PRODUCT_IMAGES = {
  // Whitening Kits
  'sparkle-pro-whitening-kit': '/images/kit-deluxe.jpg',
  'sparkle-deluxe-wireless-home-kit': '/images/prod-deluxe-kit.jpg',
  'rapid-3-day-express-whitening-kit': '/images/prod-rapid-kit.jpg',
  'gentle-care-sensitive-teeth-whitening-kit': '/images/prod-sensitive-kit.jpg',
  'activated-charcoal-infused-whitening-system': '/images/prod-charcoal-kit.jpg',
  'sparkle-platinum-dual-action-whitening-set': '/images/prod-platinum-kit.jpg',
  'couples-smile-whitening-bundle': '/images/prod-couples-kit.jpg',
  'travel-size-whitening-pod-kit': '/images/prod-travel-pod.jpg',
  'organic-botanical-whitening-kit': '/images/prod-botanical-kit.jpg',
  'sparkle-ultimate-vip-makeover-box': '/images/prod-vip-box.jpg',

  // LED Lights
  'sparkle-lite-led-accelerator': '/images/led.jpg',
  'ultraviolet-led-light-pro': '/images/led-uv.jpg',
  'wireless-32-bulb-power-led-mouthpiece': '/images/prod-wireless-mouthpiece.jpg',
  'red-light-gum-rejuvenation-device': '/images/prod-red-light.jpg',
  'usb-smartphone-powered-mini-led-light': '/images/prod-usb-mini-led.jpg',
  'sparkle-touch-timer-led-device': '/images/prod-touch-timer.jpg',
  'pro-clinic-orthodontic-led-whitener': '/images/prod-ortho-led.jpg',
  'replacement-magnetic-led-charging-dock': '/images/prod-led-dock.jpg',

  // Whitening Strips
  'advanced-whitening-strips-28-pack': '/images/strips.jpg',
  'whitening-strips-sensitive-14-pack': '/images/strips-sensitive.jpg',
  'activated-charcoal-dry-grip-strips': '/images/prod-strips-charcoal.jpg',
  '1-hour-express-whitening-strips-7-pack': '/images/prod-strips-1hr.jpg',
  'coconut-oil-spearmint-gentle-strips': '/images/prod-strips-coconut.jpg',
  'overnight-rejuvenating-whitening-strips': '/images/prod-strips-overnight.jpg',
  'kids-teens-enamel-safe-brightening-strips': '/images/prod-strips-teens.jpg',
  'smokers-coffee-drinkers-heavy-stain-strips': '/images/prod-strips-smokers.jpg',
  'annual-subscription-56-strip-value-box': '/images/prod-strips-value.jpg',

  // Gels & Pens
  'whitening-pen-2-pack': '/images/pen.jpg',
  'desensitizing-gel-3-pack': '/images/gel.jpg',
  '35-carbamide-peroxide-refill-syringes-6-pack': '/images/prod-cp-refills.jpg',
  'pap-zero-peroxide-whitening-pen-trio': '/images/prod-pap-pen-trio.jpg',
  '44-dental-strength-nighttime-gel-refill': '/images/prod-night-gel-44.jpg',
  'enamel-remineralizing-hydroxyapatite-gel-pen': '/images/prod-hydroxyapatite-pen.jpg',
  'instant-glow-whitening-pen-violet': '/images/prod-instant-glow-pen.jpg',
  'sparkle-mint-flavor-boost-whitening-gel': '/images/prod-mint-flavor-gel.jpg',
  'precision-micro-tip-whitening-pen': '/images/prod-micro-tip-pen.jpg',

  // Toothpastes & Powders
  'charcoal-whitening-toothpaste': '/images/toothpaste.jpg',
  'v34-color-corrector-purple-serum': '/images/prod-v34-purple-serum.jpg',
  'nano-hydroxyapatite-enamel-repair-toothpaste': '/images/prod-nano-ha-toothpaste.jpg',
  'activated-coconut-charcoal-polishing-powder': '/images/prod-charcoal-powder.jpg',
  'herbal-enzyme-stain-defense-toothpaste': '/images/prod-herbal-enzyme-paste.jpg',
  'baking-soda-peroxide-intensive-paste': '/images/prod-baking-soda-paste.jpg',
  'probiotic-oral-microbiome-whitening-paste': '/images/prod-probiotic-paste.jpg',
  'toothpaste-tube-duo-day-night': '/images/prod-tube-duo.jpg',

  // Accessories & Aftercare
  'custom-thermoform-dental-trays-4-pack': '/images/prod-custom-trays.jpg',
  'sonic-pulsating-whitening-toothbrush': '/images/prod-sonic-toothbrush.jpg',
  'uv-sanitizing-retainer-tray-case': '/images/prod-uv-sanitizer-case.jpg',
  'sparkle-deluxe-20-shade-dental-color-guide': '/images/prod-shade-guide.jpg',
  'natural-bamboo-charcoal-toothbrush-4-pack': '/images/prod-bamboo-brushes.jpg',
  'enamel-shield-remineralizing-mouthwash': '/images/prod-enamel-mouthwash.jpg',
  'velvet-travel-pouch-waterproof-case': '/images/prod-velvet-pouch.jpg',
  'tongue-scraper-oral-cleaner-stainless-steel': '/images/prod-tongue-scraper.jpg',
}

export function getProductImage(product) {
  if (!product) return '/images/kit-deluxe.jpg'

  // If a custom image was uploaded via admin
  if (product.image && typeof product.image === 'string' && product.image.trim() !== '') {
    return product.image
  }

  const slug = (product.slug || '').toLowerCase()
  if (UNIQUE_PRODUCT_IMAGES[slug]) {
    return UNIQUE_PRODUCT_IMAGES[slug]
  }

  // Exact ID / index mapping fallback (1..52)
  const idMap = Object.values(UNIQUE_PRODUCT_IMAGES)
  if (product.id && product.id >= 1 && product.id <= idMap.length) {
    return idMap[product.id - 1]
  }

  return '/images/kit-deluxe.jpg'
}
