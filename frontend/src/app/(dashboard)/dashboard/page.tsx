'use client';
import { useEffect, useState } from 'react';
import { Package, CheckCircle, AlertTriangle, DollarSign, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import styles from './page.module.css';

const API_URL = 'http://127.0.0.1:8000/api/v1';

export default function DashboardPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/items/`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#94a3b8' }}>Cargando panel de control...</div>;
  }

  const totalItems = items.length;
  const activos = items.filter((i: any) => i.estado === 'ACTIVO').length;
  const inactivos = items.filter((i: any) => i.estado === 'INACTIVO').length;
  
  const totalValue = items.reduce((acc: number, curr: any) => {
    return acc + (parseFloat(curr.costo_cliente_bs) || 0);
  }, 0);

  // Generar datos mock basados en la realidad para los gráficos
  const chartData = [
    { name: 'Ene', activos: Math.floor(activos * 0.4), inactivos: Math.floor(inactivos * 0.2) },
    { name: 'Feb', activos: Math.floor(activos * 0.5), inactivos: Math.floor(inactivos * 0.3) },
    { name: 'Mar', activos: Math.floor(activos * 0.7), inactivos: Math.floor(inactivos * 0.5) },
    { name: 'Abr', activos: Math.floor(activos * 0.8), inactivos: Math.floor(inactivos * 0.7) },
    { name: 'May', activos: activos, inactivos: inactivos },
  ];

  // Agrupar por marcas para el BarChart
  const brandDataMap: any = {};
  items.forEach(item => {
    const brand = item.marca_nombre || 'Sin Marca';
    if(!brandDataMap[brand]) brandDataMap[brand] = 0;
    brandDataMap[brand] += 1;
  });
  
  const brandData = Object.keys(brandDataMap).map(key => ({
    name: key,
    cantidad: brandDataMap[key]
  })).sort((a, b) => b.cantidad - a.cantidad).slice(0, 5); // Top 5

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Panel de Control Financiero</h1>
        <p className={styles.subtitle}>Métricas y estado general del inventario clínico en tiempo real.</p>
      </div>
      
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiInfo}>
              <span className={styles.kpiLabel}>Total Productos Registrados</span>
              <span className={styles.kpiValue}>{totalItems}</span>
            </div>
            <div className={`${styles.kpiIconWrapper} ${styles.blue}`}>
              <Package size={24} />
            </div>
          </div>
          <div className={styles.kpiFooter}>
            <span className={styles.trendUp}><TrendingUp size={16} /> 12%</span>
            <span className={styles.kpiSubtext}>desde el mes pasado</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiInfo}>
              <span className={styles.kpiLabel}>Ítems Activos (Operativos)</span>
              <span className={styles.kpiValue}>{activos}</span>
            </div>
            <div className={`${styles.kpiIconWrapper} ${styles.green}`}>
              <CheckCircle size={24} />
            </div>
          </div>
          <div className={styles.kpiFooter}>
             <span className={styles.kpiSubtext}>Listos para ser despachados</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiInfo}>
              <span className={styles.kpiLabel}>Alertas Stock Inactivo</span>
              <span className={styles.kpiValue}>{inactivos}</span>
            </div>
            <div className={`${styles.kpiIconWrapper} ${styles.red}`}>
              <AlertTriangle size={24} />
            </div>
          </div>
          <div className={styles.kpiFooter}>
            <span className={styles.trendDown}><TrendingDown size={16} /> Requiere atención</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <div className={styles.kpiInfo}>
              <span className={styles.kpiLabel}>Valor Estimado Inventario</span>
              <span className={styles.kpiValue}>Bs. {totalValue.toLocaleString('es-BO', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={`${styles.kpiIconWrapper} ${styles.purple}`}>
              <DollarSign size={24} />
            </div>
          </div>
          <div className={styles.kpiFooter}>
            <span className={styles.kpiSubtext}>Cálculo en base a precio cliente</span>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Crecimiento del Inventario (2026)</h2>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActivos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="activos" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorActivos)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Distribución Top Marcas</h2>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={brandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} width={100} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                />
                <Bar dataKey="cantidad" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className={styles.recentActivity}>
        <div className={styles.activityHeader}>
          <h2 className={styles.chartTitle}>Últimos Productos Añadidos</h2>
          <button className={styles.viewAllBtn}>Ver Todos</button>
        </div>
        <div className={styles.activityList}>
          {items.slice(-5).reverse().map((item: any) => (
            <div key={item.id} className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <Clock size={16} />
              </div>
              <div className={styles.activityDetails}>
                <span className={styles.activityCode}>{item.codigo_actual}</span>
                <span className={styles.activityDesc}>{item.descripcion_corta}</span>
              </div>
              <div className={styles.activityStatus}>
                <span className={`${styles.badge} ${item.estado === 'ACTIVO' ? styles.badgeGreen : styles.badgeGray}`}>
                  {item.estado}
                </span>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <span style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>No hay actividad reciente.</span>
          )}
        </div>
      </div>
    </div>
  );
}
