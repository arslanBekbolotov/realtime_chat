import React, { PropsWithChildren } from "react";
import Header from "./Header.tsx";
import { useLocation } from "react-router-dom";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <div>
      <header>{pathname === "/" && <Header />}</header>
      <main style={{ maxWidth: "1300px", margin: "0 auto" }}>{children}</main>
    </div>
  );
};

export default Layout;
