from rest_framework import routers
from .api import ProjectViewSet, ArticleViewSet, CategoryViewSet, OrderViewSet, OrderItemViewSet, ReportViewSet, UserViewSet

router=routers.DefaultRouter()

router.register('api/projects', ProjectViewSet, 'projects')
router.register('api/article', ArticleViewSet, 'articles')
router.register('api/category', CategoryViewSet, 'categories')
router.register('api/order', OrderViewSet, 'orders')
router.register('api/orderItem', OrderItemViewSet, 'orderItems')
router.register('api/report', ReportViewSet, 'reports')
router.register('api/user', UserViewSet, 'users')

urlpatterns = router.urls
