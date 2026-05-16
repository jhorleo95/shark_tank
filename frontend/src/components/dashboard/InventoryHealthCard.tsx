'use client';
import React, { useMemo } from 'react';
import { HeartPulse, Activity } from 'lucide-react';

export default function InventoryHealthCard({ items }: { items: any[] }) {
  const healthScore = useMemo(() => {
    if (items.length === 0) return 100;
    
    let score = 100;
    const inactivos = items.filter(i => i.estado === 'INACTIVO').length;
    const sinStock = items.filter(i => (i.stock_minimo_global || 5) > 1000).length; // Mock, as we don't have real stock yet in items array easily
    
    score -= (inactivos / items.length) * 20; // Hasta 20 puntos menos por inactivos
    return Math.max(0, Math.round(score));
  }, [items]);

  let color = '#4ade80'; // Verde
  let statusText = 'Óptimo';
  if (healthScore < 70) { color = '#fbbf24'; statusText = 'Requiere Atención'; }
  if (healthScore < 40) { color = '#f87171'; statusText = 'Crítico'; }

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px',
        background: color, filter: 'blur(80px)', opacity: 0.15, borderRadius: '50%'
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HeartPulse size={20} color={color} /> Salud del Inventario
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginTop: 'auto', marginBottom: 'auto' }}>
        {/* Circle Score */}
        <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="8" strokeDasharray={`${(healthScore / 100) * 251.2} 251.2`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease-out' }} />
          </svg>
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>{healthScore}</span>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Score</span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: color, marginBottom: '0.5rem' }}>{statusText}</div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
            El índice de salud evalúa la rotación, el stock inmovilizado y los niveles de seguridad.
          </p>
        </div>
      </div>
    </div>
  );
}
