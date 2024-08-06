import { configureStore } from "@reduxjs/toolkit";
import { TodoReducer } from "./Todo/TodoSlice";

const store = configureStore({
  reducer: {
    Todo: TodoReducer,
  },
});

export default store;
