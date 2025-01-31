import { RequestStatus } from "@/lib/utils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface AuthState {
  user: any;
  token: string | null;
  status: RequestStatus;
  error: string | null;
}

const initialState: AuthState = {
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") ?? "{}")
      : {},
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null, // Check if window is defined
  status: "idle",
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { username: string; password: string }) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include", // Include cookies (e.g., accessToken) in the request
    });
    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    return data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.token = action.payload.accessToken;
        localStorage.setItem("token", action.payload.accessToken); // Store token in local storage
        localStorage.setItem("user", JSON.stringify(action.payload)); // Store token in local storage
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Login failed";
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
