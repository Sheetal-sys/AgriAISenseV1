import React, { useState } from "react";
import { Bell, Settings, UserCircle, X } from "lucide-react";

function Header() {
  const [modal, setModal] = useState(null);

  return (
    <>
      <div className="floating-actions">
        <button className="icon-btn" onClick={() => setModal("notifications")}>
          <Bell size={20} />
        </button>

        <button className="icon-btn" onClick={() => setModal("settings")}>
          <Settings size={20} />
        </button>

        <button className="profile-btn" onClick={() => setModal("profile")}>
          <UserCircle size={22} />
          <span>Rajesh</span>
        </button>
      </div>

      {modal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <button className="modal-close" onClick={() => setModal(null)}>
              <X size={18} />
            </button>

            {modal === "notifications" && (
              <>
                <h2>Notifications</h2>
                <p>✅ Disease detection API is active.</p>
                <p>🌿 Last scan module ready.</p>
                <p>⚠️ Weather risk agent coming soon.</p>
              </>
            )}

            {modal === "settings" && (
              <>
                <h2>Settings</h2>
                <label>
                  Theme
                  <select>
                    <option>Dark AgriAI Theme</option>
                    <option>Light Theme</option>
                  </select>
                </label>
                <label>
                  Language
                  <select>
                    <option>English</option>
                    <option>Hindi</option>
                  </select>
                </label>
              </>
            )}

            {modal === "profile" && (
              <>
                <h2>User Profile</h2>
                <p><strong>Name:</strong> Rajesh</p>
                <p><strong>Role:</strong> Farmer / AgriAI User</p>
                <p><strong>Active Module:</strong> Disease Detection</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Header;