import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { URLTableRow } from "./URLTableRow";
import { URLTableToolbar } from "./URLTableToolbar";
import { useState } from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface URLTableProps {
  urls: Array<{
    id: string;
    url: string;
    status: string;
    created_at: string;
    customer: {
      id: string;
      profiles: {
        email: string;
      };
    };
  }>;
  onStatusChange: (urlId: string, newStatus: string) => void;
  onDelete: (urlId: string) => void;
}

export const URLTable = ({ urls, onStatusChange, onDelete }: URLTableProps) => {
  const { t } = useLanguage();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = [
    {
      id: "url",
      accessorKey: "url",
      header: t('deindexing.url'),
    },
    {
      id: "customer",
      accessorKey: "customer.profiles.email",
      header: t('deindexing.customer'),
    },
    {
      id: "status",
      accessorKey: "status",
      header: t('deindexing.status'),
    },
  ];

  const table = useReactTable({
    data: urls,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const handleRefresh = () => {
    // Refresh logic can be implemented here if needed
    console.log("Refresh clicked");
  };

  return (
    <div className="space-y-4">
      <div className="border border-[#dfdfdf] dark:border-[#2e2e2e]">
        <div className="overflow-x-auto" style={{ overflowY: 'visible' }}>
          <Table>
            <TableBody>
              {table.getFilteredRowModel().rows.map((row, index) => (
                <URLTableRow
                  key={row.original.id}
                  url={row.original}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                  isLast={index === table.getFilteredRowModel().rows.length - 1}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
