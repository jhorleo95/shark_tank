import GenericCrud from '@/components/ui/GenericCrud';

export default function CategoriasPage() {
  return (
    <GenericCrud 
      title="Categorías" 
      endpoint="categorias" 
      columns={[
        { key: 'id', label: 'ID' }, 
        { key: 'nombre', label: 'Nombre de la Categoría' }
      ]} 
      fields={[
        { name: 'nombre', label: 'Nombre de la Categoría' }
      ]} 
    />
  );
}
