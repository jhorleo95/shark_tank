import { fetchItems } from '../../../services/api';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';

export default async function InventarioPage() {
  const items = await fetchItems();

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ color: "#64748b", fontSize: 13 }}>Panel Principal</span>
          <span style={{ color: "#475569" }}>›</span>
          <span style={{ color: "#4f8ef7", fontSize: 13, fontWeight: 600 }}>Inventario</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "white" }}>Gestionar Inventario</h1>
          <button style={{
            width: 40, height: 40, borderRadius: 10,
            background: "linear-gradient(135deg,#4f8ef7,#38bdf8)",
            border: "none", display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer"
          }}>
            <Plus size={20} color="white" />
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div style={{ background: "#1a2035", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 13 }}>
            <span style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8, padding: "6px 14px", color: "#94a3b8", fontSize: 13
            }}>
              {items.length} registros
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8, padding: "8px 14px"
            }}>
              <Search size={14} color="#64748b" />
              <span style={{ color: "#475569", fontSize: 13 }}>Buscar...</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)" }}>
              {["N°", "Código", "Descripción", "Marca", "Categoría", "Costo (Bs)", "Stock Mín.", "Estado", "Acciones"].map(h => (
                <th key={h} style={{
                  textAlign: "left", padding: "13px 16px",
                  color: "#475569", fontSize: 12, fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.06em",
                  borderBottom: "1px solid rgba(255,255,255,0.06)"
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: "center", padding: "48px 0", color: "#475569" }}>
                Sin productos registrados. Conecta el backend para ver datos.
              </td></tr>
            ) : items.map((item: any, i: number) => (
              <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}>
                <td style={{ padding: "14px 16px", color: "#64748b", fontSize: 13 }}>{i + 1}</td>
                <td style={{ padding: "14px 16px", color: "#4f8ef7", fontWeight: 700, fontSize: 13 }}>{item.codigo_actual}</td>
                <td style={{ padding: "14px 16px", color: "#e2e8f0", fontSize: 13, maxWidth: 220 }}>{item.descripcion_corta}</td>
                <td style={{ padding: "14px 16px", color: "#94a3b8", fontSize: 13 }}>{item.marca_nombre || '—'}</td>
                <td style={{ padding: "14px 16px", color: "#94a3b8", fontSize: 13 }}>{item.area_categoria_detalle?.categoria_nombre || '—'}</td>
                <td style={{ padding: "14px 16px", color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>Bs. {item.costo_cliente_bs}</td>
                <td style={{ padding: "14px 16px", color: "#94a3b8", fontSize: 13 }}>{item.stock_minimo_global}</td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{
                    padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700,
                    background: item.estado === 'ACTIVO' ? '#10b98118' : '#ef444418',
                    color: item.estado === 'ACTIVO' ? '#10b981' : '#ef4444',
                    border: `1px solid ${item.estado === 'ACTIVO' ? '#10b98135' : '#ef444435'}`
                  }}>
                    {item.estado}
                  </span>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={{
                      width: 32, height: 32, borderRadius: 8, border: "none",
                      background: "#4f8ef720", color: "#4f8ef7",
                      display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                    }}><Pencil size={14} /></button>
                    <button style={{
                      width: 32, height: 32, borderRadius: 8, border: "none",
                      background: "#ef444420", color: "#ef4444",
                      display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                    }}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer paginación */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#475569", fontSize: 13 }}>Mostrando 1 a {Math.min(items.length, 10)} de {items.length} registros</span>
          <div style={{ display: "flex", gap: 6 }}>
            {["‹", "1", "›"].map((p, i) => (
              <button key={i} style={{
                width: 34, height: 34, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)",
                background: i === 1 ? "linear-gradient(135deg,#4f8ef7,#38bdf8)" : "rgba(255,255,255,0.04)",
                color: i === 1 ? "white" : "#64748b", fontWeight: 700, fontSize: 14, cursor: "pointer"
              }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
