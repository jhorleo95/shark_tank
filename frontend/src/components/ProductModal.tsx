"use client";

import { useState } from "react";
import { createItem } from "@/services/api";

interface Props {
  open: boolean;
  onClose: () => void;
  reload: () => void;
}

export default function ProductModal({ open, onClose, reload }: Props) {
  const [form, setForm] = useState({
    codigo_actual: "",
    descripcion_corta: "",
    precio_cliente: "",
    estado: "ACTIVO",
  });

  const handleSubmit = async () => {
    try {
      await createItem(form);
      alert("Producto creado");
      reload();
      onClose();
    } catch (error) {
      console.log(error);
      alert("Error al crear");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[600px] rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-8">Nuevo Producto</h2>
        <div className="space-y-5">
          <input
            placeholder="Código"
            className="w-full border p-4 rounded-xl"
            onChange={(e) => setForm({ ...form, codigo_actual: e.target.value })}
          />
          <input
            placeholder="Descripción"
            className="w-full border p-4 rounded-xl"
            onChange={(e) => setForm({ ...form, descripcion_corta: e.target.value })}
          />
          <input
            placeholder="Precio"
            className="w-full border p-4 rounded-xl"
            onChange={(e) => setForm({ ...form, precio_cliente: e.target.value })}
          />
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <button onClick={onClose} className="bg-slate-200 px-6 py-3 rounded-xl">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="bg-[var(--primary)] text-white px-6 py-3 rounded-xl">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
