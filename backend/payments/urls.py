from django.urls import path
from . import views

urlpatterns = [
    path('checkout/<int:order_id>/', views.CreateCheckoutSessionView.as_view(), name='create-checkout'),
    path('verify/<int:order_id>/', views.VerifyPaymentView.as_view(), name='verify-payment'),
    path('webhook/', views.StripeWebhookView.as_view(), name='stripe-webhook'),
]
