import { fetchItems } from '../../../services/api';
import styles from './page.module.css';

export default async function DashboardPage() {
  const items = await fetchItems();
  
  // Calcular métricas básicas
  const totalItems = items.length;
  const activos = items.filter((i: any) => i.estado === 'ACTIVO').length;
  const inactivos = items.filter((i: any) => i.estado === 'INACTIVO').length;
  
  const totalValue = items.reduce((acc: number, curr: any) => {
    return acc + (parseFloat(curr.costo_cliente_bs) || 0);
  }, 0);

  return (
    <div className={styles.container}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Resumen General</h1>
      
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>📦</div>
          <div className={styles.kpiTitle}>Total Productos</div>
          <div className={styles.kpiValue}>{totalItems}</div>
          <div className={styles.kpiSubtext}>
            <span>↑ 12%</span> desde el mes pasado
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>✅</div>
          <div className={styles.kpiTitle}>Ítems Activos</div>
          <div className={styles.kpiValue}>{activos}</div>
          <div className={styles.kpiSubtext}>
            <span>Lista para despachar</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>⚠️</div>
          <div className={styles.kpiTitle}>Alertas Stock Bajo</div>
          <div className={styles.kpiValue}>{inactivos}</div>
          <div className={`${styles.kpiSubtext} ${styles.negative}`}>
            <span>↓ Urgente revisión</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIcon}>💰</div>
          <div className={styles.kpiTitle}>Valor Inventario</div>
          <div className={styles.kpiValue}>Bs. {totalValue.toLocaleString('es-BO', { minimumFractionDigits: 2 })}</div>
          <div className={styles.kpiSubtext}>
            <span>Actualizado hoy</span>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Movimientos Mensuales</h2>
          <div className={styles.mockChart}>
            [Gráfico Interactivo de Entradas vs Salidas]
          </div>
        </div>
        
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Actividad Reciente</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {items.slice(0, 3).map((item: any) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600 }}>{item.codigo_actual}</span>
                <span style={{ color: '#94a3b8' }}>{item.marca_nombre || 'Sin marca'}</span>
              </div>
            ))}
            {items.length === 0 && (
              <span style={{ color: '#94a3b8', textAlign: 'center' }}>No hay actividad reciente.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
