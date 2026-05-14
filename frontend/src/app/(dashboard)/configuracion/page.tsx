import ThemeCustomizer from "@/components/ThemeCustomizer";

export default function ConfiguracionPage() {
  return (
    <div>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "2rem" }}>Configuración</h1>
      <ThemeCustomizer />
    </div>
  );
}
