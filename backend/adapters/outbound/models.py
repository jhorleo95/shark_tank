from django.db import models

class Sucursal(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    direccion = models.CharField(max_length=255, null=True, blank=True)
    telefono = models.CharField(max_length=20, null=True, blank=True)

    class Meta:
        db_table = 'sucursales'

    def __str__(self):
        return self.nombre


class Area(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'areas'

    def __str__(self):
        return self.nombre


class UnidadMedida(models.Model):
    codigo = models.CharField(max_length=20, unique=True)
    nombre = models.CharField(max_length=50)

    class Meta:
        db_table = 'unidades_medida'

    def __str__(self):
        return f"{self.nombre} ({self.codigo})"


class TipoIngreso(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        db_table = 'tipos_ingreso'

    def __str__(self):
        return self.nombre


class TipoSalida(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        db_table = 'tipos_salida'

    def __str__(self):
        return self.nombre


class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'categorias'

    def __str__(self):
        return self.nombre


class AreaCategoria(models.Model):
    area = models.ForeignKey(Area, on_delete=models.CASCADE)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)

    class Meta:
        db_table = 'area_categorias'
        unique_together = ('area', 'categoria')

    def __str__(self):
        return f"{self.area.nombre} - {self.categoria.nombre}"


class Marca(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'marcas'

    def __str__(self):
        return self.nombre


class Item(models.Model):
    ESTADO_CHOICES = [
        ('ACTIVO', 'ACTIVO'),
        ('INACTIVO', 'INACTIVO'),
    ]

    codigo_actual = models.CharField(max_length=50, unique=True)
    codigo_anterior = models.CharField(max_length=50, null=True, blank=True)
    descripcion_corta = models.CharField(max_length=255)
    fotografia = models.ImageField(upload_to='items/', null=True, blank=True)
    especificacion_tecnica = models.TextField(null=True, blank=True)
    
    area_categoria = models.ForeignKey(AreaCategoria, on_delete=models.RESTRICT)
    marca = models.ForeignKey(Marca, on_delete=models.RESTRICT)
    unidad = models.ForeignKey(UnidadMedida, on_delete=models.RESTRICT)
    
    costo_cliente_bs = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    costo_clinica_bs = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    costo_licitacion_bs = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    stock_minimo_global = models.IntegerField(default=5)
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='ACTIVO')

    class Meta:
        db_table = 'items'

    def __str__(self):
        return f"[{self.codigo_actual}] {self.descripcion_corta}"


class StockSucursal(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    sucursal = models.ForeignKey(Sucursal, on_delete=models.RESTRICT)
    cantidad_saldo = models.IntegerField(default=0)

    class Meta:
        db_table = 'stock_sucursales'
        unique_together = ('item', 'sucursal')

    def __str__(self):
        return f"{self.item.codigo_actual} - {self.sucursal.nombre}: {self.cantidad_saldo}"


class EntradaProducto(models.Model):
    id = models.BigAutoField(primary_key=True)
    nro_factura = models.CharField(max_length=50, null=True, blank=True)
    fecha_entrada = models.DateTimeField()
    sucursal_destino = models.ForeignKey(Sucursal, on_delete=models.RESTRICT)
    usuario_id = models.IntegerField(null=True, blank=True)  # Referencia externa o futura
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'entradas_productos'

    def __str__(self):
        return f"Entrada {self.id} - {self.fecha_entrada}"


class DetalleEntrada(models.Model):
    id = models.BigAutoField(primary_key=True)
    entrada = models.ForeignKey(EntradaProducto, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.RESTRICT)
    lote = models.CharField(max_length=50, null=True, blank=True)
    cantidad = models.IntegerField()
    motivo = models.ForeignKey(TipoIngreso, on_delete=models.RESTRICT)
    area = models.ForeignKey(Area, on_delete=models.RESTRICT)
    observacion = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'detalle_entradas'

    def __str__(self):
        return f"Detalle {self.id} (Entrada {self.entrada_id})"


class SalidaProducto(models.Model):
    id = models.BigAutoField(primary_key=True)
    nro_factura = models.CharField(max_length=50, null=True, blank=True)
    fecha_salida = models.DateTimeField()
    sucursal_origen = models.ForeignKey(Sucursal, on_delete=models.RESTRICT)
    usuario_id = models.IntegerField(null=True, blank=True)  # Referencia externa o futura
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'salidas_productos'

    def __str__(self):
        return f"Salida {self.id} - {self.fecha_salida}"


class DetalleSalida(models.Model):
    id = models.BigAutoField(primary_key=True)
    salida = models.ForeignKey(SalidaProducto, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.RESTRICT)
    lote = models.CharField(max_length=50, null=True, blank=True)
    cantidad = models.IntegerField()
    motivo = models.ForeignKey(TipoSalida, on_delete=models.RESTRICT)
    area = models.ForeignKey(Area, on_delete=models.RESTRICT)
    observacion = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'detalle_salidas'

    def __str__(self):
        return f"Detalle {self.id} (Salida {self.salida_id})"
