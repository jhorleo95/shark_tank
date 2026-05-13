import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          Shark Tank <span className={styles.highlight}>Incubator</span>
        </h1>
        <p className={styles.subtitle}>
          Sistema de gestión y evaluación de proyectos de la Universidad.
        </p>
        
        <div className="glass-panel" style={{ marginTop: '3rem', maxWidth: '800px', width: '100%' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Estado del Proyecto</h2>
          
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>Frontend</h3>
              <p>Next.js + React configurado exitosamente.</p>
              <div className={styles.statusBadge}>Activo</div>
            </div>
            
            <div className={styles.card}>
              <h3>Backend</h3>
              <p>Django Rest Framework en Arquitectura Hexagonal con Modelos ORM.</p>
              <div className={styles.statusBadge}>Completado</div>
            </div>
            
            <div className={styles.card}>
              <h3>Base de Datos</h3>
              <p>Esquema MySQL EVM_PRO importado y sincronizado.</p>
              <div className={styles.statusBadge}>Completado</div>
            </div>
          </div>
          
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link href="/dashboard" className="btn-primary">
              Entrar al Sistema (Dashboard)
            </Link>
            <a href="http://localhost:8000/admin" target="_blank" rel="noreferrer" className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--primary)' }}>
              Panel Django Admin
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
