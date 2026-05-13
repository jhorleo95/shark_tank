from django.contrib import admin
from .models import (
    Sucursal, Area, UnidadMedida, TipoIngreso, TipoSalida, Categoria,
    AreaCategoria, Marca, Item, StockSucursal,
    EntradaProducto, DetalleEntrada, SalidaProducto, DetalleSalida
)

@admin.register(Sucursal)
class SucursalAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'telefono')
    search_fields = ('nombre',)

@admin.register(Area)
class AreaAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ('nombre',)

@admin.register(UnidadMedida)
class UnidadMedidaAdmin(admin.ModelAdmin):
    list_display = ('codigo', 'nombre')
    search_fields = ('codigo', 'nombre')

@admin.register(TipoIngreso)
class TipoIngresoAdmin(admin.ModelAdmin):
    list_display = ('nombre',)

@admin.register(TipoSalida)
class TipoSalidaAdmin(admin.ModelAdmin):
    list_display = ('nombre',)

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ('nombre',)

@admin.register(AreaCategoria)
class AreaCategoriaAdmin(admin.ModelAdmin):
    list_display = ('area', 'categoria')
    list_filter = ('area', 'categoria')

@admin.register(Marca)
class MarcaAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ('nombre',)

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('codigo_actual', 'descripcion_corta', 'marca', 'estado')
    search_fields = ('codigo_actual', 'descripcion_corta')
    list_filter = ('estado', 'marca')

@admin.register(StockSucursal)
class StockSucursalAdmin(admin.ModelAdmin):
    list_display = ('item', 'sucursal', 'cantidad_saldo')
    list_filter = ('sucursal',)
    search_fields = ('item__codigo_actual', 'item__descripcion_corta')

class DetalleEntradaInline(admin.TabularInline):
    model = DetalleEntrada
    extra = 1

@admin.register(EntradaProducto)
class EntradaProductoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nro_factura', 'fecha_entrada', 'sucursal_destino')
    inlines = [DetalleEntradaInline]
    list_filter = ('sucursal_destino', 'fecha_entrada')

class DetalleSalidaInline(admin.TabularInline):
    model = DetalleSalida
    extra = 1

@admin.register(SalidaProducto)
class SalidaProductoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nro_factura', 'fecha_salida', 'sucursal_origen')
    inlines = [DetalleSalidaInline]
    list_filter = ('sucursal_origen', 'fecha_salida')
