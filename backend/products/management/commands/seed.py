from django.core.management.base import BaseCommand
from products.models import Category, Product
from orders.models import Coupon

CATEGORIES = [
    ('Whitening Kits', 'Complete at-home teeth whitening kits with everything you need.'),
    ('LED Lights', 'Accelerator LED lights to speed up the whitening process.'),
    ('Whitening Strips', 'Easy-to-use strips for gradual whitening.'),
    ('Gels & Pens', 'Whitening gels and pens for targeted application.'),
    ('Toothpastes & Powders', 'Daily stain-lifting toothpastes, color correctors, and polishing powders.'),
    ('Accessories & Aftercare', 'Remineralizing treatments, sonic brushes, trays, and travel cases.'),
]

PRODUCTS = [
    # Whitening Kits
    ('Sparkle Pro Whitening Kit', 'Whitening Kits', 49.99, 39.99, 45, True,
     'Our flagship at-home whitening kit. Includes LED accelerator light, 3 syringes of premium whitening gel (35% carbamide peroxide), custom-fit trays, and a shade guide. Visible results in as little as 3 days.'),
    ('Sparkle Deluxe Wireless Home Kit', 'Whitening Kits', 79.99, 64.99, 32, True,
     'Wireless charging LED system plus soothing desensitizing gel, 4 extra whitening syringes, and a water-resistant magnetic travel case.'),
    ('Rapid 3-Day Express Whitening Kit', 'Whitening Kits', 44.99, 34.99, 28, False,
     'High-potency formulation designed for quick touch-ups before big events or weddings. Visible transformation in only 3 days.'),
    ('Gentle Care Sensitive Teeth Whitening Kit', 'Whitening Kits', 54.99, 44.99, 40, False,
     'Specially engineered for sensitive enamel. Features PAP+ active ingredient and potassium nitrate to eliminate nerve sensitivity.'),
    ('Activated Charcoal Infused Whitening System', 'Whitening Kits', 49.99, None, 19, False,
     'Organic coconut activated charcoal gel paired with our dual-spectrum blue LED light to bind and lift deep stains.'),
    ('Sparkle Platinum Dual-Action Whitening Set', 'Whitening Kits', 89.99, 69.99, 15, True,
     'Includes daytime 15-minute express kit and nighttime overnight slow-release whitening strips for round-the-clock brightening.'),
    ('Couples Smile Whitening Bundle', 'Whitening Kits', 99.99, 79.99, 22, False,
     'Double the trays, double the LED lights, and 6 syringes of gel. Whiten together at home with 2 full sets.'),
    ('Travel-Size Whitening Pod Kit', 'Whitening Kits', 34.99, 29.99, 50, False,
     'Compact TSA-approved pocket case with mini rechargeable LED mouthpiece and 3 single-dose twist pods.'),
    ('Organic Botanical Whitening Kit', 'Whitening Kits', 52.99, None, 18, False,
     '100% peroxide-free botanical formula enriched with pomegranate seed, chamomile, and aloe vera.'),
    ('Sparkle Ultimate VIP Makeover Box', 'Whitening Kits', 119.99, 89.99, 10, False,
     'Our most comprehensive collection: Wireless LED light, 6 gel syringes, color-correcting serum, 28 strips, and velvet case.'),

    # LED Lights
    ('Sparkle Lite LED Accelerator', 'LED Lights', 29.99, None, 60, True,
     '5x LED accelerator light with 16 powerful bulbs. Accelerates whitening gel activation for faster, longer-lasting results.'),
    ('Ultraviolet LED Light Pro', 'LED Lights', 39.99, 32.99, 25, True,
     'Dual-light technology combining blue LED and gentle UV for maximum gel activation. Rechargeable via USB-C.'),
    ('Wireless 32-Bulb Power LED Mouthpiece', 'LED Lights', 49.99, 39.99, 35, False,
     'Medical-grade silicone mouthpiece equipped with 32 micro-LEDs covering upper and lower arches simultaneously.'),
    ('Red Light Gum Rejuvenation Device', 'LED Lights', 59.99, 47.99, 16, False,
     'Features alternating blue light for teeth whitening and 630nm near-infrared red light for gum health.'),
    ('USB Smartphone-Powered Mini LED Light', 'LED Lights', 19.99, 15.99, 75, False,
     'No batteries required. Plugs directly into iPhone, USB-C Android, or laptop for quick whitening sessions anywhere.'),
    ('Sparkle Touch Timer LED Device', 'LED Lights', 34.99, None, 29, False,
     'Smart capacitive touch sensor with automatic 10, 15, and 20 minute auto-shutoff beep timers.'),
    ('Pro-Clinic Orthodontic LED Whitener', 'LED Lights', 54.99, 44.99, 12, False,
     'Wide-angle arc designed specifically to whiten around clear aligners and retainers safely.'),
    ('Replacement Magnetic LED Charging Dock', 'LED Lights', 14.99, None, 48, False,
     'Sleek inductive charging base with USB-C braided cable for all Sparkle Deluxe wireless LED mouthpieces.'),

    # Whitening Strips
    ('Advanced Whitening Strips 28-Pack', 'Whitening Strips', 24.99, 19.99, 100, True,
     'Professional-grade whitening strips with enamel-safe formula. 28 treatments — a full 2-week course plus maintenance.'),
    ('Whitening Strips Sensitive 14-Pack', 'Whitening Strips', 21.99, None, 55, False,
     'Gentle formula designed for sensitive teeth. 14 treatments with enamel-safe 6% hydrogen peroxide.'),
    ('Activated Charcoal Dry-Grip Strips 14-Pack', 'Whitening Strips', 22.99, 17.99, 68, False,
     'No-slip dry-grip technology that seals securely over teeth without slipping while you talk or drink water.'),
    ('1-Hour Express Whitening Strips 7-Pack', 'Whitening Strips', 27.99, 21.99, 42, False,
     'Fast-action formula reveals whiter teeth in just 60 minutes for last-minute date nights or interviews.'),
    ('Coconut Oil & Spearmint Gentle Strips 21-Pack', 'Whitening Strips', 26.99, None, 37, False,
     'Organic cold-pressed virgin coconut oil with spearmint delivers natural pulling power and lasting fresh breath.'),
    ('Overnight Rejuvenating Whitening Strips 14-Pack', 'Whitening Strips', 29.99, 23.99, 31, False,
     'Slow-dissolving micro-gel strips designed to work peacefully while you sleep. Zero sticky residue.'),
    ('Kids & Teens Enamel-Safe Brightening Strips', 'Whitening Strips', 19.99, None, 24, False,
     'Ultra-mild formulation tested for young adult enamel. Removes brace stains safely without harsh bleaching.'),
    ('Smokers & Coffee Drinkers Heavy-Stain Strips', 'Whitening Strips', 28.99, 22.99, 58, False,
     'Targeted formula containing micro-cleansing bubbles that penetrate deep microscopic pores in tooth enamel.'),
    ('Annual Subscription 56-Strip Value Box', 'Whitening Strips', 42.99, 34.99, 30, False,
     'Full year of maintenance treatments in one economical pack. Never let stains dull your smile again.'),

    # Gels & Pens
    ('Whitening Pen 2-Pack', 'Gels & Pens', 19.99, 14.99, 80, True,
     'Convenient on-the-go whitening pens with precision brush tip. Perfect for touch-ups and travel.'),
    ('Desensitizing Gel 3-Pack Syringes', 'Gels & Pens', 15.99, 12.99, 70, False,
     'Post-whitening potassium nitrate and calcium phosphate gel that instantly soothes nerve endings.'),
    ('35% Carbamide Peroxide Refill Syringes (6-Pack)', 'Gels & Pens', 24.99, 19.99, 65, False,
     'High-yield 5ml syringes compatible with all dental trays. Over 30 full-mouth bleaching treatments.'),
    ('PAP+ Zero-Peroxide Whitening Pen Trio', 'Gels & Pens', 27.99, 22.99, 44, False,
     'Three precision pens powered by Phthalimidoperoxycaproic Acid (PAP+). No sensitivity, no enamel erosion.'),
    ('44% Dental Strength Nighttime Gel Refill', 'Gels & Pens', 26.99, None, 27, False,
     'Maximum permitted non-prescription strength for stubborn nicotine and tetracycline stains.'),
    ('Enamel Remineralizing Hydroxyapatite Gel Pen', 'Gels & Pens', 18.99, 14.99, 52, False,
     'Medical nano-hydroxyapatite pen that rebuilds micro-fissures in enamel while adding a glass-like sheen.'),
    ('Instant Glow Whitening Pen (Violet Pigment)', 'Gels & Pens', 16.99, None, 60, False,
     'Color science pen utilizing optical purple hues to neutralize yellow undertones within 30 seconds.'),
    ('Sparkle Mint Flavor-Boost Whitening Gel (4-Pack)', 'Gels & Pens', 21.99, 17.99, 38, False,
     'Infused with cooling peppermint and xylitol to keep mouth sweet and fresh throughout treatment.'),
    ('Precision Micro-Tip Whitening Pen', 'Gels & Pens', 17.99, None, 33, False,
     'Extra-fine 1mm silicone applicator to reach between teeth, crowded areas, and dental hardware.'),

    # Toothpastes & Powders
    ('Charcoal Whitening Toothpaste', 'Toothpastes & Powders', 12.99, None, 150, True,
     'Natural activated charcoal toothpaste that polishes away surface stains while freshening breath.'),
    ('V34 Color Corrector Purple Toothpaste Serum', 'Toothpastes & Powders', 19.99, 15.99, 85, True,
     'Non-invasive optical brightening treatment. Counteracts different yellow tones in your teeth.'),
    ('Nano-Hydroxyapatite Enamel Repair Toothpaste', 'Toothpastes & Powders', 15.99, 13.49, 92, False,
     'Fluoride-free biomimetic formula that deposits mineral building blocks directly into enamel tubules.'),
    ('Activated Coconut Charcoal Polishing Powder', 'Toothpastes & Powders', 14.99, 11.99, 64, False,
     'Ultra-fine bentonite clay and steam-activated charcoal powder for weekly stain detoxing.'),
    ('Herbal Enzyme Stain-Defense Toothpaste', 'Toothpastes & Powders', 13.99, None, 47, False,
     'Papain and bromelain fruit enzymes break down protein pellicle layer where stains adhere.'),
    ('Baking Soda & Peroxide Intensive Paste', 'Toothpastes & Powders', 11.99, 9.99, 120, False,
     'Time-tested micro-baking soda formula neutralizes harmful plaque acids while whitening enamel gently.'),
    ('Probiotic Oral Microbiome Whitening Paste', 'Toothpastes & Powders', 16.99, None, 39, False,
     'Enriched with live beneficial probiotics to support healthy gums and long-term breath freshness.'),
    ('Toothpaste Tube Duo (Day Whitener + Night Restorer)', 'Toothpastes & Powders', 24.99, 19.99, 55, False,
     'Morning paste guards against daily coffee stains; evening paste remineralizes enamel while you rest.'),

    # Accessories & Aftercare
    ('Custom Thermoform Dental Trays (4-Pack)', 'Accessories & Aftercare', 14.99, 11.99, 90, False,
     'Boil-and-bite customizable mouth trays for an airtight snug fit that holds whitening gel securely.'),
    ('Sonic Pulsating Whitening Toothbrush', 'Accessories & Aftercare', 49.99, 39.99, 45, True,
     '40,000 VPM sonic vibrations with DuPont bristles and blue LED brush head to polish teeth whiter.'),
    ('UV Sanitizing Retainer & Tray Case', 'Accessories & Aftercare', 29.99, 24.99, 35, False,
     'Eliminates 99.9% of bacteria from whitening trays, nightguards, and aligners in just 3 minutes with UV-C light.'),
    ('Sparkle Deluxe 20-Shade Dental Color Guide', 'Accessories & Aftercare', 9.99, None, 110, False,
     'Professional 3D acrylic shade guide to accurately measure and track your smile transformation.'),
    ('Natural Bamboo Charcoal Toothbrush (4-Pack)', 'Accessories & Aftercare', 11.99, 8.99, 80, False,
     '100% biodegradable Moso bamboo handles with charcoal-infused tapered bristles for gentle gum care.'),
    ('Enamel Shield Remineralizing Mouthwash 500ml', 'Accessories & Aftercare', 13.99, None, 72, False,
     'Alcohol-free post-whitening rinse that seals porous enamel and prevents new stains from coffee and tea.'),
    ('Velvet Travel Pouch & Waterproof Case', 'Accessories & Aftercare', 12.99, 9.99, 50, False,
     'Water-resistant luxury travel bag designed to fit whitening pens, LED device, and charging cable.'),
    ('Tongue Scraper & Oral Hygiene Cleaner', 'Accessories & Aftercare', 8.99, 6.99, 140, False,
     'Surgical-grade medical stainless steel tongue scraper that lifts bacteria and enhances mouth freshness.'),
]


class Command(BaseCommand):
    help = 'Seeds the database with 52 demo products, categories, and coupons'

    def handle(self, *args, **options):
        cats = {}
        for name, desc in CATEGORIES:
            cat, _ = Category.objects.get_or_create(name=name, defaults={'description': desc})
            cats[name] = cat

        created = 0
        for entry in PRODUCTS:
            name, cat_name, price, discount, stock, featured, desc = entry
            _, was_created = Product.objects.get_or_create(
                name=name,
                defaults={
                    'category': cats[cat_name],
                    'description': desc,
                    'price': price,
                    'discount_price': discount,
                    'stock': stock,
                    'is_featured': featured,
                }
            )
            if was_created:
                created += 1

        Coupon.objects.get_or_create(
            code='SPARKLE10', defaults={'discount_percent': 10, 'is_active': True, 'max_uses': 100},
        )
        Coupon.objects.get_or_create(
            code='WELCOME15', defaults={'discount_percent': 15, 'is_active': True, 'max_uses': 50},
        )

        self.stdout.write(self.style.SUCCESS(f'Database populated: {len(cats)} categories, {created} new products, coupons active.'))
