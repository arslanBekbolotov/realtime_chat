import { useEffect, useRef } from "react";
import ChatMembers from "./components/ChatMembers.tsx";
import ChatMessages from "./components/ChatMessages.tsx";
import ChatForm from "./components/ChatForm.tsx";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { selectUser } from "../user/userSlice.ts";
import { IncomingMessage } from "../../types";
import {
  setAllMembers,
  setChatError,
  setMessage,
  setPreviousMessages,
} from "./chatSlice.ts";

const Chat = () => {
  const ws = useRef<WebSocket | null>(null);
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }

    ws.current = new WebSocket("ws://localhost:8000/chat");

    ws.current.onclose = () => {
      console.log("ws closed");
    };

    ws.current.onopen = () => {
      ws.current?.send(
        JSON.stringify({
          type: "GET_ALL_MEMBERS",
          payload: {
            token: user?.token,
          },
        }),
      );

      ws.current?.send(
        JSON.stringify({
          type: "PREVIOUS_MESSAGES",
          payload: {
            token: user?.token,
          },
        }),
      );
    };

    ws.current.onmessage = (event) => {
      const decodedMessage = JSON.parse(event.data) as IncomingMessage;

      switch (decodedMessage.type) {
        case "ALL_MEMBERS":
          dispatch(setAllMembers(decodedMessage.payload));
          break;

        case "NEW_MESSAGE":
          dispatch(setMessage(decodedMessage.payload));
          break;

        case "PREVIOUS_MESSAGES":
          dispatch(setPreviousMessages(decodedMessage.payload));
          break;

        case "CHAT_NEW_ERROR":
          dispatch(setChatError(decodedMessage.payload));
          break;

        default:
          console.error("Unknown message type:", decodedMessage.type);
          break;
      }
    };
  }, [dispatch, navigate, user]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "27% 1fr" }}>
      <div style={{ backgroundColor: "#17212B", border: "1px solid #242F3E" }}>
        <ChatMembers />
      </div>
      <div>
        <ChatMessages />
        <ChatForm ws={ws} />
      </div>
    </div>
  );
};

export default Chat;
