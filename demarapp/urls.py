from django.urls import path
from rest_framework import routers

from demarapp.views import LoginView, RegisterView
from .api import ArticleViewSet, CategoryViewSet, UserViewSet, OrderViewSet, CartViewSet, ReportViewSet

router=routers.DefaultRouter()

router.register('demar/articles', ArticleViewSet, 'articles')
router.register('demar/categories', CategoryViewSet, 'categories')
router.register('demar/users', UserViewSet, 'users')
router.register('demar/orders', OrderViewSet, 'orders')
router.register('demar/carts', CartViewSet, 'carts')
router.register('demar/reports', ReportViewSet, 'reports')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
]
urlpatterns += router.urls
