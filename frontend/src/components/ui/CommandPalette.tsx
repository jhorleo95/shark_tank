'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Package, Box, RefreshCw, BarChart2, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Opciones base del sistema para navegación rápida
  const defaultOptions = [
    { id: 'dashboard', title: 'Ir al Panel Principal', icon: <BarChart2 size={16}/>, path: '/dashboard' },
    { id: 'productos', title: 'Gestionar Productos', icon: <Package size={16}/>, path: '/productos' },
    { id: 'entradas', title: 'Registro de Entradas', icon: <RefreshCw size={16} color="#4ade80"/>, path: '/entradas' },
    { id: 'salidas', title: 'Registro de Salidas', icon: <RefreshCw size={16} color="#f87171"/>, path: '/salidas' },
    { id: 'inventario', title: 'Ver Inventario General', icon: <Box size={16}/>, path: '/inventario' },
    { id: 'marcas', title: 'Gestionar Marcas', icon: <CheckCircle size={16}/>, path: '/marcas' },
    { id: 'categorias', title: 'Gestionar Categorías', icon: <CheckCircle size={16}/>, path: '/categorias' },
  ];

  // Filtro
  const filteredOptions = defaultOptions.filter(opt => 
    opt.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Abrir con Ctrl+K o Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  const handleSelect = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions[selectedIndex]) {
        handleSelect(filteredOptions[selectedIndex].path);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)',
        zIndex: 9999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '10vh'
      }}
      onClick={() => setIsOpen(false)}
    >
      <div 
        style={{
          width: '100%', maxWidth: '600px', background: 'rgba(30, 41, 59, 0.95)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Search size={20} color="#64748b" style={{ marginRight: '1rem' }} />
          <input 
            ref={inputRef}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar módulo o acción... (ej. Entradas)"
            style={{ 
              flex: 1, background: 'transparent', border: 'none', color: 'white', 
              fontSize: '1.1rem', outline: 'none' 
            }}
          />
          <button 
            onClick={() => setIsOpen(false)}
            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '0.5rem', maxHeight: '400px', overflowY: 'auto' }}>
          {filteredOptions.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              No se encontraron resultados para "{searchTerm}"
            </div>
          ) : (
            filteredOptions.map((opt, i) => (
              <div 
                key={opt.id}
                onClick={() => handleSelect(opt.path)}
                onMouseEnter={() => setSelectedIndex(i)}
                style={{
                  display: 'flex', alignItems: 'center', padding: '1rem', gap: '1rem',
                  borderRadius: '8px', cursor: 'pointer',
                  background: selectedIndex === i ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  color: selectedIndex === i ? 'white' : '#94a3b8',
                  borderLeft: selectedIndex === i ? '3px solid #3b82f6' : '3px solid transparent'
                }}
              >
                {opt.icon}
                <span style={{ fontWeight: selectedIndex === i ? 600 : 400 }}>{opt.title}</span>
                {selectedIndex === i && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#3b82f6' }}>Presiona Enter</span>
                )}
              </div>
            ))
          )}
        </div>
        
        <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(15, 23, 42, 0.5)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '1rem', color: '#64748b', fontSize: '0.75rem' }}>
          <span><kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>↑↓</kbd> para navegar</span>
          <span><kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Enter</kbd> para seleccionar</span>
          <span><kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Esc</kbd> para cerrar</span>
        </div>
      </div>
    </div>
  );
}
