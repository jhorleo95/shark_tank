'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Check, X, Eye } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import toast from 'react-hot-toast';

const API_URL = 'http://127.0.0.1:8000/api/v1';

export default function ProformasPage() {
  const [proformas, setProformas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const fetchProformas = async () => {
    try {
      const res = await fetch(`${API_URL}/proformas/`);
      if (res.ok) {
        let data = await res.json();
        setProformas(data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar proformas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        const userRes = await fetch('http://127.0.0.1:8000/api/users/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setRole(userData.rol);
          setUserId(userData.id);
        }
      }
      fetchProformas();
    };
    init();
  }, []);

  const handleApprove = async (id: number) => {
    if (!confirm('¿Estás seguro de aprobar esta proforma? Se descontará el stock automáticamente.')) return;
    try {
      const res = await fetch(`${API_URL}/proformas/${id}/aprobar/`, { method: 'POST' });
      if (res.ok) {
        toast.success('Proforma aprobada y Salida generada');
        fetchProformas();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Error al aprobar');
      }
    } catch (error) {
      toast.error('Error de red al aprobar');
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm('¿Rechazar esta proforma?')) return;
    try {
      const res = await fetch(`${API_URL}/proformas/${id}/rechazar/`, { method: 'POST' });
      if (res.ok) {
        toast.success('Proforma rechazada');
        fetchProformas();
      } else {
        toast.error('Error al rechazar');
      }
    } catch (error) {
      toast.error('Error de red al rechazar');
    }
  };

  // Filtrar proformas según rol: Ventas solo ve las suyas (o todas las que creó), Admin ve todas
  const displayedProformas = proformas.filter(p => {
    if (role === 'Ventas') {
      return p.vendedor_id === userId;
    }
    return true; // Admin / Gerencia ve todas
  });

  const columns = [
    { key: 'id', label: 'Nro' },
    { key: 'cliente_nombre', label: 'Cliente' },
    { 
      key: 'fecha_creacion', 
      label: 'Fecha',
      render: (row: any) => new Date(row.fecha_creacion).toLocaleDateString()
    },
    { key: 'sucursal_nombre', label: 'Sucursal' },
    {
      key: 'estado',
      label: 'Estado',
      render: (row: any) => {
        let color = '#94a3b8';
        if (row.estado === 'APROBADO') color = '#4ade80';
        if (row.estado === 'RECHAZADO') color = '#f87171';
        if (row.estado === 'PENDIENTE') color = '#fbbf24';
        return <span style={{ color, fontWeight: 'bold' }}>{row.estado}</span>;
      }
    },
    {
      key: 'acciones',
      label: 'Acciones de Aprobación',
      render: (row: any) => {
        if (row.estado !== 'PENDIENTE') return <span>-</span>;
        if (role === 'Ventas') return <span style={{color: '#64748b'}}>Esperando revisión</span>;
        
        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => handleApprove(row.id)}
              style={{ background: 'rgba(74, 222, 128, 0.2)', color: '#4ade80', border: '1px solid #4ade80', padding: '0.3rem', borderRadius: '4px', cursor: 'pointer' }}
              title="Aprobar (Generar Salida)"
            >
              <Check size={16} />
            </button>
            <button 
              onClick={() => handleReject(row.id)}
              style={{ background: 'rgba(248, 113, 113, 0.2)', color: '#f87171', border: '1px solid #f87171', padding: '0.3rem', borderRadius: '4px', cursor: 'pointer' }}
              title="Rechazar"
            >
              <X size={16} />
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0, color: 'white' }}>Proformas</h1>
          <p style={{ color: '#94a3b8', margin: '0.5rem 0 0' }}>
            {role === 'Ventas' ? 'Tus cotizaciones pendientes y aprobadas.' : 'Revisión y aprobación de cotizaciones de Ventas.'}
          </p>
        </div>
        
        {role === 'Ventas' && (
          <Link href="/proformas/nueva" style={{ textDecoration: 'none' }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--primary)', color: 'white', border: 'none',
              padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer',
              fontWeight: 600, transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}>
              <Plus size={20} /> Nueva Proforma
            </button>
          </Link>
        )}
      </div>

      <DataTable 
        columns={columns} 
        data={displayedProformas} 
        loading={loading}
      />
    </div>
  );
}
