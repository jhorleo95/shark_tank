import GenericCrud from '@/components/ui/GenericCrud';

export default function MarcasPage() {
  return (
    <GenericCrud 
      title="Marcas" 
      endpoint="marcas" 
      columns={[
        { key: 'id', label: 'ID' }, 
        { key: 'nombre', label: 'Nombre de la Marca' }
      ]} 
      fields={[
        { name: 'nombre', label: 'Nombre de la Marca' }
      ]} 
    />
  );
}
