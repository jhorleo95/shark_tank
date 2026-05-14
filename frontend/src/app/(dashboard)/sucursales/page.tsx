"use client";
import { useEffect, useState } from "react";
import { fetchGeneric } from "../../../services/api";
import { Building2, Plus, MapPin, Phone } from "lucide-react";

export default function SucursalesPage() {
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGeneric("sucursales").then((d) => { setSucursales(d); setLoading(false); });
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
            <span style={{ color: "#64748b", fontSize: 13 }}>Panel Principal</span>
            <span style={{ color: "#475569" }}>›</span>
            <span style={{ color: "#4f8ef7", fontSize: 13, fontWeight: 600 }}>Sucursales</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "white" }}>Sucursales</h1>
          <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Gestión de sucursales registradas</p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "linear-gradient(135deg,#4f8ef7,#38bdf8)",
          color: "white", border: "none", padding: "10px 20px",
          borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer"
        }}>
          <Plus size={16} /> Nueva Sucursal
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "64px 0", color: "#475569" }}>Cargando...</div>
      ) : sucursales.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 0", color: "#475569" }}>Sin sucursales registradas aún.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {sucursales.map((s: any) => (
            <div key={s.id} style={{
              background: "#1a2035", borderRadius: 16, padding: 24,
              border: "1px solid rgba(255,255,255,0.06)", transition: "border-color 0.2s"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: "linear-gradient(135deg,#4f8ef7,#38bdf8)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Building2 size={22} color="white" />
                </div>
                <div>
                  <h3 style={{ color: "white", fontWeight: 700, fontSize: 15 }}>{s.nombre}</h3>
                  <p style={{ color: "#475569", fontSize: 12 }}>ID: {s.id}</p>
                </div>
              </div>
              {s.direccion && <p style={{ color: "#64748b", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><MapPin size={13} />{s.direccion}</p>}
              {s.telefono && <p style={{ color: "#64748b", fontSize: 13, marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}><Phone size={13} />{s.telefono}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
