import React, { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DiseaseDetection from "./pages/DiseaseDetection";
import History from "./pages/History";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";

function App() {
  const [activePage, setActivePage] = useState("landing");

  const renderPage = () => {
  if (activePage === "landing") return <Landing setActivePage={setActivePage} />;
  if (activePage === "home") return <Home />;
  if (activePage === "profile") return <Profile />;
  if (activePage === "settings") return <Settings />;
  if (activePage === "history") return <History />;
  return <DiseaseDetection />;
};

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <div className="main-area">
        {activePage !== "landing" && <Header setActivePage={setActivePage} />}
        <main className="page-content">{renderPage()}</main>
        <Footer />
      </div>
    </div>
  );
}

export default App;