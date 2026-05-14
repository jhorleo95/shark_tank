"use client";

import { useThemeStore } from "@/store/themeStore";

export default function ThemeCustomizer() {
  const { primary, setPrimary } = useThemeStore();

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold mb-5">Cambiar color principal</h2>
      <input
        type="color"
        value={primary}
        onChange={(e) => setPrimary(e.target.value)}
        className="w-32 h-32 rounded-full"
      />
    </div>
  );
}
