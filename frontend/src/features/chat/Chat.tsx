import { useCallback, useEffect, useRef } from "react";
import ChatMembers from "./components/ChatMembers.tsx";
import ChatMessages from "./components/ChatMessages.tsx";
import ChatForm from "./components/ChatForm.tsx";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { selectUser } from "../user/userSlice.ts";
import { IncomingMessage } from "../../types";
import { setAllMembers, setMessage, setPreviousMessages } from "./chatSlice.ts";

const Chat = () => {
  const ws = useRef<WebSocket | null>(null);
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const connect = useCallback(() => {
    ws.current = new WebSocket("ws://localhost:8000/chat");

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
          type: "GET_PREVIOUS_MESSAGES",
          payload: {
            token: user?.token,
          },
        }),
      );
    };

    ws.current.onclose = function (e) {
      console.log(
        "Socket is closed. Reconnect will be attempted in 1 second.",
        e.reason,
      );
      setTimeout(function () {
        connect();
      }, 3000);
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
          console.log(decodedMessage.payload);
          break;

        case "MESSAGE_DELETED":
          ws.current?.send(
            JSON.stringify({
              type: "GET_PREVIOUS_MESSAGES",
              payload: {
                token: user?.token,
              },
            }),
          );
          break;

        case "UPDATE_PREVIOUS_MESSAGE":
          JSON.stringify({
            type: "GET_PREVIOUS_MESSAGES",
            payload: {
              token: user?.token,
            },
          });

          break;

        default:
          console.log("Unknown message type:", decodedMessage.type);
          break;
      }
    };
  }, [dispatch, user?.token]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    connect();
  }, [connect, navigate, user]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "27% 1fr" }}>
      <div style={{ backgroundColor: "#17212B", border: "1px solid #242F3E" }}>
        <ChatMembers />
      </div>
      <div>
        <ChatMessages ws={ws} />
        <ChatForm ws={ws} />
      </div>
    </div>
  );
};

export default Chat;
