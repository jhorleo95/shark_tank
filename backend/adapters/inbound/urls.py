from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ItemViewSet, MarcaViewSet, CategoriaViewSet, 
    AreaViewSet, UnidadMedidaViewSet, AreaCategoriaViewSet,
    SucursalViewSet, TipoIngresoViewSet, TipoSalidaViewSet,
    StockSucursalViewSet, EntradaProductoViewSet, DetalleEntradaViewSet,
    SalidaProductoViewSet, DetalleSalidaViewSet
)

router = DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'marcas', MarcaViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'areas', AreaViewSet)
router.register(r'unidades', UnidadMedidaViewSet)
router.register(r'area-categorias', AreaCategoriaViewSet)
router.register(r'sucursales', SucursalViewSet)
router.register(r'tipos-ingreso', TipoIngresoViewSet)
router.register(r'tipos-salida', TipoSalidaViewSet)
router.register(r'stock', StockSucursalViewSet)
router.register(r'entradas', EntradaProductoViewSet)
router.register(r'detalle-entradas', DetalleEntradaViewSet)
router.register(r'salidas', SalidaProductoViewSet)
router.register(r'detalle-salidas', DetalleSalidaViewSet)

urlpatterns = [
    path('v1/', include(router.urls)),
]
