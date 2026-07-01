import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  BarChart3,
  Bell,
  Brain,
  Globe,
  Palette,
  Save,
  ShieldCheck,
} from "lucide-react";

import PageLoader from "../../components/common/PageLoader";
import { getSettings, updateSettings } from "../../services/settingsService";

function Settings() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch((error) => {
        console.error("Settings load failed", error);
        toast.error("Unable to load settings.");
      });
  }, []);

  const handleChange = (field, value) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const updated = await updateSettings(settings);
      setSettings(updated);

      toast.success("Settings saved successfully.");
    } catch (error) {
      console.error("Settings save failed", error);
      toast.error("Unable to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <PageLoader
        title="Loading Settings"
        subtitle="Fetching your preferences and application controls..."
      />
    );
  }

  return (
    <div className="settings-page premium-settings-page">
      <section className="settings-hero">
        <div>
          <p className="eyebrow">APPLICATION CONTROL</p>
          <h1>Settings</h1>
          <p>
            Manage appearance, language, notifications, analytics, privacy and AI preferences.
          </p>
        </div>

        <button className="settings-save-btn" onClick={handleSave} disabled={saving}>
          <Save size={16} />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </section>

      <section className="settings-grid">
        <SettingsCard
          icon={<Palette size={20} />}
          title="Appearance"
          description="Customize how AgriAI looks on your device."
        >
          <SelectField
            label="Theme"
            value={settings.theme}
            onChange={(value) => handleChange("theme", value)}
            options={[
              ["dark", "Dark AgriAI Theme"],
              ["light", "Light Theme"],
              ["green", "Green Theme"],
              ["auto", "System Default"],
            ]}
          />
        </SettingsCard>

        <SettingsCard
          icon={<Globe size={20} />}
          title="Language & Units"
          description="Choose interface language and measurement preferences."
        >
          <SelectField
            label="Language"
            value={settings.language}
            onChange={(value) => handleChange("language", value)}
            options={[
              ["English", "English"],
              ["Hindi", "Hindi"],
              ["Marathi", "Marathi"],
              ["Gujarati", "Gujarati"],
              ["Tamil", "Tamil"],
            ]}
          />

          <SelectField
            label="Measurement Unit"
            value={settings.measurement_unit}
            onChange={(value) => handleChange("measurement_unit", value)}
            options={[
              ["metric", "Metric"],
              ["imperial", "Imperial"],
            ]}
          />
        </SettingsCard>

        <SettingsCard
          icon={<Bell size={20} />}
          title="Notifications"
          description="Control alerts related to scans, reports and future weather risk."
        >
          <ToggleField
            label="Enable Notifications"
            description="Receive updates about reports, feedback and system alerts."
            checked={Boolean(settings.notifications_enabled)}
            onChange={(value) => handleChange("notifications_enabled", value)}
          />

          <ToggleField
            label="Disease Alerts"
            description="Notify when a scan detects a risky disease condition."
            checked={Boolean(settings.disease_alerts)}
            onChange={(value) => handleChange("disease_alerts", value)}
          />

          <ToggleField
            label="Weather Alerts"
            description="Future weather-based crop risk alerts."
            checked={Boolean(settings.weather_alerts)}
            onChange={(value) => handleChange("weather_alerts", value)}
          />

          <ToggleField
            label="Report Notifications"
            description="Notify when PDF reports are generated."
            checked={Boolean(settings.report_notifications)}
            onChange={(value) => handleChange("report_notifications", value)}
          />
        </SettingsCard>

        <SettingsCard
          icon={<Brain size={20} />}
          title="AI Preferences"
          description="Control how strict the AI should be during prediction."
        >
          <SelectField
            label="Confidence Threshold"
            value={String(settings.confidence_threshold)}
            onChange={(value) => handleChange("confidence_threshold", Number(value))}
            options={[
              ["70", "Balanced - 70%"],
              ["80", "Recommended - 80%"],
              ["90", "Strict - 90%"],
            ]}
          />
        </SettingsCard>

        <SettingsCard
          icon={<BarChart3 size={20} />}
          title="Analytics"
          description="Control anonymous product analytics."
        >
          <ToggleField
            label="Anonymous Analytics"
            description="Help improve AgriAI by sharing anonymous usage data."
            checked={Boolean(settings.anonymous_analytics)}
            onChange={(value) => handleChange("anonymous_analytics", value)}
          />
        </SettingsCard>

        <SettingsCard
          icon={<ShieldCheck size={20} />}
          title="Privacy"
          description="Manage data storage and privacy controls."
        >
          <ToggleField
            label="Store Prediction History"
            description="Save scans, recommendations and feedback to MongoDB Atlas."
            checked={settings.store_history !== false}
            onChange={(value) => handleChange("store_history", value)}
          />
        </SettingsCard>
      </section>
    </div>
  );
}

function SettingsCard({ icon, title, description, children }) {
  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <div className="settings-card-icon">{icon}</div>

        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>

      <div className="settings-card-body">{children}</div>
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="settings-field">
      <span>{label}</span>

      <select value={value || ""} onChange={(event) => onChange(event.target.value)}>
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleField({ label, description, checked, onChange }) {
  return (
    <div className="settings-toggle-row">
      <div>
        <strong>{label}</strong>
        <p>{description}</p>
      </div>

      <button
        type="button"
        className={checked ? "settings-toggle active" : "settings-toggle"}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
    </div>
  );
}

export default Settings;