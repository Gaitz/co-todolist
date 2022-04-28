import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "@shared/store";
import {
  UserAccount,
  UserEmail,
} from "@userAuthentication/userAuthenticationSlice";
import { socket } from "src/pages/_app";

export type TodoListKey = string;

export type TodoListMetadata = {
  owner: UserEmail;
  todoListKey: string;
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

export type TodoLists = Pick<TodoListState, "todoLists">;

export const initialState: TodoListState = {
  currentTodoListKey: "",
  currentTodoListOwner: "",
  todoLists: {},
};

const restoreTodoListsReducer = (
  state: TodoListState,
  action: PayloadAction<TodoLists>
) => {
  state.todoLists = action.payload.todoLists;
};

const addTodoListReducer = (
  state: TodoListState,
  action: PayloadAction<TodoListMetadata>
) => {
  const { owner, todoListKey } = action.payload;
  if (owner !== "" && todoListKey !== "") {
    if (state.todoLists[owner] === undefined) {
      state.todoLists[owner] = {};
    }

    state.todoLists[owner][todoListKey] = {
      metadata: { owner, todoListKey },
      todoItems: [],
    } as TodoList;
    state.currentTodoListKey = todoListKey;
    state.currentTodoListOwner = owner;
  }
};

const switchTodoListReducer = (
  state: TodoListState,
  action: PayloadAction<{
    targetTodoListKey: TodoListKey;
    owner: TodoListMetadata["owner"];
  }>
) => {
  const { targetTodoListKey, owner } = action.payload;
  if (state.currentTodoListKey !== targetTodoListKey) {
    state.currentTodoListKey = targetTodoListKey;
    state.currentTodoListOwner = owner;
  }
};

const addTodoItemToCurrentListReducer = (
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
};

const toggleItemStateReducer = (
  state: TodoListState,
  action: PayloadAction<{ itemId: TodoItem["id"] }>
) => {
  const todoItems =
    state.todoLists?.[state.currentTodoListOwner]?.[state.currentTodoListKey]
      ?.todoItems;
  const modifiedTodoItem = todoItems.filter(
    (item) => item.id === action.payload.itemId
  )[0];
  if (modifiedTodoItem) {
    modifiedTodoItem.isDone = !modifiedTodoItem.isDone;
  }
};

export const todoListSlice = createSlice({
  name: "todoList",
  initialState,
  reducers: {
    restoreTodoLists: restoreTodoListsReducer,
    addTodoList: addTodoListReducer,
    switchTodoList: switchTodoListReducer,
    addTodoItemToCurrentList: addTodoItemToCurrentListReducer,
    toggleItemState: toggleItemStateReducer,
  },
});

export default todoListSlice.reducer;

export const {
  restoreTodoLists,
  addTodoList,
  addTodoItemToCurrentList,
  toggleItemState,
  switchTodoList,
} = todoListSlice.actions;

export const addTodoListToServer =
  ({ userEmail }: UserAccount): AppThunk =>
  async (dispatch) => {
    const owner = userEmail;
    if (owner !== "") {
      const todoListKey = await new Promise<TodoListKey>((resolve) => {
        socket.emit("addTodoList", owner, (res) => {
          resolve(res);
        });
      });

      console.log("todoListKey", todoListKey);
      if (todoListKey) {
        dispatch(addTodoList({ owner, todoListKey }));
      }
    }
  };

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
