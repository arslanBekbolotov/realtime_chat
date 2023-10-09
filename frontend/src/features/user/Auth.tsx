import Logo from "../../assets/logo.png";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IncomingMessage, IRegisterResponse } from "../../types";
import { setLoginError, setRegisterError, setUser } from "./userSlice.ts";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import "./user.css";

const initialState = {
  username: "",
  displayName: "",
  password: "",
};

const Auth = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const ws = useRef<WebSocket | null>(null);
  const [state, setState] = useState<IRegisterResponse>(initialState);
  const { registerError, loginError } = useAppSelector(
    (state) => state.usersStore,
  );
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const connect = useCallback(() => {
    ws.current = new WebSocket("ws://localhost:8000/chat");

    ws.current.onclose = function (e) {
      console.log(
        "Socket is closed. Reconnect will be attempted in 1 second.",
        e.reason,
      );
      setTimeout(function () {
        connect();
      }, 3000);
    };

    ws.current.onmessage = (event) => {
      const decodedMessage = JSON.parse(event.data) as IncomingMessage;

      switch (decodedMessage.type) {
        case "NEW_LOGIN_ERROR":
          dispatch(setLoginError(decodedMessage.payload));
          break;

        case "NEW_REGISTER_ERROR":
          dispatch(setRegisterError(decodedMessage.payload));
          break;

        case "NEW_USER":
          dispatch(setUser(decodedMessage.payload));
          navigate("/");
          break;

        default:
          console.log("Unknown message type:", decodedMessage.type);
          break;
      }
    };
  }, [dispatch, navigate]);

  useEffect(() => {
    connect();
  }, [connect]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    ws.current?.send(
      JSON.stringify({
        type: pathname === "/register" ? "REGISTER" : "LOGIN",
        payload: state,
      }),
    );
  };

  const handleNavigate = () => {
    setState(initialState);
    dispatch(setLoginError(null));
    dispatch(setRegisterError(null));
  };

  const getFieldError = (name: string) => {
    try {
      return registerError?.errors[name].message;
    } catch {
      return undefined;
    }
  };

  return (
    <div>
      <div className="auth_container">
        <img width="160px" height="160" src={Logo} alt="logo" />
        <h4 className="auth_title">
          {pathname === "/register" ? "Register" : "Login"}
        </h4>
        <form onSubmit={onSubmit} className="auth_form">
          {pathname !== "/register" && loginError && (
            <div
              style={{
                border: "1px solid red",
                padding: "10px",
                color: "red",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            >
              {loginError.error}
            </div>
          )}
          <input
            className="auth_input"
            value={state.username}
            name={"username"}
            onChange={onChange}
            type="text"
            placeholder="Username"
          />
          {pathname === "/register" && (
            <span className="input_helper">{getFieldError("username")}</span>
          )}
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
          {pathname === "/register" && (
            <span className="input_helper">{getFieldError("displayName")}</span>
          )}
          <input
            className="auth_input"
            value={state.password}
            name={"password"}
            onChange={onChange}
            type="password"
            placeholder="Password"
          />
          {pathname === "/register" && (
            <span className="input_helper">{getFieldError("password")}</span>
          )}
          <button type="submit" className="auth_btn">
            {pathname === "/register" ? "Signup" : "Login"}
          </button>
        </form>
        <div>
          {pathname === "/register" ? (
            <Link onClick={handleNavigate} to={"/login"} className="auth_link">
              Already have an account? Login
            </Link>
          ) : (
            <Link
              onClick={handleNavigate}
              to={"/register"}
              className="auth_link"
            >
              Or sign up
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
