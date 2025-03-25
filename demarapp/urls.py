from django.urls import path
from rest_framework import routers

from demarapp.views import LoginView, RegisterView
from .views import ArticleViewSet, CategoryViewSet, OrderViewSet, CartViewSet, ReportViewSet
from .api import UserViewSet
router=routers.DefaultRouter()

router.register(r'articles', ArticleViewSet, 'articles')
router.register(r'categories', CategoryViewSet, 'categories')
router.register(r'users', UserViewSet, 'users')
router.register(r'orders', OrderViewSet, 'orders')
router.register(r'carts', CartViewSet, 'carts')
router.register(r'reports', ReportViewSet, 'reports')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
]
urlpatterns += router.urls
