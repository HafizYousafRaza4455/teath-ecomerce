from django.contrib import admin
from .models import Address, Cart, CartItem, Coupon, Order, OrderItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_items')
    inlines = [CartItemInline]

    def total_items(self, obj):
        return obj.total_items


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'user', 'city', 'country', 'is_default')
    search_fields = ('full_name', 'city')


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_percent', 'is_active', 'used_count', 'max_uses', 'valid_to')
    list_filter = ('is_active',)


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'quantity', 'price')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'payment_status', 'total', 'created_at')
    list_filter = ('status', 'payment_status')
    search_fields = ('user__email', 'stripe_session_id')
    inlines = [OrderItemInline]
