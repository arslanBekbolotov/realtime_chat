import React, { PropsWithChildren } from "react";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <header></header>
      <main style={{ maxWidth: "1300px", margin: "0 auto" }}>{children}</main>
    </div>
  );
};

export default Layout;
