import React from "react";
import { IMember } from "../../types";

interface Props {
  members: IMember[];
}

const ChatMembers: React.FC<Props> = ({ members }) => {
  return (
    <div>
      <h3>Chat members:</h3>
      <ul style={{ listStyleType: "none" }}>
        {members.map((item) => (
          <li key={item._id}>{item.displayName}</li>
        ))}
      </ul>
    </div>
  );
};

export default ChatMembers;
