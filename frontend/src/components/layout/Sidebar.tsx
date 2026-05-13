'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Inventario', href: '/inventario', icon: '📦' },
    { name: 'Entradas', href: '/entradas', icon: '📥' },
    { name: 'Salidas', href: '/salidas', icon: '📤' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.icon}>🦈</span> <span>EVM Pro</span>
      </div>
      
      <nav className={styles.nav}>
        {links.map((link) => {
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
      </nav>
    </aside>
  );
}
