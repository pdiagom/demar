from rest_framework import serializers
from .models import Article, Category, User, Order, Cart, Report
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'phone', 'address', 'city', 'country', 'postalCode', 'role']
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'name', 'phone', 'address', 'city', 'country', 'postalCode']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data.get('name', ''),
            phone=validated_data.get('phone', ''),
            address=validated_data.get('address', ''),
            city=validated_data.get('city', ''),
            country=validated_data.get('country', ''),
            postalCode=validated_data.get('postalCode', ''),
        )
        return user

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['idArticle', 'name', 'numRef', 'description', 'price', 'stock', 'categoryId']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['idCategory', 'name', 'description']



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
