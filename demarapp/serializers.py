from rest_framework import serializers
from .models import Article, Category, User, Order, Cart, Report

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['idArticle', 'name', 'numRef', 'description', 'price', 'stock', 'categoryId']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['idCategory', 'name', 'description']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['idUser', 'name', 'email', 'password', 'phone', 'address', 'city', 'country', 'postalCode', 'role']

class OrderSerializer(serializers.ModelSerializer):
    orderItem = ArticleSerializer(many=True)  # Para incluir los artículos dentro del pedido
    userId = UserSerializer()  # Para incluir los detalles del usuario que hizo la orden

    class Meta:
        model = Order
        fields = ['idOrder', 'orderItem', 'total', 'date', 'status', 'paymentMethod', 'userId']

class CartSerializer(serializers.ModelSerializer):
    cartItem = ArticleSerializer(many=True)  # Para incluir los artículos dentro del carrito
    userId = UserSerializer()  # Para incluir los detalles del usuario que tiene el carrito

    class Meta:
        model = Cart
        fields = ['idCart', 'cartItem', 'total', 'date', 'userId']

class ReportSerializer(serializers.ModelSerializer):
    userId = UserSerializer()  # Para incluir los detalles del usuario que creó el informe

    class Meta:
        model = Report
        fields = ['idReport', 'description', 'date', 'userId']
