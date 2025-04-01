from django.urls import path
from rest_framework import routers
from demarapp.views import LoginView, RegisterView
from .views import ArticleViewSet, CheckoutView, OrderViewSet, ReportViewSet,CartItemViewSet, CategoryViewSet,CartViewSet
from .api import UserViewSet

router = routers.DefaultRouter()
router.register(r'articles', ArticleViewSet, 'articles')
router.register(r'categories', CategoryViewSet, 'categories')
router.register(r'users', UserViewSet, 'users')
router.register(r'orders', OrderViewSet, 'orders')
router.register(r'reports', ReportViewSet, 'reports')
router.register(r'cart', CartViewSet)
router.register(r'cart-items', CartItemViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
     path('checkout/', CheckoutView.as_view({'post': 'create'}), name='checkout'),
]

urlpatterns += router.urls
