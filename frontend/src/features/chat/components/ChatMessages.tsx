import { useAppSelector } from "../../../app/hooks.ts";
import { selectMessages } from "../chatSlice.ts";
import React, { MutableRefObject, useEffect, useRef } from "react";
import MessagesItem from "./MessagesItem.tsx";

interface Props {
  ws: MutableRefObject<WebSocket | null>;
}

const ChatMessages: React.FC<Props> = ({ ws }) => {
  const messages = useAppSelector(selectMessages);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div
      style={{
        height: "85vh",
        overflow: "auto",
        marginLeft: "20px",
        paddingBottom: "5px",
        borderRight: "1px solid #242F3E",
      }}
    >
      {messages.map((item) => (
        <MessagesItem key={Math.random()} message={item} ws={ws} />
      ))}
      <div ref={messageRef}></div>
    </div>
  );
};

export default ChatMessages;
