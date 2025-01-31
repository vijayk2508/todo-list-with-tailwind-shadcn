import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { deleteTodo, Todo } from "@/lib/store/features/todoSlice";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store/store";
import { toast } from "@/hooks/use-toast";

interface ActionProps {
  readonly todo: Todo;
  readonly onEdit: (todo: Todo) => void;
}

function Action({ todo, onEdit }: Readonly<ActionProps>) {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onEdit(todo)}>Edit</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            try {
              dispatch(deleteTodo(todo.id));
              toast({
                title: "Success",
                description: "Todo deleted successfully",
                variant: "success",
              });
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to delete todo",
                variant: "destructive",
              });
            }
          }}
          className="text-red-600"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Action;
