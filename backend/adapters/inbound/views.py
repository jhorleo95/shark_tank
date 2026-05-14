from django.db import transaction
from rest_framework import viewsets
from adapters.outbound.models import (
    Item, Marca, Categoria, Area, UnidadMedida, AreaCategoria,
    Sucursal, TipoIngreso, TipoSalida, StockSucursal,
    EntradaProducto, DetalleEntrada, SalidaProducto, DetalleSalida
)
from .serializers import (
    ItemSerializer, MarcaSerializer, CategoriaSerializer, 
    AreaSerializer, UnidadMedidaSerializer, AreaCategoriaSerializer,
    SucursalSerializer, TipoIngresoSerializer, TipoSalidaSerializer,
    StockSucursalSerializer, EntradaProductoSerializer, DetalleEntradaSerializer,
    SalidaProductoSerializer, DetalleSalidaSerializer
)

class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class AreaViewSet(viewsets.ModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer

class UnidadMedidaViewSet(viewsets.ModelViewSet):
    queryset = UnidadMedida.objects.all()
    serializer_class = UnidadMedidaSerializer

class AreaCategoriaViewSet(viewsets.ModelViewSet):
    queryset = AreaCategoria.objects.all()
    serializer_class = AreaCategoriaSerializer

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.select_related('marca', 'unidad', 'area_categoria__area', 'area_categoria__categoria').all()
    serializer_class = ItemSerializer

class SucursalViewSet(viewsets.ModelViewSet):
    queryset = Sucursal.objects.all()
    serializer_class = SucursalSerializer

class TipoIngresoViewSet(viewsets.ModelViewSet):
    queryset = TipoIngreso.objects.all()
    serializer_class = TipoIngresoSerializer

class TipoSalidaViewSet(viewsets.ModelViewSet):
    queryset = TipoSalida.objects.all()
    serializer_class = TipoSalidaSerializer

class StockSucursalViewSet(viewsets.ModelViewSet):
    queryset = StockSucursal.objects.all()
    serializer_class = StockSucursalSerializer

class EntradaProductoViewSet(viewsets.ModelViewSet):
    queryset = EntradaProducto.objects.all()
    serializer_class = EntradaProductoSerializer

class DetalleEntradaViewSet(viewsets.ModelViewSet):
    queryset = DetalleEntrada.objects.all()
    serializer_class = DetalleEntradaSerializer

    def perform_create(self, serializer):
        with transaction.atomic():
            detalle = serializer.save()
            stock, created = StockSucursal.objects.get_or_create(
                item=detalle.item, 
                sucursal=detalle.entrada.sucursal_destino,
                defaults={'cantidad_saldo': 0}
            )
            stock.cantidad_saldo += detalle.cantidad
            stock.save()

class SalidaProductoViewSet(viewsets.ModelViewSet):
    queryset = SalidaProducto.objects.all()
    serializer_class = SalidaProductoSerializer

class DetalleSalidaViewSet(viewsets.ModelViewSet):
    queryset = DetalleSalida.objects.all()
    serializer_class = DetalleSalidaSerializer

    def perform_create(self, serializer):
        with transaction.atomic():
            detalle = serializer.save()
            stock, created = StockSucursal.objects.get_or_create(
                item=detalle.item, 
                sucursal=detalle.salida.sucursal_origen,
                defaults={'cantidad_saldo': 0}
            )
            stock.cantidad_saldo -= detalle.cantidad
            stock.save()

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import UserProfileSerializer, ChangePasswordSerializer

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Contraseña actual incorrecta."]}, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(serializer.data.get("new_password"))
            user.save()
            return Response({"detail": "Contraseña actualizada exitosamente."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
