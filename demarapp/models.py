from django.utils import timezone
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El email es obligatorio')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=100, unique=True, null=False, blank=False)
    email = models.EmailField(unique=True, null=False, blank=False)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=100, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    postalCode = models.CharField(max_length=100, blank=True, null=True)
    role = models.IntegerField(default=0)  # 0 = Usuario normal, 1 = Admin
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()
    
    USERNAME_FIELD = 'username'
 
    
    def __str__(self):
        return self.username

class Article(models.Model):
    idArticle = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, null= False, blank= False)
    numRef= models.CharField(max_length=100, null= False, blank= False)
    description = models.TextField()
    price = models.FloatField( null= False, blank= False)
    stock = models.IntegerField( null= False, blank= False)
    image = models.TextField(null=True, blank=True)
    categoryId = models.ForeignKey('Category', on_delete=models.CASCADE)
    
    
    def __str__(self):
        return str(self.idArticle)
class Category(models.Model):
    idCategory = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, null= False, blank= False)
    description = models.TextField()
        
    def __str__(self):
        return str(self.idCategory)

            
class Order(models.Model):
    idOrder = models.AutoField(primary_key=True)
    orderItems = models.ManyToManyField(Article, through='OrderItem')
    total = models.FloatField()
    date = models.DateTimeField(default=timezone.now)
    shippingAddress = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    postalCode = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    paymentMethod = models.CharField(max_length=100)
    userId = models.ForeignKey('User', on_delete=models.CASCADE)
    
    STATUS_CHOICES = [
        ('Pendiente', 'Pendiente'),
        ('En Proceso', 'En Proceso'),
        ('Completado', 'Completado'),
        ('Cancelado', 'Cancelado'),
    ]
    
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, default='Pendiente')

    @classmethod
    def create_order(cls, cart, shipping_data):
        order = cls.objects.create(
            userId=cart.user,
            total=cart.total,
            status="Pendiente",
            paymentMethod=shipping_data['paymentMethod'],
            shippingAddress=shipping_data['shippingAddress'],
            city=shipping_data['city'],
            postalCode=shipping_data['postalCode'],
            country=shipping_data['country']
        )
        # Crear OrderItems a partir de los CartItems
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                article=cart_item.article,
                quantity=cart_item.quantity
            )
        
        # Vaciar el carrito después de crear el pedido
        cart.items.all().delete()
        cart.total = 0.0
        cart.save()
        return order
    
    def __str__(self):
        return str(self.idOrder)

    
class OrderItem(models.Model):
    order = models.ForeignKey('Order', related_name='items', on_delete=models.CASCADE)
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.article.name} in Order {self.order.idOrder}"

    
class Cart(models.Model):
    idCart = models.AutoField(primary_key=True)
    total = models.FloatField(default=0.0)
    date = models.DateField(auto_now_add=True)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    
    def calculate_total(self):
        total = sum(item.article.price * item.quantity for item in self.items.all())
        self.total = total
        self.save()
        
    def checkout(self):
        self.items.all().delete()
        self.total = 0.0
        self.save()
    
    def __str__(self):
        return str(self.idCart)
    
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)  
    article = models.ForeignKey(Article, on_delete=models.CASCADE)  
    quantity = models.PositiveIntegerField(default=1)  

    def __str__(self):
        return f"{self.quantity} x {self.article.name} in Cart {self.cart.idCart}"   

class Report(models.Model):
    idReport = models.AutoField(primary_key=True)
    description = models.TextField( null= False, blank= False)
    date = models.DateField()
    userId = models.ForeignKey('User', on_delete=models.CASCADE)
    
    def __str__(self):
        return str(self.idReport)