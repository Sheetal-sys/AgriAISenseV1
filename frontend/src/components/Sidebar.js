import React from "react";
import {
  Leaf,
  Home,
  Activity,
  Sprout,
  BarChart3,
  Bot,
  Settings as SettingsIcon,
  History as HistoryIcon,
  UserCircle,
  Cloud,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

function Sidebar({ activePage, setActivePage, collapsed, setCollapsed }) {
  const handleNavigate = (page) => {
    setActivePage(page);
  };

  const NavButton = ({ page, icon, label, disabled = false }) => (
    <button
      className={[
        activePage === page ? "nav-item active" : "nav-item",
        disabled ? "disabled sidebar-coming-soon" : ""
      ].join(" ")}
      onClick={() => !disabled && handleNavigate(page)}
      title={collapsed ? label : ""}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
      {!collapsed && disabled && <small>Coming Soon</small>}
    </button>
  );

  return (
    <aside className={collapsed ? "sidebar pro-sidebar collapsed" : "sidebar pro-sidebar"}>
      <div className="sidebar-top-row">
        <div
          className="brand clickable-brand pro-brand"
          onClick={() => handleNavigate("landing")}
          title={collapsed ? "AgriAI" : ""}
        >
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
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      {!collapsed && <p className="sidebar-section-title">MAIN MENU</p>}

      <nav className="nav-section pro-nav-section">
        <NavButton page="home" icon={<Home size={20} />} label="Dashboard" />
        <NavButton page="disease" icon={<Leaf size={20} />} label="Disease Detection" />
        <NavButton page="history" icon={<HistoryIcon size={20} />} label="Prediction History" />

        <NavButton page="crop" icon={<Sprout size={20} />} label="Crop Recommendation" disabled />
        <NavButton page="yield" icon={<BarChart3 size={20} />} label="Yield Prediction" disabled />
        <NavButton page="weather" icon={<Activity size={20} />} label="Weather Risk" disabled />
        <NavButton page="chatbot" icon={<Bot size={20} />} label="Farmer Chatbot" disabled />
      </nav>

      <div className="sidebar-divider" />

      {!collapsed && <p className="sidebar-section-title">ACCOUNT</p>}

      <div className="nav-section pro-nav-section account-nav">
        <NavButton page="profile" icon={<UserCircle size={20} />} label="Profile" />
        <NavButton page="settings" icon={<SettingsIcon size={20} />} label="Settings" />
      </div>

      <div
        className={collapsed ? "sidebar-db-card collapsed-db" : "sidebar-db-card"}
        title="Connected to MongoDB Atlas"
      >
        <div className="db-icon-wrap">
          <Cloud size={24} />
          <span>✓</span>
        </div>

        {!collapsed && (
          <div>
            <p>Database Status</p>
            <strong>Connected to MongoDB Atlas</strong>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;