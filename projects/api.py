from projects.models import Project, Article, Category, Order, OrderItem, Report, User
from rest_framework import viewsets, permissions
from .serializers import ProjectSerializer, ArticleSerializer,CategorySerializer , OrderSerializer, OrderItemSerializer, ReportSerializer, UserSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset=Project.objects.all()
    permission_classes= [permissions.AllowAny]
    serializer_class= ProjectSerializer
    
class ArticleViewSet(viewsets.ModelViewSet):
    queryset=Article.objects.all()
    permission_classes=[permissions.AllowAny]
    serializer_class= ArticleSerializer
    
class CategoryViewSet(viewsets.ModelViewSet):
    queryset=Category.objects.all()
    permission_classes=[permissions.AllowAny]
    serializer_class= CategorySerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset=Order.objects.all()
    permission_classes=[permissions.AllowAny]
    serializer_class= OrderSerializer
    
class OrderItemViewSet(viewsets.ModelViewSet):
    queryset=OrderItem.objects.all()
    permission_classes=[permissions.AllowAny]
    serializer_class= OrderItemSerializer
    
class ReportViewSet(viewsets.ModelViewSet):
    queryset=Report.objects.all()
    permission_classes=[permissions.AllowAny]
    serializer_class= ReportSerializer
    
class UserViewSet(viewsets.ModelViewSet):
    queryset=User.objects.all()
    permission_classes=[permissions.AllowAny]
    serializer_class= UserSerializer