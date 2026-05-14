import GenericCrud from '@/components/ui/GenericCrud';

export default function SucursalesPage() {
  return (
    <GenericCrud 
      title="Sucursales" 
      endpoint="sucursales" 
      columns={[
        { key: 'id', label: 'ID' }, 
        { key: 'nombre', label: 'Nombre' },
        { key: 'direccion', label: 'Dirección' },
        { key: 'telefono', label: 'Teléfono' }
      ]} 
      fields={[
        { name: 'nombre', label: 'Nombre' },
        { name: 'direccion', label: 'Dirección' },
        { name: 'telefono', label: 'Teléfono' }
      ]} 
    />
  );
}
