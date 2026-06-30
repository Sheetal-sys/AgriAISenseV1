import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Leaf,
  History,
  UserCircle,
  Settings,
  Sprout,
  BarChart3,
  CloudSun,
  Bot,
  PanelLeftClose,
  PanelLeftOpen,
  Cloud
} from "lucide-react";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const NavItem = ({ path, icon, label, disabled = false }) => (
    <button
      className={[
        location.pathname === path ? "nav-item active" : "nav-item",
        disabled ? "disabled" : ""
      ].join(" ")}
      onClick={() => !disabled && navigate(path)}
      title={collapsed ? label : ""}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
      {!collapsed && disabled && <small>Soon</small>}
    </button>
  );

  return (
    <aside className={collapsed ? "pro-sidebar collapsed" : "pro-sidebar"}>
      <div className="sidebar-top-row">
        <div className="brand" onClick={() => navigate("/dashboard")}>
          <div className="brand-icon">🌿</div>
          {!collapsed && (
            <div>
              <h2>AgriAI</h2>
              <p>Farm Intelligence</p>
            </div>
          )}
        </div>

        <button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {!collapsed && <p className="sidebar-section-title">MAIN MENU</p>}

      <nav className="nav-section">
        <NavItem path="/dashboard" icon={<Home size={18} />} label="Dashboard" />
        <NavItem path="/disease" icon={<Leaf size={18} />} label="Disease Detection" />
        <NavItem path="/history" icon={<History size={18} />} label="Prediction History" />
        <NavItem path="/crop" icon={<Sprout size={18} />} label="Crop Recommendation" disabled />
        <NavItem path="/yield" icon={<BarChart3 size={18} />} label="Yield Prediction" disabled />
        <NavItem path="/weather" icon={<CloudSun size={18} />} label="Weather Risk" disabled />
        <NavItem path="/chatbot" icon={<Bot size={18} />} label="Farmer Chatbot" disabled />
      </nav>

      <div className="sidebar-divider" />

      {!collapsed && <p className="sidebar-section-title">ACCOUNT</p>}

      <nav className="nav-section">
        <NavItem path="/profile" icon={<UserCircle size={18} />} label="Profile" />
        <NavItem path="/settings" icon={<Settings size={18} />} label="Settings" />
      </nav>

      <div className="sidebar-db-card">
        <div className="db-icon-wrap">
          <Cloud size={20} />
          <span>✓</span>
        </div>

        {!collapsed && (
          <div>
            <p>Database Status</p>
            <strong>Connected</strong>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;