'use client';

import { useState, useEffect } from 'react';
import { fetchGeneric, createData } from '../../../services/api';
import styles from '../movimientos.module.css';

export default function EntradasPage() {
  const [items, setItems] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [areas, setAreas] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    sucursal_destino: '',
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
        fetchGeneric('tipos-ingreso'),
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
      // 1. Crear la Entrada (Cabecera)
      const entradaData = {
        sucursal_destino: formData.sucursal_destino,
        nro_factura: formData.nro_factura,
        fecha_entrada: new Date().toISOString()
      };
      const entradaRes = await createData('entradas', entradaData);
      
      if (entradaRes && entradaRes.id) {
        // 2. Crear el Detalle (que auto-actualiza el stock vía Django)
        const detalleData = {
          entrada: entradaRes.id,
          item: formData.item,
          cantidad: parseInt(formData.cantidad),
          motivo: formData.motivo,
          area: formData.area,
          lote: formData.lote
        };
        await createData('detalle-entradas', detalleData);
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
        <h1 className={styles.title}>Registrar Entrada</h1>
        <p style={{ color: '#94a3b8' }}>Ingreso de productos al inventario (Suma Stock)</p>
      </div>

      <form className={styles.formCard} onSubmit={handleSubmit}>
        {success && <div className={styles.successMessage}>¡Entrada registrada y Stock actualizado correctamente!</div>}
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Sucursal Destino</label>
          <select required className={styles.select} value={formData.sucursal_destino} onChange={e => setFormData({...formData, sucursal_destino: e.target.value})}>
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
          <label className={styles.label}>Producto a Ingresar</label>
          <select required className={styles.select} value={formData.item} onChange={e => setFormData({...formData, item: e.target.value})}>
            <option value="">Seleccione un producto...</option>
            {items.map((i: any) => <option key={i.id} value={i.id}>[{i.codigo_actual}] {i.descripcion_corta}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Cantidad</label>
            <input required type="number" min="1" className={styles.input} value={formData.cantidad} onChange={e => setFormData({...formData, cantidad: e.target.value})} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Lote</label>
            <input type="text" className={styles.input} placeholder="Opcional" value={formData.lote} onChange={e => setFormData({...formData, lote: e.target.value})} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Motivo de Ingreso</label>
            <select required className={styles.select} value={formData.motivo} onChange={e => setFormData({...formData, motivo: e.target.value})}>
              <option value="">Seleccione...</option>
              {tipos.map((t: any) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Área Física</label>
            <select required className={styles.select} value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})}>
              <option value="">Seleccione...</option>
              {areas.map((a: any) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.buttonRow}>
          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? 'Procesando...' : 'Confirmar Entrada'}
          </button>
        </div>
      </form>
    </div>
  );
}
