import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../../app/hooks.ts";
import { selectUser } from "../../user/userSlice.ts";

interface Props {
  ws: MutableRefObject<WebSocket | null>;
}
const ChatForm: React.FC<Props> = ({ ws }) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const user = useAppSelector(selectUser);
  // const selectedChatUser = useAppSelector(selectOtherUser);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (ws && user) {
      setMessage("");

      ws.current?.send(
        JSON.stringify({
          type: "SEND_MESSAGE",
          payload: {
            message,
            token: user.token,
          },
        }),
      );
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <form
      onSubmit={sendMessage}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#17212b",
        padding: "10px 0 10px 15px",
      }}
    >
      <input
        required
        ref={inputRef}
        style={{
          color: "#fff",
          backgroundColor: "transparent",
          width: "100%",
          border: "none",
          padding: "5px 20px",
          fontSize: "18px",
        }}
        type="text"
        onChange={onChange}
        value={message}
      />
      <button
        className="form-btn"
        style={{
          backgroundColor: "transparent",
          border: "none",
          borderLeft: "1px solid #242F3E",
          padding: "5px 20px",
          fontSize: "18px",
          color: "#fff",
          cursor: "pointer",
        }}
        type="submit"
      >
        send
      </button>
    </form>
  );
};

export default ChatForm;
