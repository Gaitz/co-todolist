import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "@shared/store";
import {
  UserAccount,
  UserEmail,
} from "@userAuthentication/userAuthenticationSlice";

export type TodoListKey = string;

export type TodoListMetadata = {
  todoListOwner: UserEmail;
};

export type TodoItem = {
  description: string;
  id: string;
  creator: UserEmail;
  isDone: boolean;
};

export type TodoList = {
  metadata: TodoListMetadata;
  todoItems: TodoItem[];
};

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
      const owner = action.payload.userEmail;
      if (owner !== "") {
        if (state.todoLists[owner] === undefined) {
          state.todoLists[owner] = {};
        }

        const todoListKey: TodoListKey =
          action.payload.userEmail + "-" + new Date().toISOString();

        if (!state.todoLists[owner][todoListKey]) {
          state.todoLists[owner][todoListKey] = {
            metadata: { todoListOwner: owner },
            todoItems: [],
          } as TodoList;
        }
        state.currentTodoListKey = todoListKey;
        state.currentTodoListOwner = owner;
      }
    },
    addTodoItemToCurrentList: (
      state: TodoListState,
      action: PayloadAction<Omit<TodoItem, "isDone">>
    ) => {
      const { creator, description, id } = action.payload;
      const currentTodoListOwner = state.currentTodoListOwner;
      const currentTodoList =
        state.todoLists?.[currentTodoListOwner]?.[state.currentTodoListKey];

      if (currentTodoList.todoItems) {
        currentTodoList.todoItems.push({
          creator,
          description,
          id,
          isDone: false,
        });
      }
    },
    toggleItemState: (
      state: TodoListState,
      action: PayloadAction<{ itemId: TodoItem["id"] }>
    ) => {
      const todoItems =
        state.todoLists?.[state.currentTodoListOwner]?.[
          state.currentTodoListKey
        ]?.todoItems;
      const modifiedTodoItem = todoItems.filter(
        (item) => item.id === action.payload.itemId
      )[0];
      if (modifiedTodoItem) {
        modifiedTodoItem.isDone = !modifiedTodoItem.isDone;
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
    const id = rootState.todoList.currentTodoListKey + new Date().toISOString();

    dispatch(
      addTodoItemToCurrentList({
        description,
        creator,
        id,
      })
    );
  };

export const { addTodoList, addTodoItemToCurrentList, toggleItemState } =
  todoListSlice.actions;

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

export const selectCurrentTodoItems = createSelector(
  selectCurrentTodoList,
  (todoList) => {
    return todoList.todoItems;
  }
);
