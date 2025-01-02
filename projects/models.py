from django.db import models

# Create your models here.

class Project(models.Model):
    title=models.CharField(max_length=200)
    description=models.TextField()
    technology=models.CharField(max_length=200)
    created_at=models.DateTimeField(auto_now_add=True)
    
class Article(models.Model):
    name=models.CharField(max_length=200)
    description=models.TextField()
    price=models.DecimalField(max_digits=4, decimal_places=2)
    stock=models.IntegerField()
    category_id=models.IntegerField()
    created_at=models.DateTimeField(auto_now_add=True)
    
class Category(models.Model):
    name=models.CharField(max_length=200)
    created_at=models.DateTimeField(auto_now_add=True)

class Order(models.Model):
    user_id=models.IntegerField()
    total_price=models.DecimalField(max_digits=4, decimal_places=2)
    status=models.IntegerField()
    created_at=models.DateTimeField(auto_now_add=True)
    
class OrderItem(models.Model):
    order_id=models.IntegerField()
    article_id=models.IntegerField()
    quantity=models.IntegerField()
    
class Report(models.Model):
    admin_id=models.IntegerField()
    description=models.TextField()
    status=models.IntegerField()
    created_at=models.DateTimeField(auto_now_add=True)

class User(models.Model):
    username=models.CharField(max_length=200)
    email=models.EmailField((""), max_length=254)
    password=models.CharField(max_length=200)
    first_name=models.CharField(max_length=200)
    last_name=models.CharField(max_length=200)
    role=models.IntegerField()
    is_active=models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now_add=True)
    