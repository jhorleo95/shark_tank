import GenericCrud from '@/components/ui/GenericCrud';

export default function AreasPage() {
  return (
    <GenericCrud 
      title="Áreas" 
      endpoint="areas" 
      columns={[
        { key: 'id', label: 'ID' }, 
        { key: 'nombre', label: 'Nombre del Área' }
      ]} 
      fields={[
        { name: 'nombre', label: 'Nombre del Área' }
      ]} 
    />
  );
}
