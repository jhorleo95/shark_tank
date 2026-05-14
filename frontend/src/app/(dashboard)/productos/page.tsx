'use client';
import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';

const API_URL = 'http://127.0.0.1:8000/api/v1';

export default function ProductosPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<any>({ estado: 'ACTIVO' });
  const [file, setFile] = useState<File | null>(null);

  const [marcas, setMarcas] = useState<any[]>([]);
  const [unidades, setUnidades] = useState<any[]>([]);
  const [areaCategorias, setAreaCategorias] = useState<any[]>([]);

  const fetchOptions = async () => {
    try {
      const [marcasRes, unidadesRes, areaCatRes] = await Promise.all([
        fetch(`${API_URL}/marcas/`),
        fetch(`${API_URL}/unidades/`),
        fetch(`${API_URL}/area-categorias/`)
      ]);

      const safeJson = async (res: Response) => {
        if (!res.ok) {
           console.error("Error API:", res.url, res.status, await res.text());
           return [];
        }
        const text = await res.text();
        try { return JSON.parse(text); } catch (e) { 
           console.error("Error parseando JSON de:", res.url, "Response:", text.substring(0, 100)); 
           return []; 
        }
      };

      setMarcas(await safeJson(marcasRes));
      setUnidades(await safeJson(unidadesRes));
      setAreaCategorias(await safeJson(areaCatRes));
    } catch (err) {
      console.error("fetchOptions falló:", err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/items/`);
      if (!res.ok) {
         console.error("Error API items:", res.status, await res.text());
         setData([]);
         return;
      }
      const text = await res.text();
      try {
        setData(JSON.parse(text));
      } catch(e) {
        console.error("Error parseando JSON de items:", text.substring(0, 100));
        setData([]);
      }
    } catch (err) {
      console.error("fetchData falló:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
    fetchData();
  }, []);

  const handleOpenNew = () => {
    setFormData({ estado: 'ACTIVO' });
    setFile(null);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (row: any) => {
    setFormData({ ...row });
    setFile(null);
    setEditingId(row.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (row: any) => {
    if (confirm('¿Eliminar producto?')) {
      try {
        await fetch(`${API_URL}/items/${row.id}/`, { method: 'DELETE' });
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `${API_URL}/items/${editingId}/` : `${API_URL}/items/`;
    const method = editingId ? 'PUT' : 'POST';

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined && key !== 'fotografia') {
        // avoid appending nested objects (like brand details) if they are present
        if (typeof formData[key] !== 'object') {
          submitData.append(key, formData[key]);
        }
      }
    });

    // Make sure we append the specific IDs for relations
    if (formData.area_categoria_id) submitData.append('area_categoria', formData.area_categoria_id || formData.area_categoria);
    if (formData.marca_id) submitData.append('marca', formData.marca_id || formData.marca);
    if (formData.unidad_id) submitData.append('unidad', formData.unidad_id || formData.unidad);


    if (file) {
      submitData.append('fotografia', file);
    }

    try {
      await fetch(url, { method, body: submitData });
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { key: 'fotografia', label: 'Foto', render: (row: any) => row.fotografia ? <img src={row.fotografia} alt={row.descripcion_corta} style={{width: 50, height: 50, objectFit: 'cover', borderRadius: '4px'}} /> : 'Sin Foto' },
    { key: 'codigo_actual', label: 'Código' },
    { key: 'descripcion_corta', label: 'Descripción' },
    { key: 'marca_nombre', label: 'Marca' },
    { key: 'estado', label: 'Estado' }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Productos</h1>
        <button 
          onClick={handleOpenNew}
          style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          + Nuevo Producto
        </button>
      </div>

      <DataTable data={data} columns={columns} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Editar Producto' : 'Nuevo Producto'}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ gridColumn: '1 / -1' }}>
             <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Fotografía</label>
             <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} style={{ width: '100%', color: 'white', marginTop: '0.5rem' }} />
          </div>

          <div>
             <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Código Actual</label>
             <input required value={formData.codigo_actual || ''} onChange={(e) => setFormData({...formData, codigo_actual: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '8px', marginTop: '0.5rem' }} />
          </div>

          <div>
             <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Código Anterior</label>
             <input value={formData.codigo_anterior || ''} onChange={(e) => setFormData({...formData, codigo_anterior: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '8px', marginTop: '0.5rem' }} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
             <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Descripción Corta</label>
             <input required value={formData.descripcion_corta || ''} onChange={(e) => setFormData({...formData, descripcion_corta: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '8px', marginTop: '0.5rem' }} />
          </div>

          <div>
             <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Área / Categoría</label>
             <select required value={formData.area_categoria || formData.area_categoria_id || ''} onChange={(e) => setFormData({...formData, area_categoria_id: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                <option value="">Seleccione...</option>
                {areaCategorias.map(ac => <option key={ac.id} value={ac.id}>{ac.area_nombre} - {ac.categoria_nombre}</option>)}
             </select>
          </div>

          <div>
             <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Marca</label>
             <select required value={formData.marca || formData.marca_id || ''} onChange={(e) => setFormData({...formData, marca_id: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                <option value="">Seleccione...</option>
                {marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
             </select>
          </div>

          <div>
             <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Unidad de Medida</label>
             <select required value={formData.unidad || formData.unidad_id || ''} onChange={(e) => setFormData({...formData, unidad_id: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                <option value="">Seleccione...</option>
                {unidades.map(u => <option key={u.id} value={u.id}>{u.nombre} ({u.codigo})</option>)}
             </select>
          </div>

          <div>
             <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Estado</label>
             <select required value={formData.estado || 'ACTIVO'} onChange={(e) => setFormData({...formData, estado: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
             </select>
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer' }}>Cancelar</button>
            <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}>Guardar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
