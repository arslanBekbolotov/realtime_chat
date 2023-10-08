import { createSlice } from "@reduxjs/toolkit";
import { IError, IMember, IMessage, ValidationError } from "../../types";
import { RootState } from "../../app/store.ts";

interface chatsState {
  members: IMember[];
  messages: IMessage[];
  chatError: IError | ValidationError | null;
  ref: HTMLDivElement | null;
}

const initialState: chatsState = {
  members: [],
  messages: [],
  chatError: null,
  ref: null,
};

export const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setMessage(state, { payload: message }) {
      state.messages = [...state.messages, message];
    },
    setPreviousMessages(state, { payload: messages }) {
      state.messages = messages;
    },
    setAllMembers(state, { payload: members }) {
      state.members = members;
    },
    setChatError(state, { payload: error }) {
      state.chatError = error;
    },
    setMessagesRef(state, { payload: ref }) {
      state.ref = ref;
    },
  },
});

export const chatsReducer = chatsSlice.reducer;

export const {
  setMessage,
  setPreviousMessages,
  setAllMembers,
  setChatError,
  setMessagesRef,
} = chatsSlice.actions;
export const selectMembers = (state: RootState) => state.chatStore.members;
export const selectMessages = (state: RootState) => state.chatStore.messages;
