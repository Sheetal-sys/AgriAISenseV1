import React, { useState } from "react";

import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function AppLayout({ activePage, setActivePage, children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <div className="main-area">
        <Header setActivePage={setActivePage} />
        <main className="page-content">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

export default AppLayout;