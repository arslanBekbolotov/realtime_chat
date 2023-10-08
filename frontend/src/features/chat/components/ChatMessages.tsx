import { useAppSelector } from "../../../app/hooks.ts";
import { selectMessages } from "../chatSlice.ts";
import { useEffect, useRef } from "react";
import MessagesItem from "./MessagesItem.tsx";

const ChatMessages = () => {
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
        <MessagesItem key={Math.random()} message={item} />
      ))}
      {/*<span*/}
      {/*  style={{*/}
      {/*    position: "absolute",*/}
      {/*    bottom: "60px",*/}
      {/*    right: "10px",*/}
      {/*    padding: "10px 18px 10px",*/}
      {/*    fontSize: "25px",*/}
      {/*    borderRadius: "50%",*/}
      {/*    backgroundColor: "#17212b",*/}
      {/*  }}*/}
      {/*>*/}
      {/*  ᨆ*/}
      {/*</span>*/}
      <div ref={messageRef}></div>
    </div>
  );
};

export default ChatMessages;
