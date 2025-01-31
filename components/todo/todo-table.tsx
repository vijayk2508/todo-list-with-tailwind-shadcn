"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RootState, AppDispatch } from "@/lib/store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodos,
  addTodo,
  updateTodo,
  Todo,
  TodoFormData,
} from "@/lib/store/features/todoSlice";
import { columns } from "./columns";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { TodoModal } from "./TodoModal";
import { TodoFilters } from "./TodoFilters";
import { TableContent } from "./TableContent";
import { Pagination } from "./Pagination";
import { toast } from "@/hooks/use-toast";

export function TodoTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, fetchStatus, currentPage, totalPages, error } = useSelector(
    (state: RootState) => state.todo
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(currentPage);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  React.useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  React.useEffect(() => {
    dispatch(fetchTodos({ page }));
  }, [page, dispatch]);

  const handleEditTodo = async (
    id: number,
    updatedTitle: string,
    completed: boolean,
  ) => {
    try {
      await dispatch(
        updateTodo({
          id,
          todo: { title: updatedTitle, completed },
        })
      );
      toast({
        title: "Success",
        description: "Todo updated successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      dispatch(fetchTodos({ page: newPage })); // Fetch new page data
    }
  };

  const table = useReactTable<Todo>({
    data: todos || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: page - 1,
        pageSize: 10, // Match the limit from fetchTodos
      },
    },
    initialState: {
      sorting: [{ id: "id", desc: false }],
    },
    manualPagination: true,
    meta: {
      onEdit: (todo: Todo) => setEditingTodo(todo),
    },
  });

  const handleEdit = async (data: TodoFormData) => {
    if (editingTodo) {
      try {
        await dispatch(updateTodo({ id: editingTodo.id, todo: data }));
        setEditingTodo(null);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update todo",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (data: TodoFormData) => {
    if (editingTodo) {
      await handleEdit(data);
    } else {
      try {
        await dispatch(addTodo(data));
        setIsAddModalOpen(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add todo",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="w-full overflow-x-auto px-4 md:px-8">
      <div className="flex flex-col md:flex-row items-center py-4 gap-4">
        <div className="flex flex-wrap md:flex-nowrap items-center gap-4 w-full">
          <Button
            className="w-full max-w-xs md:w-auto"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Todo
          </Button>

          <TodoFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            table={table}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full max-w-xs md:w-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border h-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            <TableContent
              table={table}
              fetchStatus={fetchStatus}
              error={error}
              handleEditTodo={handleEditTodo}
            />
          </TableBody>

          <Pagination
            page={page}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </Table>
      </div>

      {/* Common Modal for Add and Edit */}
      <TodoModal
        isOpen={isAddModalOpen || !!editingTodo}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTodo(null);
        }}
        onSubmit={handleSubmit}
        onEdit={handleEdit}
        initialData={editingTodo}
      />
    </div>
  );
}
