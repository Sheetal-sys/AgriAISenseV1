import React from "react";
import {
  Leaf,
  Home,
  Activity,
  Sprout,
  BarChart3,
  Bot,
  Settings,
  History as HistoryIcon
} from "lucide-react";

function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      <div
      className="brand clickable-brand"
      onClick={() => setActivePage("landing")}
>
        <div className="brand-icon">🌿</div>
        <div>
          <h2>AgriAI</h2>
          <p>Farm Intelligence</p>
        </div>
      </div>

      <nav className="nav-section">
        <button className={activePage === "home" ? "nav-item active" : "nav-item"} onClick={() => setActivePage("home")}>
          <Home size={18} /> Dashboard
        </button>

        <button className={activePage === "disease" ? "nav-item active" : "nav-item"} onClick={() => setActivePage("disease")}>
          <Leaf size={18} /> Disease Detection
        </button>

        <button className={activePage === "history" ? "nav-item active" : "nav-item"}
        onClick={() => setActivePage("history")}
>
       <HistoryIcon size={18} /> Prediction History
       </button>

        <button className="nav-item disabled">
          <Sprout size={18} /> Crop Recommendation
        </button>

        <button className="nav-item disabled">
          <BarChart3 size={18} /> Yield Prediction
        </button>

        <button className="nav-item disabled">
          <Activity size={18} /> Weather Risk
        </button>

        <button className="nav-item disabled">
          <Bot size={18} /> Farmer Chatbot
        </button>
      </nav>

      
    </aside>
  );
}

export default Sidebar;