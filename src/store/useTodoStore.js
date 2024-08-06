import create from "zustand";
import axios from "axios";

const useTodoStore = create((set, get) => ({
  loading: false,
  todos: [],
  error: "",
  fetchTodos: async () => {
    set({ loading: true, error: "" });
    try {
      set({ loading: true });
      const res = await axios.get("http://localhost:3000/Todos");
      set({ todos: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },
  addTodo: async (todo) => {
    set({ loading: true, error: "" });
    try {
      const res = await axios.post("http://localhost:3000/Todos", todo);
      set((state) => ({ todos: [...state.todos, res.data], loading: false }));
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },
  deleteTodo: async (id) => {
    set({ loading: true, error: "" });
    try {
      await axios.delete(`http://localhost:3000/Todos/${id}`);
      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },
  updateTodo: async (todo) => {
    set({ loading: true, error: "" });
    try {
      const res = await axios.put(
        `http://localhost:3000/Todos/${todo.id}`,
        todo
      );
      set((state) => ({
        todos: state.todos.map((t) => (t.id === todo.id ? res.data : t)),
        loading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },
  toggleCompleted: async (id) => {
    const todo = get().todos.find((t) => t.id === id);
    if (!todo) return;
    // set({ loading: true, error: "" });
    try {
      const res = await axios.put(`http://localhost:3000/Todos/${id}`, {
        ...todo,
        completed: !todo.completed,
      });
      set((state) => ({
        todos: state.todos.map((t) => (t.id === id ? res.data : t)),
        loading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },
}));

export default useTodoStore;
