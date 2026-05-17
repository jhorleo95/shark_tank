# salidas/models.py
# Los modelos viven en adapters/outbound/models.py
# Este archivo solo re-exporta para mantener la convención de Django.

from adapters.outbound.models import (  # noqa: F401
    SalidaProducto,
    DetalleSalida,
)