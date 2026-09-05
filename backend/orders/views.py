from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from products.models import Product
from .models import Address, Cart, CartItem, Coupon, Order, OrderItem
from .serializers import (
    CartSerializer, OrderSerializer, CreateOrderSerializer, CouponSerializer,
)


def get_or_create_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart = get_or_create_cart(request.user)
        return Response(CartSerializer(cart).data)


class CartAddView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        product = get_object_or_404(Product, id=product_id, is_active=True)

        if product.stock < quantity:
            return Response({'error': 'Not enough stock'}, status=status.HTTP_400_BAD_REQUEST)

        cart = get_or_create_cart(request.user)
        item, created = CartItem.objects.get_or_create(
            cart=cart, product=product, defaults={'quantity': quantity}
        )
        if not created:
            if product.stock < item.quantity + quantity:
                return Response({'error': 'Not enough stock'}, status=status.HTTP_400_BAD_REQUEST)
            item.quantity += quantity
            item.save()
        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)


class CartUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, item_id):
        cart = get_or_create_cart(request.user)
        item = get_object_or_404(CartItem, id=item_id, cart=cart)
        quantity = int(request.data.get('quantity', item.quantity))

        if quantity <= 0:
            item.delete()
        else:
            if item.product.stock < quantity:
                return Response({'error': 'Not enough stock'}, status=status.HTTP_400_BAD_REQUEST)
            item.quantity = quantity
            item.save()
        return Response(CartSerializer(cart).data)


class CartRemoveView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, item_id):
        cart = get_or_create_cart(request.user)
        item = get_object_or_404(CartItem, id=item_id, cart=cart)
        item.delete()
        return Response(CartSerializer(cart).data)


class CartClearView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        cart = get_or_create_cart(request.user)
        cart.items.all().delete()
        return Response(CartSerializer(cart).data)


class CouponValidateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        code = request.data.get('code', '').strip().upper()
        coupon = Coupon.objects.filter(code=code).first()
        if not coupon or not coupon.is_valid:
            return Response({'valid': False, 'error': 'Invalid or expired coupon'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'valid': True, 'coupon': CouponSerializer(coupon).data})


class OrderCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = get_or_create_cart(request.user)
        if not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        address = get_object_or_404(Address, id=serializer.validated_data['address_id'], user=request.user)
        coupon = None
        coupon_code = serializer.validated_data.get('coupon_code', '')
        if coupon_code:
            coupon = Coupon.objects.filter(code=coupon_code.strip().upper()).first()
            if not coupon or not coupon.is_valid:
                return Response({'error': 'Invalid coupon'}, status=status.HTTP_400_BAD_REQUEST)

        subtotal = sum(i.product.effective_price * i.quantity for i in cart.items.select_related('product'))
        discount = subtotal * coupon.discount_percent / 100 if coupon else 0
        total = subtotal - discount

        order = Order.objects.create(
            user=request.user, address=address, coupon=coupon,
            subtotal=subtotal, discount=discount, total=total,
        )
        for item in cart.items.select_related('product'):
            OrderItem.objects.create(
                order=order, product=item.product, quantity=item.quantity,
                price=item.product.effective_price,
            )

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')
