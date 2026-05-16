'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        const res = await fetch('http://127.0.0.1:8000/api/users/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setRole(data.rol || 'Ventas');
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRole();
  }, []);

  const mainLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Inventario / Stock', href: '/inventario', icon: '📦' },
    { name: 'Proformas', href: '/proformas', icon: '📝' },
    { name: 'Entradas', href: '/entradas', icon: '📥' },
    { name: 'Salidas', href: '/salidas', icon: '📤' },
    { name: 'Personal', href: '/personal', icon: '👥' },
  ];

  const catalogLinks = [
    { name: 'Productos', href: '/productos', icon: '💊' },
    { name: 'Sucursales', href: '/sucursales', icon: '🏥' },
    { name: 'Áreas', href: '/areas', icon: '🏢' },
    { name: 'Categorías', href: '/categorias', icon: '🏷️' },
    { name: 'Marcas', href: '/marcas', icon: '®️' },
    { name: 'Unidades', href: '/unidades', icon: '📏' },
    { name: 'Tipos de Ingreso', href: '/tipos-ingreso', icon: '➕' },
    { name: 'Tipos de Salida', href: '/tipos-salida', icon: '➖' },
  ];

  const filteredMainLinks = mainLinks.filter(link => {
    if (!role) return true; // Show all while loading
    if (role === 'Gerencia General') return true;
    if (role === 'Administrativa') return link.name !== 'Personal';
    if (role === 'Ventas') return link.name === 'Salidas' || link.name === 'Proformas';
    if (role === 'RRHH') return link.name === 'Personal';
    return false;
  });

  const filteredCatalogLinks = catalogLinks.filter(link => {
    if (!role) return true; // Show all while loading
    if (role === 'Gerencia General') return true;
    if (role === 'Administrativa') return true;
    if (role === 'Ventas') return link.name === 'Productos';
    if (role === 'RRHH') return false;
    return false;
  });

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.icon}>🦈</span> <span>EVM Pro</span>
      </div>
      
      <nav className={styles.nav}>
        <div className={styles.navGroup}>
          <p className={styles.navGroupTitle}>Principal</p>
          {filteredMainLinks.length > 0 ? filteredMainLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                <span className={styles.icon}>{link.icon}</span>
                {link.name}
              </Link>
            );
          }) : <p style={{color: '#64748b', fontSize: '0.8rem', padding: '0 1rem'}}>Sin acceso</p>}
        </div>

        {filteredCatalogLinks.length > 0 && (
          <div className={styles.navGroup}>
            <button 
              className={`${styles.navItem} ${styles.navGroupToggle}`}
              onClick={() => setCatalogOpen(!catalogOpen)}
            >
              <span className={styles.icon}>⚙️</span>
              Mantenedores
              <span className={styles.toggleIcon}>{catalogOpen ? '▼' : '▶'}</span>
            </button>
            
            {catalogOpen && (
              <div className={styles.subNav}>
                {filteredCatalogLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link 
                      key={link.name} 
                      href={link.href} 
                      className={`${styles.navItem} ${styles.subNavItem} ${isActive ? styles.navItemActive : ''}`}
                    >
                      <span className={styles.icon}>{link.icon}</span>
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </nav>

      <div style={{ marginTop: 'auto', padding: '1.5rem' }}>
        <button 
          onClick={() => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
          }}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#fca5a5',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s'
          }}
        >
          <span>🚪</span> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
