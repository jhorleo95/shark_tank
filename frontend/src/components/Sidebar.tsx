"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Boxes,
  ArrowDownUp,
  ArrowUpDown,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-72 h-screen bg-[var(--sidebar)] text-white fixed left-0 top-0 p-5">
      <h1 className="text-3xl font-bold mb-10">SharkTank ERP</h1>
      <nav className="space-y-4">
        <Link href="/dashboard" className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/10 transition">
          <LayoutDashboard />
          Dashboard
        </Link>
        <Link href="/inventario" className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/10 transition">
          <Boxes />
          Inventario
        </Link>
        <Link href="/entradas" className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/10 transition">
          <ArrowDownUp />
          Entradas
        </Link>
        <Link href="/salidas" className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/10 transition">
          <ArrowUpDown />
          Salidas
        </Link>
        <Link href="/configuracion" className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/10 transition">
          <Settings />
          Configuración
        </Link>
      </nav>
    </aside>
  );
}
