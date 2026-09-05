from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem, Coupon, Address
from products.serializers import ProductSerializer


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = '__all__'


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ('id', 'product', 'quantity', 'total_price')


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_items = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = ('id', 'items', 'total_price', 'total_items', 'created_at', 'updated_at')


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_slug = serializers.CharField(source='product.slug', read_only=True)
    product_image = serializers.ImageField(source='product.image', read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_name', 'product_slug', 'product_image', 'quantity', 'price', 'total_price')


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    coupon_code = serializers.CharField(source='coupon.code', read_only=True, default=None)

    class Meta:
        model = Order
        fields = (
            'id', 'user', 'user_email', 'address', 'coupon', 'coupon_code', 'status', 'payment_status',
            'subtotal', 'discount', 'total', 'stripe_session_id', 'items', 'created_at', 'updated_at',
        )
        read_only_fields = ('user', 'subtotal', 'discount', 'total', 'stripe_session_id', 'status', 'payment_status')


class CreateOrderSerializer(serializers.Serializer):
    address_id = serializers.IntegerField()
    coupon_code = serializers.CharField(required=False, allow_blank=True, default='')
