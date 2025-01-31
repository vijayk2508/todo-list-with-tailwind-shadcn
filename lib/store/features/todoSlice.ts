import { toast } from "@/hooks/use-toast";
import { RequestStatus } from "@/lib/utils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface TodoFormData {
  title: string;
  completed: boolean;
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  error: string | null;
  currentPage: number;
  totalPages: number;
  fetchStatus: RequestStatus;
  addStatus: RequestStatus;
  updateStatus: RequestStatus;
  deleteStatus: RequestStatus;
}

const initialState: TodoState = {
  todos: [],
  error: null,
  currentPage: 1,
  totalPages: 1,
  fetchStatus: "idle",
  addStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
};

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async ({
    page,
  }: {
    page: number;
  }): Promise<{ todos: Todo[]; totalPages: number }> => {
    const limit = 10;
    const start = (page - 1) * limit;
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos?_start=${start}&_limit=${limit}&_sort=id&_order=desc`
    );
    const data = await response.json();

    const total = parseInt(response.headers.get("x-total-count") ?? "0");

    return {
      todos: data,
      totalPages: Math.ceil(total / limit),
    };
  }
);

export const addTodo = createAsyncThunk(
  "todos/addTodo",
  async (todo: TodoFormData): Promise<Todo> => {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      body: JSON.stringify({
        ...todo,
        userId: 1,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to add todo");
    }
    return response.json() as Promise<Todo>;
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async ({ id, todo }: { id: number; todo: TodoFormData }): Promise<Todo> => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          ...todo,
          userId: 1,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    if (!response.ok) {


      throw new Error("Failed to update todo");
    }
    return response.json() as Promise<Todo>;
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id: number): Promise<number> => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete todo");
    }
    return id;
  }
);

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.todos = action.payload.todos;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.meta.arg.page; // Update currentPage
        state.error = null;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.error.message ?? "Failed to fetch todos";
      })
      .addCase(addTodo.pending, (state) => {
        state.addStatus = "loading";
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.addStatus = "succeeded";
        state.todos.unshift(action.payload);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.addStatus = "failed";
        state.error = action.error.message ?? "Failed to add todo";
      })
      .addCase(updateTodo.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const index = state.todos.findIndex(
          (todo) => todo.id === action.payload.id
        );
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.error.message ?? "Failed to update todo";

        toast({
          title: "Error",
          description: "We are currently using a JSONPlaceholder mock API. As a result, updates won't be saved in the backend, so any new items added won't persist after an update.",
          variant: "destructive",
        });

      })
      .addCase(deleteTodo.pending, (state) => {
        state.deleteStatus = "loading";
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.error = action.error.message ?? "Failed to delete todo";
      });
  },
});

export default todoSlice.reducer;
