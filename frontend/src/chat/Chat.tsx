import React, { MutableRefObject, useEffect } from "react";
import { IError, IMember, IMessage } from "../types";
import ChatMembers from "./components/ChatMembers.tsx";
import ChatMessages from "./components/ChatMessages.tsx";
import ChatForm from "./components/ChatForm.tsx";
import { useNavigate } from "react-router-dom";

interface Props {
  ws: MutableRefObject<WebSocket | null>;
  error: IError | null;
  messages: IMessage[];
  members: IMember[];
}

const Chat: React.FC<Props> = ({ ws, messages, members }) => {
  const user = localStorage.getItem("user");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }

    if (ws.current)
      ws.current.onopen = () => {
        ws.current?.send(
          JSON.stringify({
            type: "GET_ALL_MEMBERS",
            payload: {
              token: user && JSON.parse(user).token,
            },
          }),
        );

        ws.current?.send(
          JSON.stringify({
            type: "PREVIOUS_MESSAGES",
            payload: {
              token: user && JSON.parse(user).token,
            },
          }),
        );
      };
  }, [navigate, user, ws]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr" }}>
      <div>
        <ChatMembers members={members} />
      </div>
      <div>
        <ChatMessages messages={messages} />
        <ChatForm ws={ws.current} user={user} />
        <div></div>
      </div>
    </div>
  );
};

export default Chat;
