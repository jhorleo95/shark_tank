"use client";
import { useEffect, useState } from "react";
import { fetchGeneric, fetchItems } from "../../../services/api";
import { Package2, Building2, Tags, Layers3, BarChart3, TrendingUp } from "lucide-react";

export default function ReportesPage() {
  const [stats, setStats] = useState({ items: 0, sucursales: 0, categorias: 0, areas: 0, marcas: 0, activos: 0, inactivos: 0, valor: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [items, sucursales, categorias, areas, marcas] = await Promise.all([
        fetchItems(), fetchGeneric("sucursales"), fetchGeneric("categorias"), fetchGeneric("areas"), fetchGeneric("marcas"),
      ]);
      setStats({
        items: items.length, sucursales: sucursales.length, categorias: categorias.length,
        areas: areas.length, marcas: marcas.length,
        activos: items.filter((i: any) => i.estado === "ACTIVO").length,
        inactivos: items.filter((i: any) => i.estado === "INACTIVO").length,
        valor: items.reduce((a: number, c: any) => a + (parseFloat(c.costo_cliente_bs) || 0), 0),
      });
      setLoading(false);
    }
    load();
  }, []);

  const pct = stats.items > 0 ? Math.round((stats.activos / stats.items) * 100) : 0;

  const kpis = [
    { label: "Total Productos", val: stats.items, icon: Package2, color: "#4f8ef7" },
    { label: "Activos", val: stats.activos, icon: TrendingUp, color: "#10b981" },
    { label: "Inactivos", val: stats.inactivos, icon: Package2, color: "#ef4444" },
    { label: "Sucursales", val: stats.sucursales, icon: Building2, color: "#8b5cf6" },
    { label: "Categorías", val: stats.categorias, icon: Tags, color: "#f59e0b" },
    { label: "Áreas", val: stats.areas, icon: Layers3, color: "#38bdf8" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "white" }}>Reportes</h1>
        <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Resumen general del sistema de inventario médico</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "64px 0", color: "#475569" }}>Cargando datos...</div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
            {kpis.map((k) => {
              const Icon = k.icon;
              return (
                <div key={k.label} style={{
                  background: "#1a2035", borderRadius: 16, padding: "20px 22px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "space-between"
                }}>
                  <div>
                    <p style={{ color: "#64748b", fontSize: 12, marginBottom: 8 }}>{k.label}</p>
                    <h2 style={{ color: "white", fontSize: 32, fontWeight: 800 }}>{k.val}</h2>
                  </div>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: `${k.color}18`, border: `1.5px solid ${k.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <Icon size={22} color={k.color} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background: "#1a2035", borderRadius: 16, padding: 28, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#4f8ef7,#38bdf8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BarChart3 size={18} color="white" />
              </div>
              <h2 style={{ color: "white", fontWeight: 700, fontSize: 17 }}>Distribución de Productos</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { label: "Productos Activos", pct, color: "#10b981" },
                { label: "Inactivos / Stock Bajo", pct: 100 - pct, color: "#ef4444" },
              ].map(b => (
                <div key={b.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ color: "#94a3b8", fontSize: 13 }}>{b.label}</span>
                    <span style={{ color: b.color, fontWeight: 700, fontSize: 13 }}>{b.pct}%</span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 999, height: 10 }}>
                    <div style={{ width: `${b.pct}%`, height: 10, borderRadius: 999, background: `linear-gradient(90deg,${b.color},${b.color}99)` }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 8, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ color: "#64748b", fontSize: 13 }}>Valor total del inventario</p>
                <h3 style={{ color: "#f59e0b", fontWeight: 800, fontSize: 24, marginTop: 4 }}>
                  Bs. {stats.valor.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
