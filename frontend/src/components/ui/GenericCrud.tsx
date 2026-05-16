'use client';
import React, { useState, useEffect } from 'react';
import DataTable from './DataTable';
import Modal from './Modal';
import toast from 'react-hot-toast';

interface Field {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'textarea';
}

interface GenericCrudProps {
  title: string;
  endpoint: string; // e.g. 'areas'
  columns: { key: string; label: string }[];
  fields: Field[];
}

const API_URL = 'http://127.0.0.1:8000/api/v1';

export default function GenericCrud({ title, endpoint, columns, fields }: GenericCrudProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${endpoint}/`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      toast.error(`Error al cargar ${title}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const handleOpenNew = () => {
    setFormData({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (row: any) => {
    setFormData({ ...row });
    setEditingId(row.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (row: any) => {
    if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      try {
        const res = await fetch(`${API_URL}/${endpoint}/${row.id}/`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Error deleting');
        toast.success('Registro eliminado correctamente');
        fetchData();
      } catch (err) {
        console.error(err);
        toast.error('Error al eliminar el registro');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `${API_URL}/${endpoint}/${editingId}/` : `${API_URL}/${endpoint}/`;
    const method = editingId ? 'PUT' : 'POST';

    setIsSubmitting(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Error saving');
      
      toast.success(editingId ? 'Registro actualizado' : 'Registro creado');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Ocurrió un error al guardar el registro');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{title}</h1>
        <button 
          onClick={handleOpenNew}
          style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          + Nuevo Registro
        </button>
      </div>

      <DataTable 
        data={data} 
        columns={columns} 
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? `Editar ${title}` : `Nuevo ${title}`}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {fields.map(field => (
            <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea 
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '8px', minHeight: '100px' }}
                  required
                />
              ) : (
                <input 
                  type={field.type || 'text'}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '8px' }}
                  required
                />
              )}
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer' }} disabled={isSubmitting}>Cancelar</button>
            <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }} disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
