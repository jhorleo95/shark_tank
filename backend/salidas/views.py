# salidas/views.py

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from adapters.outbound.models import SalidaProducto, StockSucursal
from .serializers import SalidaProductoReadSerializer, SalidaProductoWriteSerializer


class SalidaProductoViewSet(viewsets.ModelViewSet):
    """
    GET    /api/salidas/                    → lista paginada
    POST   /api/salidas/                    → crear + valida y descuenta stock
    GET    /api/salidas/{id}/               → detalle con detalles anidados
    PUT    /api/salidas/{id}/               → reemplazar completo
    PATCH  /api/salidas/{id}/               → actualización parcial
    DELETE /api/salidas/{id}/               → eliminar (devuelve stock)
    GET    /api/salidas/por-sucursal/{id}/  → filtrar por sucursal origen

    Query params:
      ?sucursal_origen=1
      ?search=FAC-001
      ?ordering=-fecha_salida
    """

    queryset = (
        SalidaProducto.objects
        .select_related("sucursal_origen")
        .prefetch_related(
            "detalles__item__marca",
            "detalles__item__unidad",
            "detalles__motivo",
            "detalles__area",
        )
        .order_by("-fecha_salida")
    )

    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {"sucursal_origen": ["exact"], "usuario_id": ["exact"]}
    search_fields    = ["nro_factura"]
    ordering_fields  = ["fecha_salida", "fecha_registro", "id"]

    def get_serializer_class(self):
        if self.action in ("list", "retrieve"):
            return SalidaProductoReadSerializer
        return SalidaProductoWriteSerializer

    def destroy(self, request, *args, **kwargs):
        """Eliminar salida y devolver stock."""
        from django.db import transaction

        instance = self.get_object()

        with transaction.atomic():
            for detalle in instance.detalles.all():
                try:
                    stock = StockSucursal.objects.get(
                        item=detalle.item,
                        sucursal=instance.sucursal_origen,
                    )
                    stock.cantidad_saldo += detalle.cantidad
                    stock.save(update_fields=["cantidad_saldo"])
                except StockSucursal.DoesNotExist:
                    pass

            instance.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["get"], url_path="por-sucursal/(?P<sucursal_id>[^/.]+)")
    def por_sucursal(self, request, sucursal_id=None):
        """GET /api/salidas/por-sucursal/{sucursal_id}/"""
        qs         = self.get_queryset().filter(sucursal_origen_id=sucursal_id)
        page       = self.paginate_queryset(qs)
        serializer = SalidaProductoReadSerializer(
            page if page is not None else qs, many=True
        )
        return (
            self.get_paginated_response(serializer.data)
            if page is not None
            else Response(serializer.data)
        )