"""
entradas/urls.py
"""
from rest_framework.routers import DefaultRouter
from .views import EntradaProductoViewSet

router = DefaultRouter()
router.register(r"entradas", EntradaProductoViewSet, basename="entradas")

urlpatterns = router.urls