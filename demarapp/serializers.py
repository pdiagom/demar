from rest_framework import serializers
from .models import Article, Category, OrderItem, User, Order, Cart,CartItem, Report
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
    image = serializers.ImageField(use_url=True)
    
    class Meta:
        model = Article
        fields ='__all__'
        
    def to_internal_value(self, data):
        if data.get('image') and isinstance(data['image'], str):
            # Si es una URL, no lo procesa como un archivo
            self.fields['image'] = serializers.URLField(required=False, allow_null=True)
        return super().to_internal_value(data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.image:
            if isinstance(instance.image, str):
                representation['image'] = instance.image
            else:
                representation['image'] = instance.image.url
        return representation

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['idCategory', 'name', 'description']



class OrderItemSerializer(serializers.ModelSerializer):
    article_name = serializers.CharField(source='article.name', read_only=True)
    article_price = serializers.FloatField(source='article.price', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['article', 'article_name', 'article_price', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

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
