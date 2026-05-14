"use client";
import { useEffect, useState } from "react";
import { fetchGeneric } from "../../../services/api";
import { Layers3, Plus } from "lucide-react";

export default function AreasPage() {
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGeneric("areas").then((data) => { setAreas(data); setLoading(false); });
  }, []);

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-800">Áreas</h1>
          <p className="text-slate-500 mt-1">Áreas del sistema médico</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all">
          <Plus size={20} /> Nueva Área
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-400 text-lg">Cargando...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {areas.length === 0 ? (
            <div className="col-span-4 text-center py-16 text-slate-400">No hay áreas registradas aún.</div>
          ) : areas.map((a: any) => (
            <div key={a.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-md flex-shrink-0">
                <Layers3 size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{a.nombre}</h3>
                <p className="text-slate-400 text-xs">ID: {a.id}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
