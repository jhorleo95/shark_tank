"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Boxes, ArrowDownCircle, ArrowUpCircle,
  Building2, Tags, Layers3, Package2, BarChart3, Settings,
  Activity, UserCircle2
} from "lucide-react";

const menu = [
  { label: "Panel Principal", href: "/dashboard", icon: LayoutDashboard },
  { label: "Inventario", href: "/inventario", icon: Boxes },
  { label: "Entradas", href: "/entradas", icon: ArrowDownCircle },
  { label: "Salidas", href: "/salidas", icon: ArrowUpCircle },
  { label: "Sucursales", href: "/sucursales", icon: Building2 },
  { label: "Categorías", href: "/categorias", icon: Tags },
  { label: "Áreas", href: "/areas", icon: Layers3 },
  { label: "Marcas", href: "/marcas", icon: Package2 },
  { label: "Reportes", href: "/reportes", icon: BarChart3 },
  { label: "Configuración", href: "/configuracion", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      position: "fixed", left: 0, top: 0, width: 260, height: "100vh",
      background: "#1a2035", display: "flex", flexDirection: "column",
      zIndex: 50, overflowY: "auto"
    }}>
      {/* Logo */}
      <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg,#4f8ef7,#38bdf8)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Activity size={20} color="white" />
          </div>
          <span style={{ color: "white", fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px" }}>
            MedSystem
          </span>
        </div>
      </div>

      {/* Perfil */}
      <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "linear-gradient(135deg,#4f8ef7,#38bdf8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 10px"
        }}>
          <UserCircle2 size={36} color="white" />
        </div>
        <p style={{ color: "white", fontWeight: 700, fontSize: 15 }}>Administrador</p>
        <p style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>Control Total</p>
      </div>

      {/* Nav */}
      <nav style={{ padding: "16px 12px", flex: 1 }}>
        <p style={{ color: "#475569", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 12px", marginBottom: 8 }}>
          Menú
        </p>
        {menu.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", borderRadius: 10, marginBottom: 2,
              background: active ? "linear-gradient(135deg,#4f8ef7,#38bdf8)" : "transparent",
              color: active ? "white" : "#94a3b8",
              fontWeight: active ? 700 : 500, fontSize: 14,
              textDecoration: "none", transition: "all 0.2s"
            }}>
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
