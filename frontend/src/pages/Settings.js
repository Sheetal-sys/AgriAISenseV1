import React, { useEffect, useState } from "react";
import { Bell, Globe, Palette, BarChart3, Save } from "lucide-react";
import { getSettings, updateSettings } from "../services/settingsService";

function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch((error) => console.error("Settings fetch failed", error))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await updateSettings(settings);
      setSettings(updated);
      alert("Settings saved successfully.");
    } catch (error) {
      console.error("Settings save failed", error);
      alert("Unable to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="placeholder-page">
        <h1>Loading Settings...</h1>
        <p>Fetching settings from MongoDB Atlas.</p>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <section className="page-hero">
        <div>
          <h1>Settings</h1>
          <p>Manage application preferences stored in MongoDB Atlas.</p>
        </div>
      </section>

      <div className="settings-card">
        <div className="settings-grid">
          <label>
            <Palette size={20} />
            <span>Theme</span>
            <select
              value={settings?.theme || "dark"}
              onChange={(e) => handleChange("theme", e.target.value)}
            >
              <option value="dark">Dark AgriAI Theme</option>
              <option value="light">Light Theme</option>
            </select>
          </label>

          <label>
            <Globe size={20} />
            <span>Language</span>
            <select
              value={settings?.language || "English"}
              onChange={(e) => handleChange("language", e.target.value)}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </label>

          <label>
            <Bell size={20} />
            <span>Notifications</span>
            <select
              value={settings?.notifications_enabled ? "enabled" : "disabled"}
              onChange={(e) =>
                handleChange(
                  "notifications_enabled",
                  e.target.value === "enabled"
                )
              }
            >
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </label>

          <label>
            <BarChart3 size={20} />
            <span>Anonymous Analytics</span>
            <select
              value={settings?.anonymous_analytics ? "enabled" : "disabled"}
              onChange={(e) =>
                handleChange(
                  "anonymous_analytics",
                  e.target.value === "enabled"
                )
              }
            >
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </label>
        </div>

        <button className="primary-btn settings-save-btn" onClick={handleSave} disabled={saving}>
          <Save size={18} />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

export default Settings;