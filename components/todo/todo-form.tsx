"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TodoFormData } from "@/lib/store/features/todoSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Spinner } from "../ui/spinner";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  completed: z.boolean(),
});

interface TodoFormProps {
  readonly initialData?: TodoFormData | null;
  readonly onSubmit: (data: TodoFormData) => void;
  readonly onCancel?: () => void;
}

export function TodoForm(props: Readonly<TodoFormProps>) {
  const { addStatus, updateStatus } = useSelector(
    (state: RootState) => state.todo
  );

  const { initialData, onSubmit, onCancel } = props;
  const form = useForm<TodoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      completed: false,
    },
  });

  const isLoading = addStatus === "loading" || updateStatus === "loading";

  const renderButtonContent = () => {
    return (
      <>
        {isLoading && <Spinner size="small" />}
        <span>{isLoading ? " Submitting..." : "Save"}</span>
      </>
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          {...form.register("title")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter todo title"
        />
        {form.formState.errors.title && (
          <p className="text-sm text-red-600">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="completed"
          {...form.register("completed")}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label
          htmlFor="completed"
          className="text-sm font-medium text-gray-700"
        >
          Completed
        </label>
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          {renderButtonContent()}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
