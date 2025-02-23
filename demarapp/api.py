
from rest_framework import viewsets, permissions
from .models import Article, Category, User, Order, Cart, Report
from .serializers import ArticleSerializer, CategorySerializer, UserSerializer, OrderSerializer, CartSerializer, ReportSerializer
from rest_framework.response import Response
from rest_framework import status

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    permissions_classes = [permissions.AllowAny]
    serializer_class = ArticleSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # Asigna el usuario actual
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, pk=None):
        connection = self.get_object()
        serializer = self.get_serializer(connection, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
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

