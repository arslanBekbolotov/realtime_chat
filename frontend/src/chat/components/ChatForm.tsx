import React, { useState } from "react";
interface Props {
  ws: WebSocket | null;
  user: string | null;
}

const ChatForm: React.FC<Props> = ({ ws, user }) => {
  const [message, setMessage] = useState("");

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (ws && user) {
      ws.send(
        JSON.stringify({
          type: "SEND_MESSAGE",
          payload: {
            message,
            token: JSON.parse(user).token,
          },
        }),
      );
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <form onSubmit={sendMessage}>
      <input type="text" onChange={onChange} value={message} />
      <button type="submit">send</button>
    </form>
  );
};

export default ChatForm;
