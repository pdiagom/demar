from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions
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
        username = request.data.get("username")
        password = request.data.get("password")
        print(username)
        print(password)
        user = authenticate(request, username=username, password=password)
        print(user)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "user": UserSerializer(user).data}, status=status.HTTP_200_OK)
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
    
    @action(detail=False, methods=['post'])
    def post(self, request):
        serializer = ArticleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  


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

        order = Order.create_order(cart, shipping_data)
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
    def items(self, request, pk=None):
        order = self.get_object()
        items = order.items.all()
        serializer = OrderItemSerializer(items, many=True)
        return Response(serializer.data)
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
