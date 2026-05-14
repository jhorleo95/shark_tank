"use client";

import { Search, Bell, Settings, Moon, User } from "lucide-react";

export default function Navbar() {
  return (
    <header style={{
      height: 70, background: "#1a2035",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 32px",
      position: "sticky", top: 0, zIndex: 40
    }}>
      {/* Búsqueda */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10, padding: "9px 16px", width: 320
      }}>
        <Search size={16} color="#64748b" />
        <input
          placeholder="Buscar productos, sucursales..."
          style={{
            background: "transparent", border: "none", color: "#94a3b8",
            fontSize: 14, width: "100%", fontFamily: "Inter, sans-serif"
          }}
        />
      </div>

      {/* Acciones */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {[Moon, Bell, Settings].map((Icon, i) => (
          <button key={i} style={{
            width: 38, height: 38, borderRadius: 8,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", position: "relative"
          }}>
            <Icon size={17} color="#94a3b8" />
            {i === 1 && (
              <span style={{
                position: "absolute", top: 6, right: 6,
                width: 8, height: 8, borderRadius: "50%",
                background: "#ef4444", border: "2px solid #1a2035"
              }} />
            )}
          </button>
        ))}
        <div style={{
          width: 38, height: 38, borderRadius: 8,
          background: "linear-gradient(135deg,#4f8ef7,#38bdf8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", marginLeft: 4
        }}>
          <User size={18} color="white" />
        </div>
      </div>
    </header>
  );
}
