'use client';
import { useEffect, useState } from 'react';
import styles from './Topbar.module.css';
import ProfileModal from '@/components/ui/ProfileModal';

export default function Topbar() {
  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      const res = await fetch('http://127.0.0.1:8000/api/users/me/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setUser(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const getInitial = () => {
    if (user?.first_name) return user.first_name.charAt(0).toUpperCase();
    if (user?.username) return user.username.charAt(0).toUpperCase();
    return 'U';
  };

  const getDisplayName = () => {
    if (user?.first_name || user?.last_name) return `${user.first_name} ${user.last_name}`.trim();
    if (user?.username) return user.username;
    return 'Cargando...';
  };

  return (
    <>
      <header className={styles.topbar}>
        <div className={styles.searchContainer}>
          <input 
            type="text" 
            placeholder="Buscar productos, lotes o facturas..." 
            className={styles.search} 
          />
        </div>
        
        <div className={styles.profile} onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{getDisplayName()}</span>
            <span className={styles.userRole}>Administrador</span>
          </div>
          <div className={styles.avatar}>{getInitial()}</div>
        </div>
      </header>

      <ProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        user={user} 
        onUpdateSuccess={fetchProfile}
      />
    </>
  );
}
