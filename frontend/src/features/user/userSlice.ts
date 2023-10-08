import { createSlice } from "@reduxjs/toolkit";
import { IError, IUser, ValidationError } from "../../types";
import { RootState } from "../../app/store.ts";

interface usersState {
  user: IUser | null;
  ws: WebSocket | null;
  userError: IError | ValidationError | null;
}

const initialState: usersState = {
  user: null,
  ws: null,
  userError: null,
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUserError(state, { payload: error }) {
      state.userError = error;
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
export const { setUserError, setUser, unSetUser } = usersSlice.actions;
export const selectUser = (state: RootState) => state.usersStore.user;
