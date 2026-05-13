'use client';

import { useState, useEffect } from 'react';
import { fetchGeneric, createData } from '../../../services/api';
import styles from '../movimientos.module.css';

export default function SalidasPage() {
  const [items, setItems] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [areas, setAreas] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    sucursal_origen: '',
    item: '',
    cantidad: '',
    motivo: '',
    area: '',
    lote: '',
    nro_factura: ''
  });

  useEffect(() => {
    async function loadData() {
      const [itemsData, sucursalesData, tiposData, areasData] = await Promise.all([
        fetchGeneric('items'),
        fetchGeneric('sucursales'),
        fetchGeneric('tipos-salida'),
        fetchGeneric('areas')
      ]);
      setItems(itemsData);
      setSucursales(sucursalesData);
      setTipos(tiposData);
      setAreas(areasData);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      // 1. Crear la Salida (Cabecera)
      const salidaData = {
        sucursal_origen: formData.sucursal_origen,
        nro_factura: formData.nro_factura,
        fecha_salida: new Date().toISOString()
      };
      const salidaRes = await createData('salidas', salidaData);
      
      if (salidaRes && salidaRes.id) {
        // 2. Crear el Detalle (que auto-actualiza el stock vía Django)
        const detalleData = {
          salida: salidaRes.id,
          item: formData.item,
          cantidad: parseInt(formData.cantidad),
          motivo: formData.motivo,
          area: formData.area,
          lote: formData.lote
        };
        await createData('detalle-salidas', detalleData);
        setSuccess(true);
        setFormData({ ...formData, cantidad: '', lote: '', nro_factura: '' }); // reset some fields
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando datos maestros...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Registrar Salida</h1>
        <p style={{ color: '#94a3b8' }}>Despacho de productos del inventario (Resta Stock)</p>
      </div>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        {success && <div className={styles.successMessage}>¡Salida registrada y Stock descontado correctamente!</div>}
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Sucursal Origen</label>
          <select required className={styles.select} value={formData.sucursal_origen} onChange={e => setFormData({...formData, sucursal_origen: e.target.value})}>
            <option value="">Seleccione una sucursal...</option>
            {sucursales.map((s: any) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Nro. Factura / Documento</label>
          <input type="text" className={styles.input} placeholder="Opcional" value={formData.nro_factura} onChange={e => setFormData({...formData, nro_factura: e.target.value})} />
        </div>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1rem 0' }}></div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Producto a Retirar</label>
          <select required className={styles.select} value={formData.item} onChange={e => setFormData({...formData, item: e.target.value})}>
            <option value="">Seleccione un producto...</option>
            {items.map((i: any) => <option key={i.id} value={i.id}>[{i.codigo_actual}] {i.descripcion_corta}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Cantidad a Descontar</label>
            <input required type="number" min="1" className={styles.input} value={formData.cantidad} onChange={e => setFormData({...formData, cantidad: e.target.value})} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Lote</label>
            <input type="text" className={styles.input} placeholder="Opcional" value={formData.lote} onChange={e => setFormData({...formData, lote: e.target.value})} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Motivo de Salida</label>
            <select required className={styles.select} value={formData.motivo} onChange={e => setFormData({...formData, motivo: e.target.value})}>
              <option value="">Seleccione...</option>
              {tipos.map((t: any) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Área de Destino</label>
            <select required className={styles.select} value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})}>
              <option value="">Seleccione...</option>
              {areas.map((a: any) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.buttonRow}>
          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? 'Procesando...' : 'Confirmar Salida'}
          </button>
        </div>
      </form>
    </div>
  );
}
