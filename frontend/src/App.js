import React, { useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Landing from "./pages/Landing";
import Home from "./pages/Home";
import DiseaseDetection from "./pages/DiseaseDetection";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

function App() {
  const [activePage, setActivePage] = useState("landing");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case "landing":
        return <Landing setActivePage={setActivePage} />;
      case "home":
        return <Home />;
      case "history":
        return <History />;
      case "profile":
        return <Profile />;
      case "settings":
        return <Settings />;
      case "disease":
      default:
        return <DiseaseDetection />;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <div className={`main-area ${sidebarCollapsed ? "main-area-expanded" : ""}`}>
        {activePage !== "landing" && (
          <Header setActivePage={setActivePage} />
        )}

        <main className="page-content">{renderPage()}</main>

        <Footer />
      </div>
    </div>
  );
}

export default App;