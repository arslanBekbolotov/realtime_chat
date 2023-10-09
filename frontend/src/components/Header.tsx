import { useAppDispatch, useAppSelector } from "../app/hooks.ts";
import { selectUser, unSetUser } from "../features/user/userSlice.ts";
import { IncomingMessage } from "../types";
import { useCallback, useEffect, useRef } from "react";

const Header = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const ws = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    ws.current = new WebSocket("ws://localhost:8000/chat");

    ws.current.onclose = function (e) {
      console.log(
        "Socket is closed. Reconnect will be attempted in 3 second.",
        e.reason,
      );
      setTimeout(function () {
        connect();
      }, 3000);
    };

    ws.current.onmessage = (event) => {
      const decodedMessage = JSON.parse(event.data) as IncomingMessage;

      switch (decodedMessage.type) {
        case "USER_DELETED":
          dispatch(unSetUser());
          break;
        case "USER_NOT_DELETED":
          alert("something went wrong");
          break;

        default:
          console.log("Unknown message type:", decodedMessage.type);
          break;
      }
    };
  }, [dispatch]);

  useEffect(() => {
    connect();
  }, [connect]);

  const handleLogout = () => {
    ws.current?.send(
      JSON.stringify({
        type: "LOGOUT",
        payload: {
          token: user?.token,
        },
      }),
    );
  };

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
          <button onClick={handleLogout} className="logout_link">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
export default Header;
