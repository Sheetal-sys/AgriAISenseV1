import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Activity,
  Calendar,
  Edit3,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Save,
  Sprout,
  UserCircle,
} from "lucide-react";

import PageLoader from "../../components/common/PageLoader";
import { getProfile, updateProfile } from "../../services/profileService";
import { getFullDashboard } from "../../services/dashboardService";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getProfile(), getFullDashboard()])
      .then(([profileData, dashboardData]) => {
        setProfile(profileData);
        setDashboard(dashboardData);
        setForm({
          name: profileData.name || "",
          phone: profileData.phone || "",
          location: profileData.location || "",
          role: profileData.role || "Farmer",
          farm_name: profileData.farm_name || "",
          farm_size: profileData.farm_size || "",
          primary_crops: (profileData.primary_crops || []).join(", "),
          experience: profileData.experience || "",
          language: profileData.language || "English",
        });
      })
      .catch((error) => {
        console.error("Profile load failed", error);
        toast.error("Unable to load profile.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        ...form,
        experience: form.experience ? Number(form.experience) : null,
        primary_crops: form.primary_crops
          ? form.primary_crops.split(",").map((item) => item.trim()).filter(Boolean)
          : [],
      };

      const updated = await updateProfile(payload);
      setProfile(updated);
      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update failed", error);
      toast.error("Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageLoader
        title="Loading Profile"
        subtitle="Preparing your account and farm information..."
      />
    );
  }

  const analytics = dashboard?.analytics || {};
  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="profile-page premium-profile-page">
      <section className="profile-hero">
        <div>
          <p className="eyebrow">USER ACCOUNT</p>
          <h1>Profile</h1>
          <p>Manage your farmer identity, farm details and account information.</p>
        </div>

        <button className="profile-save-top-btn" onClick={handleSave} disabled={saving}>
          <Save size={16} />
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </section>

      <section className="profile-layout">
        <div className="profile-left">
          <div className="profile-card profile-main-card">
            <div className="profile-cover" />

            <div className="profile-main-content">
              <div className="profile-avatar-large">{initials}</div>

              <div>
                <h2>{profile?.name || "User"}</h2>
                <p>{profile?.role || "Farmer"}</p>

                <span>
                  <MapPin size={14} />
                  {profile?.location || "Location not added"}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-card">
            <SectionTitle icon={<UserCircle size={18} />} title="Personal Information" />

            <div className="profile-form-grid">
              <ProfileInput label="Full Name" name="name" value={form.name} onChange={handleChange} />
              <ProfileInput label="Phone" name="phone" value={form.phone} onChange={handleChange} />
              <ProfileInput label="Location" name="location" value={form.location} onChange={handleChange} />
              <ProfileInput label="Role" name="role" value={form.role} onChange={handleChange} />
            </div>

            <div className="profile-info-row">
              <Mail size={16} />
              <div>
                <span>Email</span>
                <strong>{profile?.email}</strong>
              </div>
            </div>
          </div>

          <div className="profile-card">
            <SectionTitle icon={<Sprout size={18} />} title="Farm Information" />

            <div className="profile-form-grid">
              <ProfileInput label="Farm Name" name="farm_name" value={form.farm_name} onChange={handleChange} />
              <ProfileInput label="Farm Size" name="farm_size" value={form.farm_size} onChange={handleChange} />
              <ProfileInput label="Primary Crops" name="primary_crops" value={form.primary_crops} onChange={handleChange} />
              <ProfileInput label="Experience (Years)" name="experience" type="number" value={form.experience} onChange={handleChange} />
              <ProfileInput label="Language" name="language" value={form.language} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="profile-right">
          <div className="profile-card">
            <SectionTitle icon={<Activity size={18} />} title="Your Statistics" />

            <div className="profile-stats-grid">
              <Stat label="Total Scans" value={analytics.total_scans || 0} />
              <Stat label="Healthy Leaves" value={analytics.healthy_leaves || 0} />
              <Stat label="Diseased Leaves" value={analytics.diseased_leaves || 0} />
              <Stat label="Avg Confidence" value={`${analytics.average_confidence || 0}%`} />
            </div>
          </div>

          <div className="profile-card">
            <SectionTitle icon={<Calendar size={18} />} title="Account Activity" />

            <div className="profile-activity-list">
              <ActivityRow label="Member Since" value={formatDate(profile?.created_at)} />
              <ActivityRow label="Last Login" value={formatDate(profile?.last_login)} />
              <ActivityRow label="Last Updated" value={formatDate(profile?.updated_at)} />
            </div>
          </div>

          <div className="profile-card profile-note-card">
            <Leaf size={28} />
            <h3>AgriAI Farmer Profile</h3>
            <p>
              Your profile helps future AgriAI modules personalize crop recommendations,
              weather alerts, soil guidance and farm advisory.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProfileInput({ label, name, value, onChange, type = "text" }) {
  return (
    <label className="profile-field">
      <span>{label}</span>
      <input type={type} name={name} value={value} onChange={onChange} />
    </label>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <div className="profile-section-title">
      {icon}
      <h3>{title}</h3>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="profile-stat-box">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ActivityRow({ label, value }) {
  return (
    <div className="profile-activity-row">
      <span>{label}</span>
      <strong>{value || "N/A"}</strong>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "N/A";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default Profile;