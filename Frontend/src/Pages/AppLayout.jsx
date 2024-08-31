import React from "react";
import Header from "../Components/Header";
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <section>
      <Header />
      <div className="content min-h-screen pt-10">
        <Outlet />
      </div>
    </section>
  );
}

export default AppLayout;
