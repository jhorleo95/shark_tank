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

from rest_framework.decorators import action
from .serializers import ProformaSerializer, DetalleProformaSerializer
from adapters.outbound.models import Proforma, DetalleProforma
from django.utils import timezone

class DetalleProformaViewSet(viewsets.ModelViewSet):
    queryset = DetalleProforma.objects.all()
    serializer_class = DetalleProformaSerializer

class ProformaViewSet(viewsets.ModelViewSet):
    queryset = Proforma.objects.all().order_by('-fecha_creacion')
    serializer_class = ProformaSerializer

    @action(detail=True, methods=['post'])
    def aprobar(self, request, pk=None):
        proforma = self.get_object()
        if proforma.estado != 'PENDIENTE':
            return Response({'error': 'La proforma no está pendiente.'}, status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
            proforma.estado = 'APROBADO'
            proforma.save()

            # Obtener tipo de salida (por defecto el primero o crear uno)
            tipo_salida, _ = TipoSalida.objects.get_or_create(nombre="Venta por Proforma")
            
            # Crear Salida
            salida = SalidaProducto.objects.create(
                nro_factura=f"PROF-{proforma.id}",
                fecha_salida=timezone.now(),
                sucursal_origen=proforma.sucursal,
                usuario_id=proforma.vendedor_id
            )

            # Crear Detalles y descontar stock
            detalles_proforma = proforma.detalleproforma_set.all()
            for dp in detalles_proforma:
                detalle_salida = DetalleSalida.objects.create(
                    salida=salida,
                    item=dp.item,
                    cantidad=dp.cantidad,
                    motivo=tipo_salida,
                    area=dp.area,
                    observacion="Aprobación automática de Proforma"
                )
                
                stock, created = StockSucursal.objects.get_or_create(
                    item=dp.item, 
                    sucursal=proforma.sucursal,
                    defaults={'cantidad_saldo': 0}
                )
                stock.cantidad_saldo -= dp.cantidad
                stock.save()

        return Response({'status': 'Proforma aprobada y salida generada.'})

    @action(detail=True, methods=['post'])
    def rechazar(self, request, pk=None):
        proforma = self.get_object()
        if proforma.estado != 'PENDIENTE':
            return Response({'error': 'La proforma no está pendiente.'}, status=status.HTTP_400_BAD_REQUEST)
        
        proforma.estado = 'RECHAZADO'
        proforma.save()
        return Response({'status': 'Proforma rechazada.'})

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

from django.contrib.auth.models import User
from .serializers import UserAdminSerializer

class UserAdminViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-id')
    serializer_class = UserAdminSerializer
    permission_classes = [IsAuthenticated] # Podría restringirse a is_staff o is_superuser si se desea

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        if user == request.user:
            return Response({'error': 'No puedes eliminarte a ti mismo.'}, status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(request, *args, **kwargs)
