import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserAuthenticationState {
  isAuthenticated: boolean;
  userEmail: string;
}

const initialState: UserAuthenticationState = {
  isAuthenticated: false,
  userEmail: "",
};

type UserAccount = {
  userEmail: string;
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
