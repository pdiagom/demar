from django.urls import path
from rest_framework import routers

from demarapp.views import LoginView, RegisterView
from .views import ArticleViewSet, CategoryViewSet, OrderViewSet, CartDetailView,CartItemCreateView, ReportViewSet
from .api import UserViewSet
router=routers.DefaultRouter()

router.register(r'articles', ArticleViewSet, 'articles')
router.register(r'categories', CategoryViewSet, 'categories')
router.register(r'users', UserViewSet, 'users')
router.register(r'orders', OrderViewSet, 'orders')
router.register(r'reports', ReportViewSet, 'reports')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('cart/', CartDetailView.as_view(), name='cart-detail'),
    path('cart/items/', CartItemCreateView.as_view(), name='cart-item-create'),
]
urlpatterns += router.urls
