import { Todo } from "@/lib/store/features/todoSlice";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, ArrowUpDown, CheckCircle2, Circle } from "lucide-react";
import Action from "@/components/todo/action";

/** Define allowed statuses */
const statusIcons: Record<string, JSX.Element> = {
  false: <AlertCircle className="h-4 w-4 text-yellow-500" />,
  true: <CheckCircle2 className="h-4 w-4 text-green-500" />,
};

/** Define Table Meta */
type TableMeta = {
  onEdit: (todo: Todo) => void;
};

/** Define columns */
export const columns: ColumnDef<Todo>[] = [
  {
    id: "select",
    header: ({ table }) => {
      let isChecked: boolean | "indeterminate" = false;

      if (table.getIsAllPageRowsSelected()) {
        isChecked = true;
      } else if (table.getIsSomePageRowsSelected()) {
        isChecked = "indeterminate";
      }

      return (
        <Checkbox
          checked={isChecked}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      );
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Id
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "completed",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Completed
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const completed = row.getValue<Todo["completed"]>("completed");
      return (
        <div className="flex items-center gap-2">
          {statusIcons[String(completed)] ?? (
            <Circle className="h-4 w-4 text-gray-500" />
          )}
          <span className="capitalize">
            {completed ? "Completed" : "Pending"}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const todo = row.original;
      return (
        <Action
          todo={todo}
          onEdit={() => (table.options.meta as TableMeta)?.onEdit?.(todo)}
        />
      );
    },
  },
];
