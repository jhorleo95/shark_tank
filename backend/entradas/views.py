# entradas/views.py

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from adapters.outbound.models import EntradaProducto, StockSucursal
from .serializers import EntradaProductoReadSerializer, EntradaProductoWriteSerializer


class EntradaProductoViewSet(viewsets.ModelViewSet):
    """
    GET    /api/entradas/                    → lista paginada
    POST   /api/entradas/                    → crear + actualiza stock
    GET    /api/entradas/{id}/               → detalle con detalles anidados
    PUT    /api/entradas/{id}/               → reemplazar completo
    PATCH  /api/entradas/{id}/               → actualización parcial
    DELETE /api/entradas/{id}/               → eliminar (revierte stock)
    GET    /api/entradas/por-sucursal/{id}/  → filtrar por sucursal destino

    Query params:
    ?sucursal_destino=1
    ?search=FAC-001
    ?ordering=-fecha_entrada
    """

    queryset = (
        EntradaProducto.objects
        .select_related("sucursal_destino")
        .prefetch_related(
            "detalles__item__marca",
            "detalles__item__unidad",
            "detalles__motivo",
            "detalles__area",
        )
        .order_by("-fecha_entrada")
    )

    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {"sucursal_destino": ["exact"], "usuario_id": ["exact"]}
    search_fields    = ["nro_factura"]
    ordering_fields  = ["fecha_entrada", "fecha_registro", "id"]

    def get_serializer_class(self):
        if self.action in ("list", "retrieve"):
            return EntradaProductoReadSerializer
        return EntradaProductoWriteSerializer

    def destroy(self, request, *args, **kwargs):
        """Eliminar entrada y revertir stock."""
        from django.db import transaction

        instance = self.get_object()

        with transaction.atomic():
            for detalle in instance.detalles.all():
                try:
                    stock = StockSucursal.objects.get(
                        item=detalle.item,
                        sucursal=instance.sucursal_destino,
                    )
                    stock.cantidad_saldo -= detalle.cantidad
                    stock.save(update_fields=["cantidad_saldo"])
                except StockSucursal.DoesNotExist:
                    pass

            instance.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["get"], url_path="por-sucursal/(?P<sucursal_id>[^/.]+)")
    def por_sucursal(self, request, sucursal_id=None):
        """GET /api/entradas/por-sucursal/{sucursal_id}/"""
        qs         = self.get_queryset().filter(sucursal_destino_id=sucursal_id)
        page       = self.paginate_queryset(qs)
        serializer = EntradaProductoReadSerializer(
            page if page is not None else qs, many=True
        )
        return (
            self.get_paginated_response(serializer.data)
            if page is not None
            else Response(serializer.data)
        )