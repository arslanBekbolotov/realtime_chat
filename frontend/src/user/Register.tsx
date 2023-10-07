import Logo from "../assets/logo.png";
import React, { MutableRefObject, useState } from "react";
import { Link } from "react-router-dom";
import { IRegisterResponse } from "../types";
import "./user.css";

interface Props {
  ws: MutableRefObject<WebSocket | null>;
}

const Register: React.FC<Props> = ({ ws }) => {
  const [state, setState] = useState<IRegisterResponse>({
    username: "",
    displayName: "",
    password: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    ws.current?.send(
      JSON.stringify({
        type: "REGISTER",
        payload: state,
      }),
    );
  };

  return (
    <div>
      <div className="auth_container">
        <img width="160px" height="160" src={Logo} alt="logo" />
        <h4 className="auth_title">Register</h4>
        <form onSubmit={onSubmit} className="auth_form">
          <input
            className="auth_input"
            value={state.username}
            name={"username"}
            onChange={onChange}
            type="text"
            placeholder="Username"
          />
          <input
            className="auth_input"
            value={state.displayName}
            name={"displayName"}
            onChange={onChange}
            type="text"
            placeholder="Display Name"
          />
          <input
            className="auth_input"
            value={state.password}
            name={"password"}
            onChange={onChange}
            type="password"
            placeholder="Password"
          />
          <button type="submit" className="auth_btn">
            Signup
          </button>
        </form>
        <div>
          <Link to={"/login"} className="auth_link">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
