'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = 'http://127.0.0.1:8000/api/v1';

export default function NuevaProformaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  
  const [clienteNombre, setClienteNombre] = useState('');
  const [sucursalId, setSucursalId] = useState('');
  const [observacion, setObservacion] = useState('');
  
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  
  // Carrito de compras
  const [cart, setCart] = useState<any[]>([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedAreaId, setSelectedAreaId] = useState('');
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        const userRes = await fetch('http://127.0.0.1:8000/api/users/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUserId(userData.id);
        }
      }
      
      // Fetch catalogos
      Promise.all([
        fetch(`${API_URL}/sucursales/`).then(r => r.json()),
        fetch(`${API_URL}/items/`).then(r => r.json()),
        fetch(`${API_URL}/areas/`).then(r => r.json())
      ]).then(([sucData, itmData, arData]) => {
        setSucursales(sucData);
        setItems(itmData);
        setAreas(arData);
      }).catch(() => toast.error('Error cargando catálogos'));
    };
    init();
  }, []);

  const addToCart = () => {
    if (!selectedItemId || !selectedAreaId || cantidad <= 0) {
      toast.error('Selecciona un producto, un área y una cantidad válida');
      return;
    }
    const itemFull = items.find(i => i.id === parseInt(selectedItemId));
    if (!itemFull) return;

    const price = parseFloat(itemFull.costo_cliente_bs) || 0;

    const cartItem = {
      item_id: itemFull.id,
      item_nombre: itemFull.descripcion_corta,
      cantidad: cantidad,
      precio_unitario: price,
      area_id: parseInt(selectedAreaId)
    };

    setCart([...cart, cartItem]);
    setSelectedItemId('');
    setCantidad(1);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleSave = async () => {
    if (!clienteNombre || !sucursalId || cart.length === 0) {
      toast.error('Completa los datos del cliente, sucursal y añade al menos un producto');
      return;
    }

    setLoading(true);
    try {
      // 1. Crear la Proforma
      const proformaRes = await fetch(`${API_URL}/proformas/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_nombre: clienteNombre,
          vendedor_id: userId,
          sucursal: parseInt(sucursalId),
          observacion: observacion,
          estado: 'PENDIENTE'
        })
      });

      if (!proformaRes.ok) throw new Error('Error al crear proforma principal');
      const proforma = await proformaRes.json();

      // 2. Crear los detalles
      for (const c of cart) {
        await fetch(`${API_URL}/detalle-proformas/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            proforma: proforma.id,
            item: c.item_id,
            cantidad: c.cantidad,
            precio_unitario: c.precio_unitario,
            area: c.area_id
          })
        });
      }

      toast.success('Proforma enviada a aprobación');
      router.push('/proformas');
    } catch (err) {
      console.error(err);
      toast.error('Ocurrió un error al guardar la proforma');
    } finally {
      setLoading(false);
    }
  };

  const totalProforma = cart.reduce((acc, curr) => acc + (curr.cantidad * curr.precio_unitario), 0);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/proformas" style={{ color: '#94a3b8', textDecoration: 'none' }}>
          <ArrowLeft size={24} />
        </Link>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0, color: 'white' }}>Nueva Proforma</h1>
      </div>

      <div style={{ 
        background: 'rgba(255, 255, 255, 0.03)', 
        border: '1px solid rgba(255, 255, 255, 0.1)', 
        borderRadius: '12px', 
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
          Datos Generales
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Nombre del Cliente</label>
            <input 
              type="text" 
              value={clienteNombre} 
              onChange={e => setClienteNombre(e.target.value)}
              placeholder="Ej. Juan Pérez"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Sucursal a Despachar</label>
            <select 
              value={sucursalId} 
              onChange={e => setSucursalId(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            >
              <option value="">Seleccione...</option>
              {sucursales.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Observaciones</label>
          <input 
            type="text" 
            value={observacion} 
            onChange={e => setObservacion(e.target.value)}
            placeholder="Opcional"
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
          />
        </div>
      </div>

      <div style={{ 
        background: 'rgba(255, 255, 255, 0.03)', 
        border: '1px solid rgba(255, 255, 255, 0.1)', 
        borderRadius: '12px', 
        padding: '2rem'
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
          Añadir Productos al Carrito
        </h2>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Producto</label>
            <select 
              value={selectedItemId} 
              onChange={e => setSelectedItemId(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            >
              <option value="">Seleccione...</option>
              {items.map(i => <option key={i.id} value={i.id}>{i.descripcion_corta} (Bs. {i.costo_cliente_bs})</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Área de Destino</label>
            <select 
              value={selectedAreaId} 
              onChange={e => setSelectedAreaId(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            >
              <option value="">Seleccione...</option>
              {areas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
          </div>
          <div style={{ width: '100px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>Cant.</label>
            <input 
              type="number" 
              min="1"
              value={cantidad} 
              onChange={e => setCantidad(parseInt(e.target.value) || 1)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
            />
          </div>
          <button 
            onClick={addToCart}
            style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid #3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} /> Añadir
          </button>
        </div>

        {cart.length > 0 ? (
          <div>
            <div className="premium-table-container" style={{ marginTop: '1rem' }}>
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio Unit.</th>
                    <th>Cant.</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((c, i) => (
                    <tr key={i}>
                      <td>{c.item_nombre}</td>
                      <td>Bs. {c.precio_unitario}</td>
                      <td>{c.cantidad}</td>
                      <td style={{ color: '#4ade80', fontWeight: 'bold' }}>Bs. {(c.cantidad * c.precio_unitario).toFixed(2)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button onClick={() => removeFromCart(i)} className="action-btn action-btn-delete">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.25rem', color: 'white' }}>
                Total: <span style={{ fontWeight: 'bold', color: '#4ade80' }}>Bs. {totalProforma.toFixed(2)}</span>
              </div>
              <button 
                onClick={handleSave}
                disabled={loading}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'var(--primary)', color: 'white', border: 'none',
                  padding: '0.75rem 2rem', borderRadius: '8px', cursor: 'pointer',
                  fontWeight: 600, fontSize: '1rem', opacity: loading ? 0.7 : 1
                }}
              >
                <Save size={20} /> {loading ? 'Enviando...' : 'Enviar a Aprobación'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
            El carrito está vacío. Añade productos arriba.
          </div>
        )}
      </div>
    </div>
  );
}
