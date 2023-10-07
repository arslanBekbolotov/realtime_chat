import { Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Chat from "./chat/Chat.tsx";
import Login from "./user/Login.tsx";
import Register from "./user/Register.tsx";
import { useEffect, useRef, useState } from "react";
import { IError, IMember, IMessage, IncomingMessage } from "./types";

function App() {
  const ws = useRef<WebSocket | null>(null);
  const [error, setError] = useState<IError | null>(null);
  const navigate = useNavigate();
  const [members, setMembers] = useState<IMember[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/chat");
    ws.current.onclose = () => console.log("ws closed");

    ws.current.onmessage = (event) => {
      const decodedMessage = JSON.parse(event.data) as IncomingMessage;

      switch (decodedMessage.type) {
        case "ALL_MEMBERS":
          setMembers((prevState) => [
            ...prevState,
            ...(decodedMessage.payload as IMember[]),
          ]);
          break;

        case "NEW_MESSAGE":
          setMessages((prevState) => [
            ...prevState,
            decodedMessage.payload as IMessage,
          ]);
          break;

        case "PREVIOUS_MESSAGES":
          setMessages(decodedMessage.payload as IMessage[]);
          break;

        case "NEW_ERROR":
          setError(decodedMessage.payload as IError);
          break;

        case "NEW_USER":
          localStorage.setItem("user", JSON.stringify(decodedMessage.payload));
          navigate("/");
          break;

        default:
          console.error("Unknown message type:", decodedMessage.type);
          break;
      }
    };
  }, [navigate]);

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            <Chat ws={ws} error={error} members={members} messages={messages} />
          }
        />
        <Route path="/login" element={<Login ws={ws} />} />
        <Route path="/register" element={<Register ws={ws} />} />
      </Routes>
    </Layout>
  );
}

export default App;
