import {
  configureStore,
  combineReducers,
  ThunkAction,
  Action,
} from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import userAuthentication from "@userAuthentication/userAuthenticationSlice";
import todoList from "@todoLists/todoListSlice";

const combinedReducer = combineReducers({
  userAuthentication,
  todoList,
});

const store = configureStore({
  reducer: combinedReducer,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
