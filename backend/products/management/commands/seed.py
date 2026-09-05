from django.core.management.base import BaseCommand
from products.models import Category, Product
from orders.models import Coupon

CATEGORIES = [
    ('Whitening Kits', 'Complete at-home teeth whitening kits with everything you need.'),
    ('LED Lights', 'Accelerator LED lights to speed up the whitening process.'),
    ('Whitening Strips', 'Easy-to-use strips for gradual whitening.'),
    ('Gels & Pens', 'Whitening gels and pens for targeted application.'),
    ('Accessories', 'Aftercare products, toothpastes, and more.'),
]

PRODUCTS = [
    ('Sparkle Pro Whitening Kit', 'Whitening Kits', 49.99, 39.99, 45, True,
     'Our flagship at-home whitening kit. Includes LED accelerator light, 3 syringes of premium whitening gel (35% carbamide peroxide), custom-fit trays, and a shade guide. Visible results in as little as 3 days.'),
    ('Sparkle Lite LED Accelerator', 'LED Lights', 29.99, None, 60, True,
     '5x LED accelerator light with 16 powerful bulbs. Accelerates whitening gel activation for faster, longer-lasting results. Compatible with all whitening gels.'),
    ('Advanced Whitening Strips 28-Pack', 'Whitening Strips', 24.99, 19.99, 100, False,
     'Professional-grade whitening strips with enamel-safe formula. 28 treatments — a full 2-week course plus maintenance. Removes years of stains from coffee, tea, and wine.'),
    ('Whitening Pen 2-Pack', 'Gels & Pens', 19.99, 14.99, 80, True,
     'Convenient on-the-go whitening pens with precision brush tip. Perfect for touch-ups and travel. Mint-flavored, enamel-safe, no sensitivity.'),
    ('Sparkle Deluxe Home Kit', 'Whitening Kits', 79.99, 64.99, 30, False,
     'Everything in the Pro kit plus a desensitizing gel, extra whitening syringes, and a premium travel case. The complete smile makeover.'),
    ('Ultraviolet LED Light Pro', 'LED Lights', 39.99, 32.99, 25, False,
     'Dual-light technology combining blue LED and gentle UV for maximum gel activation. Rechargeable via USB-C with 30-minute battery life.'),
    ('Charcoal Whitening Toothpaste', 'Accessories', 12.99, None, 150, False,
     'Natural activated charcoal toothpaste that polishes away surface stains while freshening breath. Fluoride-free, safe for daily use.'),
    ('Desensitizing Gel 3-Pack', 'Accessories', 15.99, 12.99, 70, False,
     'Post-whitening desensitizing gel that soothes enamel and reduces sensitivity. Apply after each whitening session for comfortable treatment.'),
    ('Whitening Strips Sensitive 14-Pack', 'Whitening Strips', 21.99, None, 55, False,
     'Gentle formula designed for sensitive teeth. 14 treatments with enamel-safe 6% hydrogen peroxide. Gradual, comfortable whitening.'),
    'MOCK',
]


class Command(BaseCommand):
    help = 'Seeds the database with demo categories, products, and coupons'

    def handle(self, *args, **options):
        if Product.objects.exists():
            self.stdout.write(self.style.WARNING('Products already exist — skipping seed.'))
            return

        cats = {}
        for name, desc in CATEGORIES:
            cat, _ = Category.objects.get_or_create(name=name, defaults={'description': desc})
            cats[name] = cat

        created = 0
        for entry in PRODUCTS:
            if entry == 'MOCK':
                continue
            name, cat_name, price, discount, stock, featured, desc = entry
            Product.objects.create(
                category=cats[cat_name], name=name, description=desc,
                price=price, discount_price=discount, stock=stock,
                is_featured=featured,
            )
            created += 1

        Coupon.objects.get_or_create(
            code='SPARKLE10', defaults={'discount_percent': 10, 'is_active': True, 'max_uses': 100},
        )
        Coupon.objects.get_or_create(
            code='WELCOME15', defaults={'discount_percent': 15, 'is_active': True, 'max_uses': 50},
        )

        self.stdout.write(self.style.SUCCESS(f'Seeded {len(cats)} categories, {created} products, 2 coupons.'))
