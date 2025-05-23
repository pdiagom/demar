from io import BytesIO
import os
import uuid
from django.shortcuts import get_object_or_404
from django.conf import settings
from rest_framework import viewsets, permissions,status

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, generics
from .models import Article, Category, User, Order, Cart,CartItem, Report
from .serializers import (
    ArticleSerializer, CategorySerializer, LoginSerializer, UserSerializer,
    OrderSerializer, CartSerializer,CartItemSerializer, ReportSerializer,RegisterSerializer, OrderItemSerializer
)
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, RegisterSerializer
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Count
import logging
import boto3
logger = logging.getLogger(__name__)
# USUARIOS (Users)
User = get_user_model()

class CheckUserExistsView(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')

        username_exists = User.objects.filter(username=username).exists() if username else False
        email_exists = User.objects.filter(email=email).exists() if email else False

        return Response({
            'usernameExists': username_exists,
            'emailExists': email_exists
        }, status=status.HTTP_200_OK)
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    def get_serializer_class(self):
        return LoginSerializer
    
    def post(self, request, *args, **kwargs):
        username_or_email = request.data.get("username")
        password = request.data.get("password")

        # Intenta autenticar con el nombre de usuario
        user = authenticate(request, username=username_or_email, password=password)

        # Si falla, intenta autenticar con el correo electrónico
        if user is None:
            try:
                user_obj = User.objects.get(email=username_or_email)
                user = authenticate(request, username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key,
                "user": UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        
        return Response({"error": "Credenciales inválidas"}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# ARTÍCULOS (Article)
class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    permission_classes = [permissions.AllowAny]  
    serializer_class = ArticleSerializer
    parser_classes = [MultiPartParser, FormParser]
    
   
    def create(self, request, *args, **kwargs):
        return self.handle_image_upload(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        return self.handle_image_upload(request, *args, **kwargs, update=True)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.image:
            self.delete_image_from_s3(instance.image)
        return super().destroy(request, *args, **kwargs)

    def handle_image_upload(self, request, *args, **kwargs):
        update = kwargs.pop('update', False)
    
        logger.info(f"Received data: {request.data}")
        logger.info(f"Received files: {request.FILES}")
    
        # Crear una copia mutable de los datos de la solicitud
        mutable_data = request.data.copy()
    
        image_file = request.FILES.get('image')
        image_url = mutable_data.get('image')

        if update:
            instance = self.get_object()
            old_image_url = instance.image
        else:
            old_image_url = None

        if image_file:
            try:
                s3 = boto3.client('s3',
                              aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                              aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                              region_name=settings.AWS_S3_REGION_NAME)
            
                # Generar un nombre de archivo único
                file_name = self.generate_unique_filename(image_file.name)
            
                file_content = BytesIO(image_file.read())
            
                s3.upload_fileobj(
                    file_content,
                    settings.AWS_STORAGE_BUCKET_NAME,
                    file_name,
                    ExtraArgs={'ACL': 'public-read'}
                )
            
                logger.info(f"Image uploaded successfully to S3: {file_name}")
            
                s3_file_url = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{file_name}"
                mutable_data['image'] = s3_file_url

                # Si estamos actualizando, eliminar la imagen anterior
                if update and old_image_url:
                    self.delete_old_image(old_image_url)
        
            except Exception as e:
                logger.error(f"Error uploading image to S3: {str(e)}")
                return Response({"error": f"S3 upload failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        elif image_url:
            # Si es una URL y estamos actualizando, verificar si ha cambiado
            if update and old_image_url and old_image_url != image_url:
                self.delete_old_image(old_image_url)
        elif update:
            # Si no se proporciona una nueva imagen y estamos actualizando, mantener la imagen existente
            mutable_data['image'] = old_image_url
        else:
            # Si no hay imagen y no estamos actualizando, establecer como None
            mutable_data['image'] = None

        if update:
            serializer = self.get_serializer(instance, data=mutable_data, partial=True)
        else:
            serializer = self.get_serializer(data=mutable_data)

        if serializer.is_valid():
            instance = serializer.save()
            logger.info(f"Article {'updated' if update else 'created'}: {instance}")
            logger.info(f"Image field: {instance.image}")
            return Response(serializer.data, status=status.HTTP_200_OK if update else status.HTTP_201_CREATED)
        else:
            logger.error(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    def generate_unique_filename(self, original_filename):
        """
        Genera un nombre de archivo único añadiendo un UUID.
        """
        name, ext = os.path.splitext(original_filename)
        return f"media/articles/{name}_{uuid.uuid4().hex}{ext}"
    
    def delete_image_from_s3(self, image_url):
        """
        Elimina la imagen de S3.
        """
        try:
            s3 = boto3.client('s3',
                              aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                              aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                              region_name=settings.AWS_S3_REGION_NAME)
            
            # Extraer el nombre del archivo de la URL
            file_name = image_url.split('/')[-1]
            
            s3.delete_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key=f"media/articles/{file_name}"
            )
            logger.info(f"Image deleted from S3: {file_name}")
        except Exception as e:
            logger.error(f"Error deleting image from S3: {str(e)}")

    def delete_old_image(self, old_image_url):
        """
        Elimina la imagen anterior de S3.
        """
        try:
            s3 = boto3.client('s3',
                              aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                              aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                              region_name=settings.AWS_S3_REGION_NAME)
            
            # Extraer el nombre del archivo de la URL
            old_file_name = old_image_url.split('/')[-1]
            
            s3.delete_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key=f"media/articles/{old_file_name}"
            )
            logger.info(f"Old image deleted from S3: {old_file_name}")
        except Exception as e:
            logger.error(f"Error deleting old image from S3: {str(e)}")
    def perform_create(self, serializer):
        image = self.request.data.get('image')
        if image:
            
            serializer.save(image=image)
        else:
            serializer.save()
  


# CATEGORÍAS (Category)
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = CategorySerializer



# PEDIDOS (Order)
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['put'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        if new_status and new_status in dict(Order.STATUS_CHOICES):
            order.status = new_status
            order.save()
            serializer = self.get_serializer(order)
            return Response(serializer.data)
        else:
            return Response({'status': 'failed', 'message': 'Invalid or no status provided'}, 
                            status=status.HTTP_400_BAD_REQUEST)
    @action(detail=False, methods=['get'])
    def user_orders(self, request):
        user_orders = self.queryset.filter(userId=request.user.id)
        serializer = self.get_serializer(user_orders, many=True)
        return Response(serializer.data)

    
    @action(detail=False, methods=['post'])
    def create_order_from_cart(self, request):
        cart_id = request.data.get('cartId')
        shipping_data = {
            'paymentMethod': request.data.get('paymentMethod'),
            'shippingAddress': request.data.get('shippingAddress'),
            'city': request.data.get('city'),
            'postalCode': request.data.get('postalCode'),
            'country': request.data.get('country')
        }

        try:
            cart = Cart.objects.get(idCart=cart_id, user=request.user)
        except Cart.DoesNotExist:
            return Response({'error': 'Carrito no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        # Validar stock antes de crear el pedido
        for item in cart.items.all():
            if item.quantity > item.article.stock:
                return Response({
                    'error': f"Stock insuficiente para el artículo {item.article.name} (disponible: {item.article.stock})"
                }, status=status.HTTP_400_BAD_REQUEST)

        # Restar stock y crear el pedido
        order = Order.create_order(cart, shipping_data)
    
        for item in order.items.all():
            article = item.article
            article.stock -= item.quantity
            article.save()

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    
    @action(detail=False, methods=['get'])
    def all_orders(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_queryset(self):
        queryset = self.queryset.prefetch_related('items__article')
        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    @action(detail=True, methods=['get'])
    def details(self, request, pk=None):
        order = self.get_object()
        order_serializer = OrderSerializer(order)
        items = order.items.all()
        items_serializer = OrderItemSerializer(items, many=True)
        
        response_data = {
            'order': order_serializer.data,
            'items': items_serializer.data
        }
        
        return Response(response_data)
    @action(detail=True, methods=['get'])
    def items(self, request, pk=None):
        order = self.get_object()
        items = order.items.all()
        serializer = OrderItemSerializer(items, many=True)
        return Response(serializer.data)
    @action(detail=False, methods=['get'])
    def order_stats(self, request):
        stats = Order.objects.values('status').annotate(count=Count('status'))
        result = {
            'Pendiente': 0,
            'En Proceso': 0,
            'Completado': 0,
            'Cancelado': 0
        }
        for item in stats:
            result[item['status']] = item['count']
        return Response(result)

# CARRITO (Cart)
class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
    @action(detail=False, methods=['post'])
    def create_cart_with_items(self, request):
        user = request.user
        items = request.data.get('items', [])
        
        if not items:
            return Response({'error': 'No hay artículos en el carrito.'}, status=status.HTTP_400_BAD_REQUEST)

        # Crear el carrito vacío
        cart = Cart.objects.create(user=user)
        
        # Crear los items
        for item in items:
            CartItem.objects.create(
                cart=cart,
                article_id=item['article']['idArticle'],
                quantity=item['quantity']
            )
        
        # Calcular total
        cart.calculate_total()
        
        return Response({'message': 'Carrito creado exitosamente.', 'cart_id': cart.idCart}, status=status.HTTP_201_CREATED)
class CheckoutView(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request):
        cart = Cart.objects.get(user=request.user)
        cart.checkout()
        return Response({"message": "Compra procesada exitosamente."}, status=status.HTTP_200_OK)

class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(cart__user=self.request.user)




class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


# REPORTES (Report)
class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Report.objects.filter(user=self.request.user)  # Solo los reportes del usuario autenticado
