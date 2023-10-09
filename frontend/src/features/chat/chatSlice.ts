import { createSlice } from "@reduxjs/toolkit";
import { IMember, IMessage } from "../../types";
import { RootState } from "../../app/store.ts";

interface chatsState {
  members: IMember[];
  messages: IMessage[];
  ref: HTMLDivElement | null;
  otherUser: IMember | null;
}

const initialState: chatsState = {
  members: [],
  messages: [],
  ref: null,
  otherUser: null,
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
    setOtherUser(state, { payload: otherUser }) {
      state.otherUser = otherUser;
    },
  },
});

export const chatsReducer = chatsSlice.reducer;

export const { setMessage, setPreviousMessages, setAllMembers, setOtherUser } =
  chatsSlice.actions;
export const selectMembers = (state: RootState) => state.chatStore.members;
export const selectOtherUser = (state: RootState) => state.chatStore.otherUser;
export const selectMessages = (state: RootState) => state.chatStore.messages;
