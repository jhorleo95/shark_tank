import GenericCrud from '@/components/ui/GenericCrud';

export default function TiposIngresoPage() {
  return (
    <GenericCrud 
      title="Tipos de Ingreso" 
      endpoint="tipos_ingreso" 
      columns={[
        { key: 'id', label: 'ID' }, 
        { key: 'nombre', label: 'Motivo de Ingreso' }
      ]} 
      fields={[
        { name: 'nombre', label: 'Motivo de Ingreso' }
      ]} 
    />
  );
}
