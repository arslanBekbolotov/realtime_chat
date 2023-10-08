import { useAppSelector } from "../app/hooks.ts";
import { selectUser } from "../features/user/userSlice.ts";

const Header = () => {
  const user = useAppSelector(selectUser);

  return (
    <div style={{ backgroundColor: "#242F3E" }}>
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3
          style={{
            fontWeight: "bold",
            fontSize: "30px",
            margin: "10px 0",
          }}
        >
          Chat
        </h3>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              fontSize: "18px",
              borderRight: "2px solid #ccc",
              paddingRight: "5px",
            }}
          >
            Welcome <strong>{user?.displayName}</strong>
          </span>
          <button className="logout_link">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
