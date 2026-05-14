'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  loading?: boolean;
}

export default function DataTable({ data, columns, onEdit, onDelete, loading }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>;
  }

  if (data.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>No hay datos disponibles</div>;
  }

  // Lógica de paginación
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Resetear a la primera página al cambiar cantidad
  };

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              {columns.map(col => (
                <th key={col.key} style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#94a3b8', width: (col as any).width }}>
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#94a3b8', width: '150px' }}>Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, index) => (
              <tr key={row.id || index} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {columns.map(col => (
                  <td key={col.key} style={{ padding: '1rem', verticalAlign: 'top' }}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td style={{ padding: '1rem', textAlign: 'right', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      {onEdit && (
                        <button 
                          onClick={() => onEdit(row)}
                          style={{ background: 'var(--primary)', border: 'none', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Editar
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          onClick={() => onDelete(row)}
                          style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#f87171', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Paginación */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1rem', 
        borderTop: '1px solid rgba(255,255,255,0.05)',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Filas por página:</span>
          <select 
            value={rowsPerPage} 
            onChange={handleRowsPerPageChange}
            style={{ 
              background: 'rgba(0,0,0,0.2)', 
              color: 'white', 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '6px', 
              padding: '0.4rem',
              outline: 'none'
            }}
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={data.length}>Todos</option>
          </select>
          <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            Mostrando {startIndex + 1} a {Math.min(endIndex, data.length)} de {data.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: currentPage === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
              color: currentPage === 1 ? '#475569' : 'white',
              border: 'none', borderRadius: '6px', padding: '0.4rem', cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
            title="Anterior"
          >
            <ChevronLeft size={18} />
          </button>
          
          <span style={{ fontSize: '0.875rem', color: '#e2e8f0', minWidth: '80px', textAlign: 'center' }}>
            Página {currentPage} de {totalPages || 1}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: currentPage === totalPages || totalPages === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
              color: currentPage === totalPages || totalPages === 0 ? '#475569' : 'white',
              border: 'none', borderRadius: '6px', padding: '0.4rem', cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
            title="Siguiente"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
