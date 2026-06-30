import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

function DashboardLayout() {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-area">
        <Header />
        <main className="page-content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default DashboardLayout;