import { createSlice } from "@reduxjs/toolkit";
import { IError, IUser, ValidationError } from "../../types";
import { RootState } from "../../app/store.ts";

interface usersState {
  user: IUser | null;
  ws: WebSocket | null;
  registerError: ValidationError | null;
  loginError: IError | null;
}

const initialState: usersState = {
  user: null,
  ws: null,
  registerError: null,
  loginError: null,
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setLoginError(state, { payload: error }) {
      state.loginError = error;
    },
    setRegisterError(state, { payload: registerError }) {
      state.registerError = registerError.error;
    },
    setUser(state, { payload: user }) {
      state.user = user;
    },
    unSetUser(state) {
      state.user = null;
    },
  },
});

export const usersReducer = usersSlice.reducer;
export const { setLoginError, setRegisterError, setUser, unSetUser } =
  usersSlice.actions;
export const selectUser = (state: RootState) => state.usersStore.user;
