import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "@shared/store";
import {
  UserAccount,
  UserEmail,
} from "@userAuthentication/userAuthenticationSlice";
import { socket } from "@socket/socket-client";

export type TodoListKey = string;

export type TodoListMetadata = {
  owner: UserEmail;
  todoListKey: TodoListKey;
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
  currentTodoListKey: TodoListKey;
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

export const newTodoListTo =
  ({ owner, todoListKey }: TodoListMetadata) =>
  (state: TodoLists) => {
    if (owner !== "" && todoListKey !== "") {
      if (state.todoLists[owner] === undefined) {
        state.todoLists[owner] = {};
      }

      state.todoLists[owner][todoListKey] = {
        metadata: { owner, todoListKey },
        todoItems: [],
      } as TodoList;
    }
  };

const newTodoListReducer = (
  state: TodoListState,
  action: PayloadAction<TodoListMetadata>
) => {
  const { owner, todoListKey } = action.payload;
  newTodoListTo({ owner, todoListKey })(state);
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

export type NewTodoItemTarget = {
  targetOwner: UserEmail;
  targetListKey: TodoListKey;
};

export type NewTodoItemInput = Omit<TodoItem, "isDone"> & NewTodoItemTarget;

export const newTodoItemTo =
  ({
    creator,
    description,
    id,
    targetListKey,
    targetOwner,
  }: NewTodoItemInput) =>
  (state: TodoLists) => {
    const targetTodoList = state.todoLists?.[targetOwner]?.[targetListKey];

    if (targetTodoList?.todoItems) {
      targetTodoList.todoItems.push({
        creator,
        description,
        id,
        isDone: false,
      });
    }
  };

const newTodoItemReducer = (
  state: TodoListState,
  action: PayloadAction<NewTodoItemInput>
) => {
  const { creator, description, id, targetListKey, targetOwner } =
    action.payload;

  newTodoItemTo({ creator, description, id, targetListKey, targetOwner })(
    state
  );
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

export const updateTodoItemTo =
  ({ targetOwner, targetTodoListKey, updateTodoItem }: UpdateTodoItemInput) =>
  (state: TodoLists) => {
    const targetTodoList = state.todoLists?.[targetOwner]?.[targetTodoListKey];
    if (targetTodoList) {
      targetTodoList.todoItems = targetTodoList.todoItems.map((item) =>
        item.id === updateTodoItem.id ? updateTodoItem : item
      );
    }
  };

const updateTodoItemReducer = (
  state: TodoListState,
  action: PayloadAction<UpdateTodoItemInput>
) => {
  updateTodoItemTo(action.payload)(state);
};

export const todoListSlice = createSlice({
  name: "todoList",
  initialState,
  reducers: {
    restoreTodoLists: restoreTodoListsReducer,
    newTodoList: newTodoListReducer,
    switchTodoList: switchTodoListReducer,
    newTodoItem: newTodoItemReducer,
    toggleItemState: toggleItemStateReducer,
    updateTodoItem: updateTodoItemReducer,
  },
});

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

export const selectCurrentListTodoItemById = (todoItemId: TodoItem["id"]) =>
  createSelector(selectCurrentTodoList, (currentTodoList) => {
    const searchResult = currentTodoList.todoItems.filter(
      (item) => item.id === todoItemId
    );
    if (searchResult.length !== 0) return searchResult[0];
    return;
  });

export const {
  restoreTodoLists,
  newTodoList,
  newTodoItem,
  toggleItemState,
  switchTodoList,
  updateTodoItem,
} = todoListSlice.actions;

export const addTodoList =
  ({ owner, todoListKey }: TodoListMetadata): AppThunk =>
  async (dispatch, getState) => {
    if (owner === "" || todoListKey === "") return;

    const user = getState().userAuthentication.userEmail;
    dispatch(newTodoList({ owner, todoListKey }));

    if (user === owner) {
      dispatch(switchTodoList({ targetTodoListKey: todoListKey, owner }));
    }
  };

export const addTodoListToServer =
  ({ userEmail }: UserAccount): AppThunk =>
  async () => {
    const owner = userEmail;
    if (owner !== "") {
      socket.emit("addTodoList", owner);
    }
  };

export type TodoItemFormInputs = {
  description: string;
};

export const addTodoItemToServer =
  ({
    description,
    targetListKey,
    targetOwner,
  }: TodoItemFormInputs & NewTodoItemTarget): AppThunk =>
  async (dispatch, getState) => {
    const rootState = getState();
    const creator = rootState.userAuthentication.userEmail;
    socket.emit("addTodoItem", {
      creator,
      description,
      targetListKey,
      targetOwner,
    });
  };

export type UpdateTodoItemInput = {
  targetOwner: UserEmail;
  targetTodoListKey: TodoListKey;
  updateTodoItem: TodoItem;
};

export const updateTodoItemToServer =
  (todoItemId: TodoItem["id"]): AppThunk =>
  async (dispatch, getState) => {
    const rootState = getState();
    const targetTodoListKey = rootState.todoList.currentTodoListKey;
    const targetOwner = rootState.todoList.currentTodoListOwner;
    const updateTodoItem = selectCurrentListTodoItemById(todoItemId)(rootState);

    if (updateTodoItem)
      socket.emit("updateTodoItem", {
        targetTodoListKey,
        targetOwner,
        updateTodoItem,
      });
  };
