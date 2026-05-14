'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const [catalogOpen, setCatalogOpen] = useState(false);

  const mainLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Inventario / Stock', href: '/inventario', icon: '📦' },
    { name: 'Entradas', href: '/entradas', icon: '📥' },
    { name: 'Salidas', href: '/salidas', icon: '📤' },
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

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.icon}>🦈</span> <span>EVM Pro</span>
      </div>
      
      <nav className={styles.nav}>
        <div className={styles.navGroup}>
          <p className={styles.navGroupTitle}>Principal</p>
          {mainLinks.map((link) => {
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
          })}
        </div>

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
              {catalogLinks.map((link) => {
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
