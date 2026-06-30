import React, { useState } from "react";

import AppLayout from "./components/Layout/AppLayout";
import Landing from "./pages/Landing/Landing";
import Dashboard from "./pages/Dashboard/Dashboard";
import DiseaseDetection from "./pages/Disease/Disease";
import History from "./pages/History/History";

function App() {
  const [activePage, setActivePage] = useState("landing");

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <Dashboard setActivePage={setActivePage} />;
      case "disease":
        return <DiseaseDetection />;
      case "history":
        return <History />;
      case "profile":
        return <Page title="User Profile" />;
      case "settings":
        return <Page title="Settings" />;
      case "notifications":
        return <Page title="Notifications" />;
      case "landing":
      default:
        return <Landing setActivePage={setActivePage} />;
    }
  };

  if (activePage === "landing") {
    return <Landing setActivePage={setActivePage} />;
  }

  return (
    <AppLayout activePage={activePage} setActivePage={setActivePage}>
      {renderPage()}
    </AppLayout>
  );
}

function Page({ title }) {
  return (
    <div className="placeholder-page">
      <h1>{title}</h1>
      <p>This page route is working.</p>
    </div>
  );
}

export default App;