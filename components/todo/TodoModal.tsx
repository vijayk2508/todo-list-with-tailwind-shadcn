import React from "react";
import { TodoForm } from "./todo-form";
import { TodoFormData, Todo } from "@/lib/store/features/todoSlice";

interface TodoModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (data: TodoFormData) => Promise<void>;
  readonly initialData?: Todo | null;
  readonly onEdit: (data: TodoFormData) => Promise<void>;
}

export const TodoModal: React.FC<TodoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  onEdit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {initialData ? "Edit Todo" : "Add New Todo"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <TodoForm
          initialData={initialData}
          onSubmit={initialData ? onEdit : onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};
