from django.contrib.auth import get_user_model
from django.db.models import Count, Sum
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Order
from .serializers import OrderSerializer
from products.models import Product, Category
from products.serializers import ProductSerializer, CategorySerializer

User = get_user_model()


class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff)


class AdminDashboardView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        paid_orders = Order.objects.filter(payment_status='paid')
        total_revenue = paid_orders.aggregate(Sum('total'))['total__sum'] or 0
        total_orders = Order.objects.count()
        pending_orders = Order.objects.filter(status='pending').count()
        total_customers = User.objects.filter(is_staff=False).count()
        total_products = Product.objects.count()
        low_stock_products = Product.objects.filter(stock__lt=5).count()

        top_products = []
        order_items = Order.objects.filter(payment_status='paid').values('items__product__name').annotate(rev=Sum('items__price') * 1)
        recent_orders = Order.objects.select_related('user').prefetch_related('items')[:10]

        return Response({
            'total_revenue': total_revenue,
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'total_customers': total_customers,
            'total_products': total_products,
            'low_stock_products': low_stock_products,
            'recent_orders': OrderSerializer(recent_orders, many=True).data,
        })


class AdminOrderListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        status_filter = request.query_params.get('status')
        queryset = Order.objects.select_related('user', 'address').prefetch_related('items').order_by('-created_at')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return Response(OrderSerializer(queryset, many=True).data)


class AdminOrderUpdateStatusView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, order_id):
        new_status = request.data.get('status')
        allowed = dict(Order.STATUS_CHOICES).keys()
        if new_status not in allowed:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        order = Order.objects.filter(id=order_id).first()
        if not order:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        order.status = new_status
        order.save()
        return Response(OrderSerializer(order).data)


class AdminProductListCreateView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        queryset = Product.objects.select_related('category').order_by('-created_at')
        return Response(ProductSerializer(queryset, many=True).data)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AdminProductDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get_object(self, pk):
        return Product.objects.filter(id=pk).first()

    def get(self, request, pk):
        product = self.get_object(pk)
        if not product:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ProductSerializer(product).data)

    def patch(self, request, pk):
        product = self.get_object(pk)
        if not product:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializer(product, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        product = self.get_object(pk)
        if not product:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminCategoryListCreateView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response(CategorySerializer(Category.objects.all(), many=True).data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AdminCouponListCreateView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        from .models import Coupon
        return Response(OrderSerializer([], many=True).data)

    def post(self, request):
        return Response({'error': 'Not implemented'}, status=status.HTTP_501_NOT_IMPLEMENTED)


class AdminCustomerListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        customers = User.objects.filter(is_staff=False).annotate(order_count=Count('orders'))
        data = []
        for c in customers:
            data.append({
                'id': c.id, 'email': c.email, 'first_name': c.first_name, 'last_name': c.last_name,
                'date_joined': c.date_joined, 'order_count': c.order_count,
            })
        return Response(data)
