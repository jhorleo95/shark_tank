import { fetchItems } from '../../../services/api';
import styles from './page.module.css';

// Componente de servidor (Server Component) para obtener datos iniciales
export default async function InventarioPage() {
  const items = await fetchItems();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Inventario de Productos</h1>
        <p style={{ color: '#94a3b8' }}>Listado maestro extraído desde MySQL mediante Django REST</p>
      </div>

      <div className={`glass-panel ${styles.tableContainer}`}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
            No hay productos registrados aún. Entra al admin de Django para crear algunos.
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Marca</th>
                <th>Categoría</th>
                <th>Costo (Bs)</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any) => (
                <tr key={item.id}>
                  <td><strong>{item.codigo_actual}</strong></td>
                  <td>{item.descripcion_corta}</td>
                  <td>{item.marca_nombre || 'N/A'}</td>
                  <td>{item.area_categoria_detalle?.categoria_nombre || 'N/A'}</td>
                  <td>Bs. {item.costo_cliente_bs}</td>
                  <td>
                    <span className={`${styles.badge} ${item.estado === 'ACTIVO' ? styles.badgeActive : styles.badgeInactive}`}>
                      {item.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
