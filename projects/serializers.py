from rest_framework import serializers
from .models import Project, Article, Category, Order, OrderItem, Report, User


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model=Project
        fields=('id', 'title', 'description', 'technology', 'created_at')
        read_only_field=('created_at', )

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model=Article
        fields=('id','name','description','price','stock','category_id','created_at')
        read_only_field=('created_at')
        
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=Category
        fields=('id', 'name', 'created_at')
        read_only_field=('created_at')

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model=Order
        fields=('id', 'user_id', 'total_price', 'status', 'created_at')
        read_only_field=('created_at')
        
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model=OrderItem
        fields=('id', 'order_id', 'article_id', 'quantity')
        
class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model=Report
        fields=('id', 'admin_id', 'description', 'status', 'created_at')
        read_only_fields=('created_at')
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=('id', 'username', 'email', 'password', 'first_name', 'last_name', 'role', 'is_active', 'created_at')
        read_only_fields=( 'is_active', 'created_at')
