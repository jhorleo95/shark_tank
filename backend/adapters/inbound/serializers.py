from rest_framework import serializers
from adapters.outbound.models import (
    Item, Marca, Categoria, Area, UnidadMedida, AreaCategoria,
    Sucursal, TipoIngreso, TipoSalida, StockSucursal,
    EntradaProducto, DetalleEntrada, SalidaProducto, DetalleSalida,
    Proforma, DetalleProforma
)
from django.contrib.auth.models import User

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


class DetalleProformaSerializer(serializers.ModelSerializer):
    item_detalle = ItemSerializer(source='item', read_only=True)
    area_nombre = serializers.CharField(source='area.nombre', read_only=True)

    class Meta:
        model = DetalleProforma
        fields = '__all__'

class ProformaSerializer(serializers.ModelSerializer):
    detalles = DetalleProformaSerializer(source='detalleproforma_set', many=True, read_only=True)
    sucursal_nombre = serializers.CharField(source='sucursal.nombre', read_only=True)
    
    class Meta:
        model = Proforma
        fields = '__all__'


class UserProfileSerializer(serializers.ModelSerializer):
    rol = serializers.CharField(source='profile.rol', read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'rol']

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class UserAdminSerializer(serializers.ModelSerializer):
    rol = serializers.CharField(source='profile.rol', required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'is_staff', 'is_superuser', 'is_active', 'rol', 'password']

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', None)
        password = validated_data.pop('password', None)
        
        user = User.objects.create(**validated_data)
        if password:
            user.set_password(password)
            user.save()
            
        if profile_data and 'rol' in profile_data:
            user.profile.rol = profile_data['rol']
            user.profile.save()
            
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        if password:
            instance.set_password(password)
            
        instance.save()

        if profile_data and 'rol' in profile_data:
            instance.profile.rol = profile_data['rol']
            instance.profile.save()

        return instance
