'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search, Download } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');

  // Lógica de búsqueda (Hook moved above early returns)
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter(row => {
      return columns.some(col => {
        const val = row[col.key];
        if (val == null) return false;
        return String(val).toLowerCase().includes(lowerSearch);
      });
    });
  }, [data, searchTerm, columns]);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>;
  }

  if (data.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>No hay datos disponibles</div>;
  }

  // Lógica de paginación
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Resetear a la primera página al cambiar cantidad
  };

  const handleExportCSV = () => {
    if (filteredData.length === 0) return;
    
    // Preparar encabezados
    const csvHeaders = columns.map(col => col.label).join(',');
    
    // Preparar filas
    const csvRows = filteredData.map(row => {
      return columns.map(col => {
        let cellVal = row[col.key];
        // Escapar comillas dobles y envolver en comillas si hay comas o saltos de línea
        if (cellVal == null) cellVal = '';
        const stringVal = String(cellVal).replace(/"/g, '""');
        if (stringVal.includes(',') || stringVal.includes('\n') || stringVal.includes('"')) {
          return `"${stringVal}"`;
        }
        return stringVal;
      }).join(',');
    });
    
    const csvContent = [csvHeaders, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EVM_Export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="premium-table-container">
      <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input 
            type="text" 
            placeholder="Buscar en todos los campos..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset page on search
            }}
            style={{ 
              width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', 
              background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '8px', color: 'white', outline: 'none' 
            }}
          />
        </div>
        <button
          onClick={handleExportCSV}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(255,255,255,0.05)', color: 'white',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
            padding: '0.6rem 1rem', cursor: 'pointer', fontWeight: 600,
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        >
          <Download size={18} /> Exportar CSV
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="premium-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} style={{ width: (col as any).width }}>
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th style={{ width: '150px', textAlign: 'right' }}>Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, index) => (
              <tr key={row.id || index}>
                {columns.map(col => (
                  <td key={col.key}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      {onEdit && (
                        <button 
                          onClick={() => onEdit(row)}
                          className="action-btn action-btn-edit"
                        >
                          Editar
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          onClick={() => onDelete(row)}
                          className="action-btn action-btn-delete"
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
            <option value={filteredData.length}>Todos</option>
          </select>
          <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            Mostrando {filteredData.length === 0 ? 0 : startIndex + 1} a {Math.min(endIndex, filteredData.length)} de {filteredData.length}
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
