import { TableLoading } from '@/components/ui/table-loading';

export default function Loading() {
  return (
    <div className="p-6">
      <TableLoading 
        rows={5} 
        columns={10}
        showHeader={true}
        showPagination={true}
        showFilters={true}
      />
    </div>
  );
}
