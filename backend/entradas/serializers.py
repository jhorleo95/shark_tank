# entradas/serializers.py

from rest_framework import serializers
from adapters.outbound.models import DetalleEntrada, EntradaProducto, StockSucursal


# ── Detalle (lectura enriquecida) ──────────────────────────────────────────────

class DetalleEntradaReadSerializer(serializers.ModelSerializer):
    item_codigo      = serializers.CharField(source="item.codigo_actual", read_only=True)
    item_descripcion = serializers.CharField(source="item.descripcion_corta", read_only=True)
    motivo_nombre    = serializers.CharField(source="motivo.nombre", read_only=True)
    area_nombre      = serializers.CharField(source="area.nombre", read_only=True)

    class Meta:
        model = DetalleEntrada
        fields = [
            "id", "item", "item_codigo", "item_descripcion",
            "lote", "cantidad", "motivo", "motivo_nombre",
            "area", "area_nombre", "observacion",
        ]


# ── Detalle (escritura) ────────────────────────────────────────────────────────

class DetalleEntradaWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleEntrada
        fields = ["item", "lote", "cantidad", "motivo", "area", "observacion"]

    def validate_cantidad(self, value):
        if value <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor a 0.")
        return value


# ── Entrada (lectura) ──────────────────────────────────────────────────────────

class EntradaProductoReadSerializer(serializers.ModelSerializer):
    sucursal_nombre = serializers.CharField(source="sucursal_destino.nombre", read_only=True)
    detalles        = DetalleEntradaReadSerializer(many=True, read_only=True)
    total_items     = serializers.SerializerMethodField()

    class Meta:
        model = EntradaProducto
        fields = [
            "id", "nro_factura", "fecha_entrada",
            "sucursal_destino", "sucursal_nombre",
            "usuario_id", "fecha_registro",
            "total_items", "detalles",
        ]

    def get_total_items(self, obj):
        return sum(d.cantidad for d in obj.detalles.all())


# ── Entrada (escritura con detalles anidados) ──────────────────────────────────

class EntradaProductoWriteSerializer(serializers.ModelSerializer):
    detalles = DetalleEntradaWriteSerializer(many=True)

    class Meta:
        model = EntradaProducto
        fields = [
            "nro_factura", "fecha_entrada",
            "sucursal_destino", "usuario_id",
            "detalles",
        ]

    def validate_detalles(self, value):
        if not value:
            raise serializers.ValidationError("La entrada debe tener al menos un detalle.")
        return value

    def create(self, validated_data):
        from django.db import transaction

        detalles_data = validated_data.pop("detalles")
        sucursal = validated_data["sucursal_destino"]

        with transaction.atomic():
            entrada = EntradaProducto.objects.create(**validated_data)

            for detalle_data in detalles_data:
                item     = detalle_data["item"]
                cantidad = detalle_data["cantidad"]

                DetalleEntrada.objects.create(entrada=entrada, **detalle_data)

                stock, _ = StockSucursal.objects.get_or_create(
                    item=item, sucursal=sucursal,
                    defaults={"cantidad_saldo": 0},
                )
                stock.cantidad_saldo += cantidad
                stock.save(update_fields=["cantidad_saldo"])

        return entrada

    def update(self, instance, validated_data):
        from django.db import transaction

        detalles_data = validated_data.pop("detalles", None)
        sucursal = validated_data.get("sucursal_destino", instance.sucursal_destino)

        with transaction.atomic():
            if detalles_data is not None:
                # Revertir stock de detalles anteriores
                for detalle in instance.detalles.all():
                    try:
                        stock = StockSucursal.objects.get(
                            item=detalle.item, sucursal=instance.sucursal_destino
                        )
                        stock.cantidad_saldo -= detalle.cantidad
                        stock.save(update_fields=["cantidad_saldo"])
                    except StockSucursal.DoesNotExist:
                        pass

                instance.detalles.all().delete()

            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

            if detalles_data is not None:
                for detalle_data in detalles_data:
                    item     = detalle_data["item"]
                    cantidad = detalle_data["cantidad"]

                    DetalleEntrada.objects.create(entrada=instance, **detalle_data)

                    stock, _ = StockSucursal.objects.get_or_create(
                        item=item, sucursal=sucursal,
                        defaults={"cantidad_saldo": 0},
                    )
                    stock.cantidad_saldo += cantidad
                    stock.save(update_fields=["cantidad_saldo"])

        return instance