export default function Navbar() {
  return (
    <div className="w-full h-20 bg-white rounded-2xl shadow-md flex items-center justify-between px-6 mb-6">
      <h2 className="text-2xl font-bold">Sistema Inventario Médico</h2>
      <button className="bg-[var(--primary)] text-white px-5 py-3 rounded-xl">
        Usuario Admin
      </button>
    </div>
  );
}
