import { fetchItems } from '../../../services/api';
import { Package2, AlertTriangle, TrendingUp, DollarSign, Download } from 'lucide-react';

export default async function DashboardPage() {
  const items = await fetchItems();

  const totalItems = items.length;
  const activos = items.filter((i: any) => i.estado === 'ACTIVO').length;
  const inactivos = items.filter((i: any) => i.estado === 'INACTIVO').length;
  const totalValue = items.reduce((acc: number, curr: any) => acc + (parseFloat(curr.costo_cliente_bs) || 0), 0);
  const pct = totalItems > 0 ? Math.round((activos / totalItems) * 100) : 0;

  const kpis = [
    { label: "Total Productos", value: totalItems, sub: "+12%", icon: Package2, color: "#4f8ef7" },
    { label: "Ítems Activos", value: activos, sub: "Listos", icon: TrendingUp, color: "#10b981" },
    { label: "Stock Bajo / Inactivos", value: inactivos, sub: "Revisar", icon: AlertTriangle, color: "#ef4444" },
    { label: "Valor Inventario (Bs)", value: `${totalValue.toLocaleString('es-BO', { minimumFractionDigits: 0 })}`, sub: "Actualizado hoy", icon: DollarSign, color: "#f59e0b" },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "white", letterSpacing: "-0.5px" }}>PANEL PRINCIPAL</h1>
          <p style={{ color: "#64748b", marginTop: 4, fontSize: 14 }}>Bienvenido al sistema de inventario médico</p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "linear-gradient(135deg,#4f8ef7,#38bdf8)",
          color: "white", border: "none", padding: "10px 20px",
          borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer"
        }}>
          <Download size={16} /> Descargar Reporte
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 28 }}>
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} style={{
              background: "#1a2035", borderRadius: 16, padding: "22px 20px",
              border: "1px solid rgba(255,255,255,0.06)",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div>
                <p style={{ color: "#64748b", fontSize: 13, marginBottom: 8 }}>{k.label}</p>
                <h2 style={{ color: "white", fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px" }}>{k.value}</h2>
                <p style={{ color: k.color, fontSize: 12, marginTop: 6, fontWeight: 600 }}>{k.sub}</p>
              </div>
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: `${k.color}18`,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: `1.5px solid ${k.color}30`
              }}>
                <Icon size={24} color={k.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        {/* Tabla actividad reciente */}
        <div style={{ background: "#1a2035", borderRadius: 16, padding: 24, border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h2 style={{ color: "white", fontWeight: 700, fontSize: 17 }}>Actividad Reciente</h2>
              <p style={{ color: "#64748b", fontSize: 13, marginTop: 2 }}>Últimos productos registrados</p>
            </div>
          </div>
          <table style={{ width: "100%" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Código", "Producto", "Marca", "Costo (Bs)", "Estado"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "0 12px 12px 0", color: "#475569", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.slice(0, 6).map((item: any) => (
                <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "14px 12px 14px 0", color: "#4f8ef7", fontWeight: 700, fontSize: 13 }}>{item.codigo_actual}</td>
                  <td style={{ padding: "14px 12px 14px 0", color: "#e2e8f0", fontSize: 13 }}>{item.descripcion_corta}</td>
                  <td style={{ padding: "14px 12px 14px 0", color: "#64748b", fontSize: 13 }}>{item.marca_nombre || '—'}</td>
                  <td style={{ padding: "14px 12px 14px 0", color: "#e2e8f0", fontSize: 13 }}>Bs. {item.costo_cliente_bs}</td>
                  <td style={{ padding: "14px 0" }}>
                    <span style={{
                      padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700,
                      background: item.estado === 'ACTIVO' ? '#10b98120' : '#ef444420',
                      color: item.estado === 'ACTIVO' ? '#10b981' : '#ef4444',
                      border: `1px solid ${item.estado === 'ACTIVO' ? '#10b98140' : '#ef444440'}`
                    }}>
                      {item.estado}
                    </span>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: "32px 0", color: "#475569" }}>Sin datos del backend aún.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Panel lateral estadísticas */}
        <div style={{ background: "#1a2035", borderRadius: 16, padding: 24, border: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 style={{ color: "white", fontWeight: 700, fontSize: 17, marginBottom: 20 }}>Estadísticas</h2>

          {/* Barra activos */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "#94a3b8", fontSize: 13 }}>Productos Activos</span>
              <span style={{ color: "#10b981", fontWeight: 700, fontSize: 13 }}>{pct}%</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 999, height: 8 }}>
              <div style={{ width: `${pct}%`, height: 8, borderRadius: 999, background: "linear-gradient(90deg,#10b981,#38bdf8)", transition: "width 0.5s" }} />
            </div>
          </div>

          {/* Barra inactivos */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "#94a3b8", fontSize: 13 }}>Inactivos / Stock Bajo</span>
              <span style={{ color: "#ef4444", fontWeight: 700, fontSize: 13 }}>{100 - pct}%</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 999, height: 8 }}>
              <div style={{ width: `${100 - pct}%`, height: 8, borderRadius: 999, background: "linear-gradient(90deg,#ef4444,#f59e0b)" }} />
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Total Productos", val: totalItems, color: "#4f8ef7" },
              { label: "Activos", val: activos, color: "#10b981" },
              { label: "Inactivos", val: inactivos, color: "#ef4444" },
              { label: "Valor Total (Bs)", val: totalValue.toLocaleString('es-BO', { minimumFractionDigits: 0 }), color: "#f59e0b" },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#64748b", fontSize: 13 }}>{r.label}</span>
                <span style={{ color: r.color, fontWeight: 800, fontSize: 15 }}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
