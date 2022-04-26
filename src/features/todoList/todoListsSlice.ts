import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserEmail = string;
type TodoListKey = string;

type TodoItem = {
  description: string;
  cost: number;
  id: string;
};
type TodoList = TodoItem[];

export interface TodoListsState {
  currentTodoList: string;
  todoLists: Record<UserEmail, Record<TodoListKey, TodoList>>;
}

const initialState: TodoListsState = {
  currentTodoList: "",
  todoLists: {},
};

type UserAccount = {
  userEmail: string;
};

export const todoListsSlice = createSlice({
  name: "todoLists",
  initialState,
  reducers: {
    addTodoList: (
      state: TodoListsState,
      action: PayloadAction<UserAccount>
    ) => {
      const userEmail = action.payload.userEmail;
      if (userEmail !== "") {
        if (state.todoLists[userEmail] === undefined) {
          state.todoLists[userEmail] = {};
        }

        const todoListKey: TodoListKey =
          action.payload.userEmail + "-" + new Date().toISOString();

        state.todoLists[userEmail][todoListKey] = [];
        state.currentTodoList = todoListKey;
      }
    },
  },
});

export const { addTodoList } = todoListsSlice.actions;

export default todoListsSlice.reducer;
