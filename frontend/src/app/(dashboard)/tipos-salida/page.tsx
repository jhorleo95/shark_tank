import GenericCrud from '@/components/ui/GenericCrud';

export default function TiposSalidaPage() {
  return (
    <GenericCrud 
      title="Tipos de Salida" 
      endpoint="tipos_salida" 
      columns={[
        { key: 'id', label: 'ID' }, 
        { key: 'nombre', label: 'Motivo de Salida' }
      ]} 
      fields={[
        { name: 'nombre', label: 'Motivo de Salida' }
      ]} 
    />
  );
}
