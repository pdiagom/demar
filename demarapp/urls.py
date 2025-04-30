from django.urls import include, path
from rest_framework import routers
from demarapp.views import LoginView, RegisterView
from .views import ArticleViewSet, CheckoutView, OrderViewSet, ReportViewSet,CartItemViewSet, CategoryViewSet,CartViewSet, UserProfileView
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
    path('users/me/', UserProfileView.as_view(), name='user_profile'),
    path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
]

urlpatterns += router.urls
