import React, { MutableRefObject, useState } from "react";
import { Link } from "react-router-dom";
import { ILoginResponse } from "../types";
import Logo from "../assets/logo.png";
import "./user.css";

interface Props {
  ws: MutableRefObject<WebSocket | null>;
}

const Login: React.FC<Props> = ({ ws }) => {
  const [state, setState] = useState<ILoginResponse>({
    username: "",
    password: "",
  });

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    ws.current?.send(
      JSON.stringify({
        type: "LOGIN",
        payload: state,
      }),
    );
  };

  return (
    <div>
      <div className="auth_container">
        <img width="160px" height="160" src={Logo} alt="logo" />
        <h4 className="auth_title">Login</h4>
        <form onSubmit={onSubmit} className="auth_form">
          <input
            className="auth_input"
            value={state.username}
            name={"username"}
            onChange={onChangeInput}
            type="text"
            placeholder="Username"
          />
          <input
            className="auth_input"
            value={state.password}
            name={"password"}
            onChange={onChangeInput}
            type="password"
            placeholder="Password"
          />
          <button type="submit" className="auth_btn">
            Signup
          </button>
        </form>
        <div>
          <Link to={"/register"} className="auth_link">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
