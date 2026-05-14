# salidas/serializers.py

from rest_framework import serializers
from adapters.outbound.models import DetalleSalida, SalidaProducto, StockSucursal


# ── Detalle (lectura enriquecida) ──────────────────────────────────────────────

class DetalleSalidaReadSerializer(serializers.ModelSerializer):
    item_codigo      = serializers.CharField(source="item.codigo_actual", read_only=True)
    item_descripcion = serializers.CharField(source="item.descripcion_corta", read_only=True)
    motivo_nombre    = serializers.CharField(source="motivo.nombre", read_only=True)
    area_nombre      = serializers.CharField(source="area.nombre", read_only=True)

    class Meta:
        model = DetalleSalida
        fields = [
            "id", "item", "item_codigo", "item_descripcion",
            "lote", "cantidad", "motivo", "motivo_nombre",
            "area", "area_nombre", "observacion",
        ]


# ── Detalle (escritura) ────────────────────────────────────────────────────────

class DetalleSalidaWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleSalida
        fields = ["item", "lote", "cantidad", "motivo", "area", "observacion"]

    def validate_cantidad(self, value):
        if value <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor a 0.")
        return value


# ── Salida (lectura) ───────────────────────────────────────────────────────────

class SalidaProductoReadSerializer(serializers.ModelSerializer):
    sucursal_nombre = serializers.CharField(source="sucursal_origen.nombre", read_only=True)
    detalles        = DetalleSalidaReadSerializer(many=True, read_only=True)
    total_items     = serializers.SerializerMethodField()

    class Meta:
        model = SalidaProducto
        fields = [
            "id", "nro_factura", "fecha_salida",
            "sucursal_origen", "sucursal_nombre",
            "usuario_id", "fecha_registro",
            "total_items", "detalles",
        ]

    def get_total_items(self, obj):
        return sum(d.cantidad for d in obj.detalles.all())


# ── Salida (escritura con detalles anidados) ───────────────────────────────────

class SalidaProductoWriteSerializer(serializers.ModelSerializer):
    detalles = DetalleSalidaWriteSerializer(many=True)

    class Meta:
        model = SalidaProducto
        fields = [
            "nro_factura", "fecha_salida",
            "sucursal_origen", "usuario_id",
            "detalles",
        ]

    def validate_detalles(self, value):
        if not value:
            raise serializers.ValidationError("La salida debe tener al menos un detalle.")
        return value

    def validate(self, attrs):
        """Valida stock disponible ANTES de guardar."""
        sucursal = attrs.get("sucursal_origen")
        detalles = attrs.get("detalles", [])
        errores  = []

        for detalle in detalles:
            item              = detalle["item"]
            cantidad_requerida = detalle["cantidad"]

            try:
                stock = StockSucursal.objects.get(item=item, sucursal=sucursal)
                if stock.cantidad_saldo < cantidad_requerida:
                    errores.append(
                        f"Stock insuficiente para [{item.codigo_actual}] "
                        f"{item.descripcion_corta}: "
                        f"disponible={stock.cantidad_saldo}, "
                        f"requerido={cantidad_requerida}."
                    )
            except StockSucursal.DoesNotExist:
                errores.append(
                    f"El ítem [{item.codigo_actual}] {item.descripcion_corta} "
                    f"no tiene stock en la sucursal '{sucursal.nombre}'."
                )

        if errores:
            raise serializers.ValidationError({"stock": errores})

        return attrs

    def create(self, validated_data):
        from django.db import transaction

        detalles_data = validated_data.pop("detalles")
        sucursal      = validated_data["sucursal_origen"]

        with transaction.atomic():
            salida = SalidaProducto.objects.create(**validated_data)

            for detalle_data in detalles_data:
                item     = detalle_data["item"]
                cantidad = detalle_data["cantidad"]

                DetalleSalida.objects.create(salida=salida, **detalle_data)

                stock = StockSucursal.objects.select_for_update().get(
                    item=item, sucursal=sucursal
                )
                stock.cantidad_saldo -= cantidad
                stock.save(update_fields=["cantidad_saldo"])

        return salida

    def update(self, instance, validated_data):
        from django.db import transaction

        detalles_data = validated_data.pop("detalles", None)
        sucursal      = validated_data.get("sucursal_origen", instance.sucursal_origen)

        with transaction.atomic():
            if detalles_data is not None:
                # Devolver stock de detalles anteriores
                for detalle in instance.detalles.all():
                    try:
                        stock = StockSucursal.objects.select_for_update().get(
                            item=detalle.item, sucursal=instance.sucursal_origen
                        )
                        stock.cantidad_saldo += detalle.cantidad
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

                    DetalleSalida.objects.create(salida=instance, **detalle_data)

                    stock = StockSucursal.objects.select_for_update().get(
                        item=item, sucursal=sucursal
                    )
                    stock.cantidad_saldo -= cantidad
                    stock.save(update_fields=["cantidad_saldo"])

        return instance