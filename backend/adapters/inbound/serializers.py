from rest_framework import serializers
from adapters.outbound.models import (
    Item, Marca, Categoria, Area, UnidadMedida, AreaCategoria,
    Sucursal, TipoIngreso, TipoSalida, StockSucursal,
    EntradaProducto, DetalleEntrada, SalidaProducto, DetalleSalida
)

class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = '__all__'

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = '__all__'

class UnidadMedidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnidadMedida
        fields = '__all__'

class AreaCategoriaSerializer(serializers.ModelSerializer):
    area_nombre = serializers.CharField(source='area.nombre', read_only=True)
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)

    class Meta:
        model = AreaCategoria
        fields = '__all__'

class ItemSerializer(serializers.ModelSerializer):
    marca_nombre = serializers.CharField(source='marca.nombre', read_only=True)
    unidad_nombre = serializers.CharField(source='unidad.nombre', read_only=True)
    area_categoria_detalle = AreaCategoriaSerializer(source='area_categoria', read_only=True)

    class Meta:
        model = Item
        fields = '__all__'

class SucursalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sucursal
        fields = '__all__'

class TipoIngresoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoIngreso
        fields = '__all__'

class TipoSalidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoSalida
        fields = '__all__'

class StockSucursalSerializer(serializers.ModelSerializer):
    item_detalle = ItemSerializer(source='item', read_only=True)
    sucursal_nombre = serializers.CharField(source='sucursal.nombre', read_only=True)

    class Meta:
        model = StockSucursal
        fields = '__all__'

class DetalleEntradaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleEntrada
        fields = '__all__'

class EntradaProductoSerializer(serializers.ModelSerializer):
    detalles = DetalleEntradaSerializer(source='detalleentrada_set', many=True, read_only=True)

    class Meta:
        model = EntradaProducto
        fields = '__all__'

class DetalleSalidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleSalida
        fields = '__all__'

class SalidaProductoSerializer(serializers.ModelSerializer):
    detalles = DetalleSalidaSerializer(source='detallesalida_set', many=True, read_only=True)

    class Meta:
        model = SalidaProducto
        fields = '__all__'
