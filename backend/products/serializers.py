from rest_framework import serializers
from .models import Category, Product, Review


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'description', 'product_count')


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.first_name', read_only=True)

    class Meta:
        model = Review
        fields = ('id', 'product', 'user', 'user_name', 'rating', 'comment', 'is_approved', 'created_at')
        read_only_fields = ('user', 'is_approved')


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    effective_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    in_stock = serializers.BooleanField(read_only=True)
    avg_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'description', 'price', 'discount_price', 'effective_price',
            'stock', 'image', 'is_active', 'is_featured', 'created_at', 'updated_at',
            'category', 'category_name', 'category_slug', 'avg_rating', 'review_count', 'in_stock',
        )
        read_only_fields = ('created_at', 'updated_at')

    def get_avg_rating(self, obj):
        reviews = obj.reviews.filter(is_approved=True)
        if not reviews.exists():
            return None
        return round(sum(r.rating for r in reviews) / reviews.count(), 1)

    def get_review_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()


class ProductDetailSerializer(ProductSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta(ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields + ('reviews',)
