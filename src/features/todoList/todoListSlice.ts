import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "@shared/store";
import {
  UserAccount,
  UserEmail,
} from "@userAuthentication/userAuthenticationSlice";

export type TodoListKey = string;

export type TodoItem = {
  description: string;
  id: string;
  todoListOwner: UserEmail;
  creator: UserEmail;
};

export type TodoList = TodoItem[];

export interface TodoListState {
  currentTodoListKey: string;
  currentTodoListOwner: UserEmail;
  todoLists: Record<UserEmail, Record<TodoListKey, TodoList>>;
}

const initialState: TodoListState = {
  currentTodoListKey: "",
  currentTodoListOwner: "",
  todoLists: {},
};

export const todoListSlice = createSlice({
  name: "todoList",
  initialState,
  reducers: {
    addTodoList: (state: TodoListState, action: PayloadAction<UserAccount>) => {
      const userEmail = action.payload.userEmail;
      if (userEmail !== "") {
        if (state.todoLists[userEmail] === undefined) {
          state.todoLists[userEmail] = {};
        }

        const todoListKey: TodoListKey =
          action.payload.userEmail + "-" + new Date().toISOString();

        state.todoLists[userEmail][todoListKey] = [];
        state.currentTodoListKey = todoListKey;
        state.currentTodoListOwner = userEmail;
      }
    },
    addTodoItemToCurrentList: (
      state: TodoListState,
      action: PayloadAction<TodoItem>
    ) => {
      const { todoListOwner, creator, description, id } = action.payload;
      const currentTodoList =
        state.todoLists?.[todoListOwner]?.[state.currentTodoListKey];
      if (currentTodoList) {
        currentTodoList.push({
          todoListOwner,
          creator,
          description,
          id,
        });
      }
    },
  },
});

export type TodoItemFormInputs = {
  description: string;
};

export const addTodoItem =
  ({ description }: TodoItemFormInputs): AppThunk =>
  async (dispatch, getState) => {
    const rootState = getState();
    const creator = rootState.userAuthentication.userEmail;
    const todoListOwner = rootState.todoList.currentTodoListOwner;
    const id = rootState.todoList.currentTodoListKey + new Date().toISOString();

    dispatch(
      addTodoItemToCurrentList({
        description,
        todoListOwner,
        creator,
        id,
      })
    );
  };

export const { addTodoList, addTodoItemToCurrentList } = todoListSlice.actions;

export default todoListSlice.reducer;

export const selectCurrentTodoListOwner = (state: RootState) =>
  state.todoList.currentTodoListOwner;

export const selectCurrentTodoListKey = (state: RootState) =>
  state.todoList.currentTodoListKey;

export const selectTodoLists = (state: RootState) => state.todoList.todoLists;

export const selectCurrentTodoList = createSelector(
  [selectTodoLists, selectCurrentTodoListOwner, selectCurrentTodoListKey],
  (todoLists, owner, currentKey) => {
    return todoLists?.[owner]?.[currentKey];
  }
);
