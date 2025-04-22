from rest_framework import serializers
from .models import Article, Category, User, Order, Cart,CartItem, Report
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
        fields = ['idArticle', 'name', 'numRef', 'description', 'price', 'stock', 'image', 'categoryId']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['idCategory', 'name', 'description']



class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
class CartItemSerializer(serializers.ModelSerializer):
    article = ArticleSerializer()  # Incluir información del artículo

    class Meta:
        model = CartItem
        fields = ['id', 'article', 'quantity']
        
    def validate_article(self, value):
        if not Article.objects.filter(id=value['idArticle']).exists():
            raise serializers.ValidationError("El artículo no existe.")
        return value
        
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['idCart', 'total', 'date', 'user', 'items']


        
class ReportSerializer(serializers.ModelSerializer):
    userId = UserSerializer()  # Para incluir los detalles del usuario que creó el informe

    class Meta:
        model = Report
        fields = ['idReport', 'description', 'date', 'userId']
