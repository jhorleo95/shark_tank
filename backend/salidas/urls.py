"""
salidas/urls.py
"""
from rest_framework.routers import DefaultRouter
from .views import SalidaProductoViewSet

router = DefaultRouter()
router.register(r"salidas", SalidaProductoViewSet, basename="salidas")

urlpatterns = router.urls