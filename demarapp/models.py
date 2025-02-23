from django.db import models

# Create your models here.
class Article(models.Model):
    idArticle = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    numRef= models.CharField(max_length=100)
    description = models.TextField()
    price = models.FloatField()
    stock = models.IntegerField()
    categoryId = models.ForeignKey('Category', on_delete=models.CASCADE)
    
    def __str__(self):
        return str(self.idArticle)
class Category(models.Model):
    idCategory = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
        
    def __str__(self):
        return str(self.idCategory)
class User(models.Model):
    idUser = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    password = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)
    address = models.TextField()
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    postalCode = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    
    def __str__(self):
        return str(self.idUser)
            
class Order(models.Model):
    idOrder = models.AutoField(primary_key=True)
    orderItem = models.ManyToManyField(Article)
    total = models.FloatField()
    date = models.DateField()
    status = models.CharField(max_length=100)
    paymentMethod = models.CharField(max_length=100)
    userId = models.ForeignKey('User', on_delete=models.CASCADE)
    
    def __str__(self):
        return str(self.idOrder)
    
class Cart(models.Model):
    idCart = models.AutoField(primary_key=True)
    cartItem = models.ManyToManyField(Article)
    total = models.FloatField()
    date = models.DateField()
    userId = models.ForeignKey('User', on_delete=models.CASCADE)
    
    def __str__(self):
        return str(self.idCart)
    
class Report(models.Model):
    idReport = models.AutoField(primary_key=True)
    description = models.TextField()
    date = models.DateField()
    userId = models.ForeignKey('User', on_delete=models.CASCADE)
    
    def __str__(self):
        return str(self.idReport)