import React, { useState } from "react";
import {
  Bell,
  Settings,
  ChevronDown,
  X
} from "lucide-react";

import NotificationsModal from "./modals/NotificationsModal";

function Header({ setActivePage }) {
  const [modal, setModal] = useState(null);

  return (
    <>
      <header className="app-header">
        <div className="header-right">
          <button
            className="header-icon-btn"
            onClick={() => setModal("notifications")}
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
            title="Profile"
          >
            <div className="header-avatar">RK</div>

            <div className="header-user-text">
              <strong>Rajesh</strong>
              <span>Farmer</span>
            </div>

            <ChevronDown size={15} />
          </button>
        </div>
      </header>

      {modal === "notifications" && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <button
              className="modal-close"
              onClick={() => setModal(null)}
            >
              <X size={18} />
            </button>

            <NotificationsModal />
          </div>
        </div>
      )}
    </>
  );
}

export default Header;