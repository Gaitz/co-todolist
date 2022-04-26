import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import userAuthentication from "@userAuthentication/userAuthenticationSlice";

const combinedReducer = combineReducers({
  userAuthentication,
});

const store = configureStore({
  reducer: combinedReducer,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
