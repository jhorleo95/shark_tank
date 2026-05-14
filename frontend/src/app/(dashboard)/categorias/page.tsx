"use client";
import { useEffect, useState } from "react";
import { fetchGeneric } from "../../../services/api";
import { Tags, Plus } from "lucide-react";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGeneric("categorias").then((data) => { setCategorias(data); setLoading(false); });
  }, []);

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-800">Categorías</h1>
          <p className="text-slate-500 mt-1">Categorías de productos médicos</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all">
          <Plus size={20} /> Nueva Categoría
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-400 text-lg">Cargando...</div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {categorias.length === 0 ? (
            <div className="text-center py-16 text-slate-400">No hay categorías registradas aún.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-4 text-slate-500 font-semibold text-sm uppercase tracking-wider">ID</th>
                  <th className="text-left px-6 py-4 text-slate-500 font-semibold text-sm uppercase tracking-wider">Nombre</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((c: any) => (
                  <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-400 text-sm">{c.id}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center text-white">
                        <Tags size={16} />
                      </div>
                      {c.nombre}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
