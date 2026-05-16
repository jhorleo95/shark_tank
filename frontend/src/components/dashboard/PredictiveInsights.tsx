'use client';
import React, { useMemo } from 'react';
import { AlertTriangle, TrendingDown, Target, Zap } from 'lucide-react';

export default function PredictiveInsights({ items }: { items: any[] }) {
  
  const insights = useMemo(() => {
    const list = [];
    
    // Insight 1: Productos Inactivos
    const inactivos = items.filter(i => i.estado === 'INACTIVO');
    if (inactivos.length > 0) {
      list.push({
        id: 1,
        type: 'warning',
        icon: <AlertTriangle size={18} color="#fbbf24" />,
        title: 'Productos Inactivos Detectados',
        desc: `Tienes ${inactivos.length} producto(s) inactivo(s). Sugerencia: Revisar si pueden reactivarse o eliminarse para limpiar el catálogo.`
      });
    }

    // Insight 2: Análisis ABC (Mock aproximado por falta de historial de ventas)
    const sortedByValue = [...items].sort((a, b) => (parseFloat(b.costo_cliente_bs) || 0) - (parseFloat(a.costo_cliente_bs) || 0));
    const topValuable = sortedByValue.slice(0, Math.max(1, Math.floor(items.length * 0.2))); // Top 20%
    
    if (topValuable.length > 0) {
      list.push({
        id: 2,
        type: 'info',
        icon: <Target size={18} color="#3b82f6" />,
        title: 'Análisis ABC: Zona A (Alto Valor)',
        desc: `Tus ${topValuable.length} productos más caros representan el mayor riesgo financiero. Asegura conteos cíclicos semanales para estos ítems.`
      });
    }

    // Insight 3: Predicción (Mock)
    list.push({
      id: 3,
      type: 'action',
      icon: <Zap size={18} color="#a855f7" />,
      title: 'Alerta Predictiva',
      desc: 'Basado en el consumo reciente, el "Monitor Multiparámetro" podría agotarse en 5 días. Generar orden de compra recomendada.'
    });

    return list;
  }, [items]);

  if (insights.length === 0) return null;

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column'
    }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '1.5rem' }}>
        🧠 Asistente Experto (EVM AI)
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {insights.map(insight => (
          <div key={insight.id} style={{
            background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '12px', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start'
          }}>
            <div style={{ 
              width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              background: insight.type === 'warning' ? 'rgba(251, 191, 36, 0.1)' : 
                          insight.type === 'info' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(168, 85, 247, 0.1)'
            }}>
              {insight.icon}
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white', marginBottom: '0.25rem' }}>{insight.title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>{insight.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
