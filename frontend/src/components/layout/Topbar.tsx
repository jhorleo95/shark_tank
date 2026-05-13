import styles from './Topbar.module.css';

export default function Topbar() {
  return (
    <header className={styles.topbar}>
      <div className={styles.searchContainer}>
        <input 
          type="text" 
          placeholder="Buscar productos, lotes o facturas..." 
          className={styles.search} 
        />
      </div>
      
      <div className={styles.profile}>
        <div className={styles.userInfo}>
          <span className={styles.userName}>Dr. Admin</span>
          <span className={styles.userRole}>Administrador</span>
        </div>
        <div className={styles.avatar}>A</div>
      </div>
    </header>
  );
}
