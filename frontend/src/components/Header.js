import React, { useState } from "react";
import {
  Bell,
  Settings,
  UserCircle,
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

          <div className="notification-wrapper">
            <button
              className="icon-btn"
              onClick={() => setModal("notifications")}
            >
              <Bell size={20}/>
            </button>

            <span className="notification-dot"></span>

          </div>

          <button
            className="icon-btn"
            onClick={() => setActivePage("settings")}
          >
            <Settings size={20}/>
          </button>

          <button
            className="profile-btn"
            onClick={() => setActivePage("profile")}
          >
            <UserCircle size={24}/>

            <div>

              <div className="profile-name">
                Rajesh
              </div>

              <div className="profile-role">
                Farmer
              </div>

            </div>

            <ChevronDown size={16}/>

          </button>

        </div>

      </header>

      {modal && (

        <div className="modal-backdrop">

          <div className="modal-card">

            <button
              className="modal-close"
              onClick={() => setModal(null)}
            >
              <X size={18}/>
            </button>

            <NotificationsModal/>

          </div>

        </div>

      )}

    </>
  );
}

export default Header;