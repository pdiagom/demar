from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import Article, Category, User, Order, Cart, Report
from .serializers import (
    ArticleSerializer, CategorySerializer, UserSerializer,
    OrderSerializer, CartSerializer, ReportSerializer
)

# ARTÍCULOS (Article)
class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ArticleSerializer
    
    def list(self, request):
        articles = self.get_queryset()
        serializer = self.get_serializer(articles, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        article = get_object_or_404(self.queryset, pk=pk)
        serializer = self.get_serializer(article)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # Asigna el usuario actual
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        article = get_object_or_404(self.queryset, pk=pk)
        serializer = self.get_serializer(article, data=request.data, partial=True)  # Actualización parcial
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        article = get_object_or_404(self.queryset, pk=pk)
        article.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# CATEGORÍAS (Category)
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = CategorySerializer

# USUARIOS (User)
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAdminUser]  # Solo accesible para administradores
    serializer_class = UserSerializer
    
    def list(self, request):
        users = self.queryset
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        user = get_object_or_404(self.queryset, pk=pk)
        serializer = self.get_serializer(user)
        return Response(serializer.data)

# PEDIDOS (Order)
class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]  # Solo usuarios autenticados

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)  # Solo pedidos del usuario autenticado

# CARRITO (Cart)
class CartViewSet(viewsets.ModelViewSet):    
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)  # Solo el carrito del usuario autenticado

# REPORTES (Report)
class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Report.objects.filter(user=self.request.user)  # Solo los reportes del usuario autenticado
