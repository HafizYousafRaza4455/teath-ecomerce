from django.urls import path
from . import views, admin_views

urlpatterns = [
    # Cart
    path('cart/', views.CartView.as_view(), name='cart'),
    path('cart/add/', views.CartAddView.as_view(), name='cart-add'),
    path('cart/update/<int:item_id>/', views.CartUpdateView.as_view(), name='cart-update'),
    path('cart/remove/<int:item_id>/', views.CartRemoveView.as_view(), name='cart-remove'),
    path('cart/clear/', views.CartClearView.as_view(), name='cart-clear'),
    # Coupons
    path('coupons/validate/', views.CouponValidateView.as_view(), name='coupon-validate'),
    # Orders
    path('orders/', views.OrderCreateView.as_view(), name='order-create'),
    path('orders/history/', views.OrderListView.as_view(), name='order-history'),
    path('orders/<int:pk>/', views.OrderDetailView.as_view(), name='order-detail'),
    # Admin
    path('admin/dashboard/', admin_views.AdminDashboardView.as_view(), name='admin-dashboard'),
    path('admin/orders/', admin_views.AdminOrderListView.as_view(), name='admin-orders'),
    path('admin/orders/<int:order_id>/status/', admin_views.AdminOrderUpdateStatusView.as_view(), name='admin-order-status'),
    path('admin/products/', admin_views.AdminProductListCreateView.as_view(), name='admin-products'),
    path('admin/products/<int:pk>/', admin_views.AdminProductDetailView.as_view(), name='admin-product-detail'),
    path('admin/categories/', admin_views.AdminCategoryListCreateView.as_view(), name='admin-categories'),
    path('admin/customers/', admin_views.AdminCustomerListView.as_view(), name='admin-customers'),
]
