from django.db.models import Count, Q
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Product, Review
from .serializers import (
    CategorySerializer, ProductSerializer, ProductDetailSerializer, ReviewSerializer,
)


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.annotate(product_count=Count('products', filter=Q(products__is_active=True)))
    serializer_class = CategorySerializer


class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True).select_related('category')
        category = self.request.query_params.get('category')
        search = self.request.query_params.get('search')
        featured = self.request.query_params.get('featured')
        ordering = self.request.query_params.get('ordering', '-created_at')

        if category:
            queryset = queryset.filter(category__slug=category)
        if search:
            queryset = queryset.filter(Q(name__icontains=search) | Q(description__icontains=search))
        if featured == 'true':
            queryset = queryset.filter(is_featured=True)

        allowed_orderings = {
            'price', '-price', 'created_at', '-created_at', 'name', '-name',
            'effective_price', '-effective_price',
        }
        if ordering not in allowed_orderings:
            ordering = '-created_at'
        return queryset.order_by(ordering)


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True).select_related('category')
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'


class FeaturedProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(is_active=True, is_featured=True).select_related('category')


class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
