import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "@shared/store";
import { restoreTodoLists } from "@todoLists/todoListSlice";
import { socket } from "src/pages/_app";

export interface UserAuthenticationState {
  isAuthenticated: boolean;
  userEmail: string;
}

const initialState: UserAuthenticationState = {
  isAuthenticated: false,
  userEmail: "",
};

export type UserEmail = string;

export type UserAccount = {
  userEmail: UserEmail;
};

export const userAuthenticationSlice = createSlice({
  name: "userAuthentication",
  initialState,
  reducers: {
    signIn: (
      state: UserAuthenticationState,
      action: PayloadAction<UserAccount>
    ) => {
      if (action.payload.userEmail !== "" && !state.isAuthenticated) {
        state.userEmail = action.payload.userEmail;
        state.isAuthenticated = true;
      }
    },
    signOut: (state: UserAuthenticationState) => {
      state.isAuthenticated = false;
      state.userEmail = "";
    },
  },
});

export const signInServer =
  ({ userEmail }: UserAccount): AppThunk =>
  async (dispatch, getState) => {
    const rootState = getState();
    if (!rootState.userAuthentication.isAuthenticated) {
      socket.emit("signIn", userEmail, (todoLists) => {
        dispatch(restoreTodoLists(todoLists));
        dispatch(signIn({ userEmail }));
      });
    }
  };

export const { signIn, signOut } = userAuthenticationSlice.actions;

export default userAuthenticationSlice.reducer;

export const selectUserEmail = (state: RootState) =>
  state.userAuthentication.userEmail;
