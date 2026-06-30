import React, { useState } from "react";
import { Bell, ChevronDown, Search, Settings } from "lucide-react";

function Header({ setActivePage }) {
  const [searchText, setSearchText] = useState("");

  const pages = [
    { keyword: "dashboard", page: "home" },
    { keyword: "home", page: "home" },
    { keyword: "disease", page: "disease" },
    { keyword: "detect", page: "disease" },
    { keyword: "scan", page: "disease" },
    { keyword: "history", page: "history" },
    { keyword: "prediction", page: "history" },
    { keyword: "profile", page: "profile" },
    { keyword: "user", page: "profile" },
    { keyword: "settings", page: "settings" },
    { keyword: "notification", page: "notifications" },
    { keyword: "alerts", page: "notifications" },
  ];

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const query = searchText.trim().toLowerCase();

    if (!query) return;

    const match = pages.find((item) => query.includes(item.keyword));

    if (match) {
      setActivePage(match.page);
      setSearchText("");
    } else {
      alert("No matching page found.");
    }
  };

  return (
    <header className="app-header premium-header">
      <form className="header-search" onSubmit={handleSearchSubmit}>
        <Search size={18} />
        <input
          type="text"
          placeholder="Search dashboard, disease, history..."
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
      </form>

      <div className="header-right">
        <button
          className="header-icon-btn"
          onClick={() => setActivePage("notifications")}
          title="Notifications"
        >
          <Bell size={19} />
          <span className="notification-badge">3</span>
        </button>

        <button
          className="header-icon-btn"
          onClick={() => setActivePage("settings")}
          title="Settings"
        >
          <Settings size={19} />
        </button>

        <button
          className="header-profile-btn"
          onClick={() => setActivePage("profile")}
        >
          <div className="header-avatar">RK</div>

          <div className="header-user-text">
            <strong>Rajesh Kumar</strong>
            <span>Farmer / AgriAI User</span>
          </div>

          <ChevronDown size={16} />
        </button>
      </div>
    </header>
  );
}

export default Header;