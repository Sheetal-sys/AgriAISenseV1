import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Bell, ChevronDown, LogOut, Search } from "lucide-react";

import useAuth from "../../hooks/useAuth";

function Header() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const [searchText, setSearchText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);

  const notificationCount = 0;

  const pages = [
    { keyword: "dashboard", path: "/dashboard" },
    { keyword: "home", path: "/dashboard" },
    { keyword: "disease", path: "/disease" },
    { keyword: "detect", path: "/disease" },
    { keyword: "scan", path: "/disease" },
    { keyword: "history", path: "/history" },
    { keyword: "prediction", path: "/history" },
    { keyword: "profile", path: "/profile" },
    { keyword: "user", path: "/profile" },
    { keyword: "settings", path: "/settings" },
    { keyword: "notification", path: "/notifications" },
    { keyword: "notifications", path: "/notifications" },
    { keyword: "alerts", path: "/notifications" },
  ];

  useEffect(() => {
    const closeMenu = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
    };
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const query = searchText.trim().toLowerCase();

    if (!query) return;

    const match = pages.find((item) => query.includes(item.keyword));

    if (match) {
      navigate(match.path);
      setSearchText("");
    } else {
      toast.error("No matching page found.");
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    setMenuOpen(false);
    navigate("/login");
  };

  const initials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

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
          onClick={() => navigate("/notifications")}
          title="Notifications"
        >
          <Bell size={19} />

          {notificationCount > 0 && (
            <span className="notification-badge">{notificationCount}</span>
          )}
        </button>

        <div className="header-profile-wrapper" ref={menuRef}>
          <button
            className="header-profile-btn"
            type="button"
            onClick={() => setMenuOpen((previous) => !previous)}
          >
            <div className="header-avatar">{initials}</div>

            <div className="header-user-text">
              <strong>{currentUser?.name || "User"}</strong>
              <span>{currentUser?.role || "AgriAI User"}</span>
            </div>

            <ChevronDown size={16} />
          </button>

          {menuOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-user">
                <strong>{currentUser?.name || "User"}</strong>
                <span>{currentUser?.email || "user@agriai.com"}</span>
              </div>

              <button className="logout-menu-btn" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;