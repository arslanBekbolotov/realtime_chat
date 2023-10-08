import { IMessage } from "../../../types";
import React from "react";
import { useAppSelector } from "../../../app/hooks.ts";
import { selectUser } from "../../user/userSlice.ts";

interface Props {
  message: IMessage;
}

const MessagesItem: React.FC<Props> = ({ message }) => {
  const user = useAppSelector(selectUser);

  return (
    <div
      className="message-message"
      style={{
        display: "flex",
        justifyContent:
          user?._id === message.user._id ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          display: "inline-block",
          backgroundColor:
            user?._id === message.user._id ? "#295179" : "#172534",
          margin: "10px",
          padding: "10px",
          borderRadius: "10px",
          maxWidth: "50%",
          cursor: "pointer",
        }}
      >
        <h6 style={{ margin: 0 }}>{message.user.displayName}</h6>
        <span style={{ padding: "10px 10px" }}>{message.message}</span>
      </div>
    </div>
  );
};

export default MessagesItem;
