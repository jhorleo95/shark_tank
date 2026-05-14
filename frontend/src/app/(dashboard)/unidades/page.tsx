import GenericCrud from '@/components/ui/GenericCrud';

export default function UnidadesPage() {
  return (
    <GenericCrud 
      title="Unidades de Medida" 
      endpoint="unidades_medida" 
      columns={[
        { key: 'id', label: 'ID' }, 
        { key: 'codigo', label: 'Código' },
        { key: 'nombre', label: 'Nombre' }
      ]} 
      fields={[
        { name: 'codigo', label: 'Código' },
        { name: 'nombre', label: 'Nombre' }
      ]} 
    />
  );
}
