import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@shared/store";

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

export const { signIn, signOut } = userAuthenticationSlice.actions;

export default userAuthenticationSlice.reducer;

export const selectUserEmail = (state: RootState) =>
  state.userAuthentication.userEmail;
