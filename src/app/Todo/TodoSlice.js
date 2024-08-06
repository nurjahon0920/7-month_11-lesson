import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTodos = createAsyncThunk("Todos/fetchTodos", async () => {
  try {
    const res = await axios.get("http://localhost:3000/Todos");
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
});

export const addTodo = createAsyncThunk("Todos/addTodo", async (Todo) => {
  try {
    const res = await axios.post("http://localhost:3000/Todos", Todo);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
});

export const deleteTodo = createAsyncThunk("Todos/deleteTodo", async (id) => {
  try {
    await axios.delete(`http://localhost:3000/Todos/${id}`);
    return id;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
});

export const updateTodo = createAsyncThunk("Todos/updateTodo", async (Todo) => {
  try {
    const res = await axios.put(`http://localhost:3000/Todos/${Todo.id}`, Todo);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
});

export const toggleCompleted = createAsyncThunk(
  "Todos/toggleCompleted",
  async (id, { getState }) => {
    const Todo = getState().Todo.Todos.find((Todo) => Todo.id === id);
    try {
      const res = await axios.put(`http://localhost:3000/Todos/${id}`, {
        ...Todo,
        completed: !Todo.completed,
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  loading: false,
  Todos: [],
  error: "",
};

const TodoSlice = createSlice({
  name: "Todo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchTodos
    builder.addCase(fetchTodos.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      state.loading = false;
      state.Todos = action.payload;
      state.error = "";
    });
    builder.addCase(fetchTodos.rejected, (state, action) => {
      state.loading = false;
      state.Todos = [];
      state.error = action.error.message;
    });
    // addTodo
    builder.addCase(addTodo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addTodo.fulfilled, (state, action) => {
      state.loading = false;
      state.Todos = [...state.Todos, action.payload];
      state.error = "";
    });
    builder.addCase(addTodo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    // deleteTodo
    builder.addCase(deleteTodo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteTodo.fulfilled, (state, action) => {
      state.loading = false;
      state.Todos = state.Todos.filter((Todo) => Todo.id !== action.payload);
      state.error = "";
    });
    builder.addCase(deleteTodo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    // updateTodo
    builder.addCase(updateTodo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateTodo.fulfilled, (state, action) => {
      state.loading = false;
      state.Todos = state.Todos.map((Todo) =>
        Todo.id === action.payload.id ? action.payload : Todo
      );
      state.error = "";
    });
    builder.addCase(updateTodo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    // toggleCompleted
    builder.addCase(toggleCompleted.fulfilled, (state, action) => {
      state.Todos = state.Todos.map((Todo) =>
        Todo.id === action.payload.id ? action.payload : Todo
      );
      state.error = "";
    });
    builder.addCase(toggleCompleted.rejected, (state, action) => {
      state.error = action.error.message;
    });
  },
});

export const TodoReducer = TodoSlice.reducer;
export const TodoActions = TodoSlice.actions;
