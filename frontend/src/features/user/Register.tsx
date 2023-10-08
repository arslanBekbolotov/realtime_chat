import Logo from "../../assets/logo.png";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IncomingMessage, IRegisterResponse } from "../../types";
import { setUser, setUserError } from "./userSlice.ts";
import { useAppDispatch } from "../../app/hooks.ts";
import "./user.css";

const Register = () => {
  const ws = useRef<WebSocket | null>(null);
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const initialState = {
    username: "",
    displayName: "",
    password: "",
  };
  const [state, setState] = useState<IRegisterResponse>(initialState);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/chat");

    ws.current.onclose = () => {
      console.log("ws closed");
    };

    ws.current.onmessage = (event) => {
      const decodedMessage = JSON.parse(event.data) as IncomingMessage;

      switch (decodedMessage.type) {
        case "USER_NEW_ERROR":
          dispatch(setUserError(decodedMessage.payload));
          break;

        case "NEW_USER":
          dispatch(setUser(decodedMessage.payload));
          navigate("/");
          break;

        default:
          console.error("Unknown message type:", decodedMessage.type);
          break;
      }
    };
  }, [dispatch, navigate]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    ws.current?.send(
      JSON.stringify({
        type: pathname === "/register" ? "REGISTER" : "LOGIN",
        payload: state,
      }),
    );
  };

  return (
    <div>
      <div className="auth_container">
        <img width="160px" height="160" src={Logo} alt="logo" />
        <h4 className="auth_title">
          {pathname === "/register" ? "Register" : "Login"}
        </h4>
        <form onSubmit={onSubmit} className="auth_form">
          <input
            className="auth_input"
            value={state.username}
            name={"username"}
            onChange={onChange}
            type="text"
            placeholder="Username"
          />
          {pathname === "/register" && (
            <input
              className="auth_input"
              value={state.displayName}
              name={"displayName"}
              onChange={onChange}
              type="text"
              placeholder="Display Name"
            />
          )}
          <input
            className="auth_input"
            value={state.password}
            name={"password"}
            onChange={onChange}
            type="password"
            placeholder="Password"
          />
          <button type="submit" className="auth_btn">
            {pathname === "/register" ? "Signup" : "Login"}
          </button>
        </form>
        <div>
          {pathname === "/register" ? (
            <Link
              onClick={() => setState(initialState)}
              to={"/login"}
              className="auth_link"
            >
              Already have an account? Login
            </Link>
          ) : (
            <Link
              onClick={() => setState(initialState)}
              to={"/register"}
              className="auth_link"
            >
              Already have an account? Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
