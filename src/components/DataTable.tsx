
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Eye, Edit, Trash2, Search, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Column {
  header: string;
  accessor: string;
  cell?: (value: any, row: any) => JSX.Element;
}

interface StatusOption {
  id: number;
  name: string;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  onView?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onStatusChange?: (row: any, statusId: number) => void;
  statusOptions?: StatusOption[];
  searchEnabled?: boolean;
  filterOptions?: {
    accessor: string;
    options: { value: string; label: string }[];
  }[];
  pagination?: boolean;
  itemsPerPage?: number;
}

const DataTable = ({
  data,
  columns,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  statusOptions = [],
  searchEnabled = true,
  filterOptions = [],
  pagination = true,
  itemsPerPage = 10,
}: DataTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<any | null>(null);

  // Apply search and filters
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Apply search
      if (searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();
        const rowMatchesSearch = Object.keys(row).some((key) => {
          const value = row[key];
          return value && value.toString().toLowerCase().includes(searchTermLower);
        });

        if (!rowMatchesSearch) return false;
      }

      // Apply filters
      for (const [key, value] of Object.entries(filters)) {
        if (value && row[key] !== value) {
          return false;
        }
      }

      return true;
    });
  }, [data, searchTerm, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;
    
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage, pagination]);

  // Handle filter change
  const handleFilterChange = (accessor: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [accessor]: value,
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle delete click
  const handleDeleteClick = (row: any) => {
    setRowToDelete(row);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (rowToDelete && onDelete) {
      onDelete(rowToDelete);
    }
    setDeleteDialogOpen(false);
    setRowToDelete(null);
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 flex flex-col gap-4">
        {/* Search and filters */}
        <div className="flex flex-wrap gap-4">
          {searchEnabled && (
            <div className="flex items-center relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-10 w-[250px]"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when search term changes
                }}
              />
            </div>
          )}

          {filterOptions.map((option) => (
            <div key={option.accessor} className="w-[200px]">
              <Select
                value={filters[option.accessor] || ""}
                onValueChange={(value) => handleFilterChange(option.accessor, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Filter by ${option.accessor}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  {option.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="complyark-datatable">
          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.accessor}>{column.header}</th>
                ))}
                {(onView || onEdit || onDelete || onStatusChange) && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (onView || onEdit || onDelete || onStatusChange ? 1 : 0)}
                    className="text-center py-8"
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((column) => (
                      <td key={column.accessor}>
                        {column.cell
                          ? column.cell(row[column.accessor], row)
                          : row[column.accessor]}
                      </td>
                    ))}
                    {(onView || onEdit || onDelete || onStatusChange) && (
                      <td>
                        <div className="flex items-center gap-2">
                          {onView && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onView(row)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(row)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(row)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                          {onStatusChange && statusOptions.length > 0 && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {statusOptions.map((option) => (
                                  <DropdownMenuItem
                                    key={option.id}
                                    onClick={() => onStatusChange(row, option.id)}
                                    disabled={row.status === option.name}
                                  >
                                    {option.name}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
              {filteredData.length} entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected item from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default DataTable;
