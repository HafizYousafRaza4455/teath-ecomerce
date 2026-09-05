import stripe
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from orders.models import Order
from orders.serializers import OrderSerializer

stripe.api_key = settings.STRIPE_SECRET_KEY


class CreateCheckoutSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, order_id):
        order = get_object_or_404(Order, id=order_id, user=request.user, payment_status='unpaid')

        line_items = []
        for item in order.items.select_related('product'):
            product = item.product
            if product.image:
                image_url = request.build_absolute_uri(product.image.url)
            else:
                image_url = 'https://via.placeholder.com/500'
            line_items.append({
                'price_data': {
                    'currency': 'usd',
                    'unit_amount': int(product.effective_price * 100),
                    'product_data': {
                        'name': product.name,
                        'images': [image_url],
                    },
                },
                'quantity': item.quantity,
            })

        session = stripe.checkout.Session.create(
            line_items=line_items,
            mode='payment',
            success_url=f'{settings.FRONTEND_URL}/checkout/success?order_id={order.id}&session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url=f'{settings.FRONTEND_URL}/checkout/cancel?order_id={order.id}',
            metadata={'order_id': order.id},
        )

        order.stripe_session_id = session.id
        order.save()
        return Response({'checkout_url': session.url, 'order': OrderSerializer(order).data})


class VerifyPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_id):
        order = get_object_or_404(Order, id=order_id, user=request.user)

        if order.payment_status == 'paid':
            return Response({'paid': True, 'order': OrderSerializer(order).data})

        if order.stripe_session_id:
            try:
                session = stripe.checkout.Session.retrieve(order.stripe_session_id)
                if session.payment_status == 'paid':
                    order.payment_status = 'paid'
                    order.status = 'paid'
                    order.save()
                    cart = request.user.cart
                    cart.items.all().delete()
                    return Response({'paid': True, 'order': OrderSerializer(order).data})
            except stripe.error.StripeError:
                pass

        return Response({'paid': False, 'order': OrderSerializer(order).data})


class StripeWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload = request.body
        sig_header = request.headers.get('Stripe-Signature', '')
        event = None

        if settings.STRIPE_WEBHOOK_SECRET:
            try:
                event = stripe.Webhook.construct_event(payload, sig_header, settings.STRIPE_WEBHOOK_SECRET)
            except (ValueError, stripe.error.SignatureVerificationError):
                return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'received': True})

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            order_id = session.get('metadata', {}).get('order_id')
            if order_id:
                order = Order.objects.filter(id=order_id).first()
                if order and order.payment_status != 'paid':
                    order.payment_status = 'paid'
                    order.status = 'paid'
                    order.save()

        return Response({'received': True})
