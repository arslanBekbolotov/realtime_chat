import { useAppSelector } from "../../../app/hooks.ts";
import { selectMembers } from "../chatSlice.ts";

const ChatMembers = () => {
  const members = useAppSelector(selectMembers);

  return (
    <ul
      style={{
        listStyleType: "none",
        padding: 0,
        margin: 0,
        overflow: "auto",
        height: "91vh",
      }}
    >
      {members.map((item) => (
        <li
          className="list-item"
          style={{
            padding: "12px 15px",
            cursor: "pointer",
          }}
          key={item._id}
        >
          {item.displayName}
        </li>
      ))}
    </ul>
  );
};

export default ChatMembers;
