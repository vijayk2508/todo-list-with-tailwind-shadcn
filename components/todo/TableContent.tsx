import * as React from "react";
import { flexRender, Table as ReactTable } from "@tanstack/react-table";
import { TableRow, TableCell } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { columns } from "./columns";
import { Todo } from "@/lib/store/features/todoSlice";

interface TableContentProps {
  readonly table: ReactTable<Todo>;
  readonly fetchStatus: string;
  readonly error: string | null;
  readonly handleEditTodo: (
    id: number,
    updatedTitle: string,
    completed: boolean
  ) => void;
}

export const TableContent: React.FC<TableContentProps> = ({
  table,
  fetchStatus,
  error,
  handleEditTodo,
}) => {
  if (fetchStatus === "loading") {
    return (
      <TableRow className="h-[645px]">
        <TableCell colSpan={columns.length} className="text-center">
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </TableCell>
      </TableRow>
    );
  }

  if (fetchStatus === "failed") {
    return (
      <TableRow>
        <TableCell colSpan={columns.length} className="h-[500px] text-center">
          <p className="text-red-500">Error: {error}</p>
        </TableCell>
      </TableRow>
    );
  }

  if (table.getRowModel().rows.length) {
    return table.getRowModel().rows.map((row) => (
      <TableRow key={row.id}>
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, {
              ...cell.getContext(),
              handleEdit: handleEditTodo,
            })}
          </TableCell>
        ))}
      </TableRow>
    ));
  }

  return (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-24 text-center">
        No results.
      </TableCell>
    </TableRow>
  );
};
