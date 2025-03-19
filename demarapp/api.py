
from rest_framework import viewsets, permissions
from .models import Article, Category, User, Order, Cart, Report
from .serializers import ArticleSerializer, CategorySerializer, UserSerializer, OrderSerializer, CartSerializer, ReportSerializer
from rest_framework.response import Response
from rest_framework import status

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    permissions_classes = [permissions.AllowAny]
    serializer_class = ArticleSerializer
    
    
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    permissions_classes = [permissions.AllowAny]
    serializer_class = CategorySerializer
    
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permissions_classes = [permissions.AllowAny]
    serializer_class = UserSerializer
    
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    permissions_classes = [permissions.AllowAny]
    serializer_class = OrderSerializer

class CartViewSet(viewsets.ModelViewSet):    
    queryset = Cart.objects.all()
    permissions_classes = [permissions.AllowAny]
    serializer_class = CartSerializer
    
class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    permissions_classes = [permissions.AllowAny]
    serializer_class = ReportSerializer

