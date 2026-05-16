'use client';
import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';

const API_URL = 'http://127.0.0.1:8000/api/v1';

export default function PersonalPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    username: '', first_name: '', last_name: '', email: '', password: '', rol: 'Ventas', is_superuser: false, is_active: true
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/usuarios/`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar personal');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenNew = () => {
    setFormData({
      username: '', first_name: '', last_name: '', email: '', password: '', rol: 'Ventas', is_superuser: false, is_active: true
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (row: any) => {
    setFormData({ 
      ...row,
      password: '' // Don't show existing password
    });
    setEditingId(row.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (row: any) => {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        const res = await fetch(`${API_URL}/usuarios/${row.id}/`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Error deleting');
        }
        toast.success('Usuario eliminado correctamente');
        fetchData();
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Error al eliminar el usuario');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `${API_URL}/usuarios/${editingId}/` : `${API_URL}/usuarios/`;
    const method = editingId ? 'PUT' : 'POST';

    // Cleanup payload
    const payload = { ...formData };
    if (editingId && !payload.password) {
      delete payload.password; // Don't send empty password if editing
    }
    
    // Si es superuser, automáticamente es staff
    if (payload.is_superuser) {
        payload.is_staff = true;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const errData = await res.json();
        const errorMessage = Object.values(errData).flat().join(', ');
        throw new Error(errorMessage || 'Error saving');
      }
      
      toast.success(editingId ? 'Usuario actualizado' : 'Usuario creado');
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Ocurrió un error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: 'username', label: 'Usuario' },
    { key: 'first_name', label: 'Nombres' },
    { key: 'last_name', label: 'Apellidos' },
    { key: 'email', label: 'Email' },
    { key: 'rol', label: 'Rol' },
    { 
      key: 'is_superuser', 
      label: 'Privilegios',
      render: (row: any) => row.is_superuser ? <span style={{color: '#4ade80'}}>Admin</span> : <span style={{color: '#94a3b8'}}>Estándar</span>
    },
    { 
      key: 'is_active', 
      label: 'Estado',
      render: (row: any) => row.is_active ? <span style={{color: '#4ade80'}}>Activo</span> : <span style={{color: '#ef4444'}}>Inactivo</span>
    }
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: 'white' }}>Personal</h1>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Gestiona los accesos y roles de los empleados del sistema.</p>
        </div>
        <button 
          onClick={handleOpenNew}
          style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          + Nuevo Empleado
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
        title={editingId ? `Editar Empleado` : `Nuevo Empleado`}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Usuario de Acceso *</label>
              <input 
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '8px' }}
                required
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{editingId ? 'Cambiar Contraseña' : 'Contraseña *'}</label>
              <input 
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder={editingId ? 'Dejar en blanco para no cambiar' : 'Asignar contraseña'}
                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '8px' }}
                required={!editingId}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Nombres *</label>
              <input 
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '8px' }}
                required
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Apellidos *</label>
              <input 
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '8px' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Email</label>
            <input 
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '8px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Rol Principal *</label>
            <select 
              value={formData.rol}
              onChange={(e) => setFormData({...formData, rol: e.target.value})}
              style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.75rem', borderRadius: '8px' }}
            >
              <option value="Ventas">Ventas</option>
              <option value="Administrativa">Administrativa</option>
              <option value="RRHH">Recursos Humanos (RRHH)</option>
              <option value="Gerencia General">Gerencia General</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'white' }}>
              <input 
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
              Usuario Activo
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'white' }}>
              <input 
                type="checkbox"
                checked={formData.is_superuser}
                onChange={(e) => setFormData({...formData, is_superuser: e.target.checked})}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
              Es Administrador (Acceso Total)
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer' }} disabled={isSubmitting}>Cancelar</button>
            <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }} disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Empleado'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
