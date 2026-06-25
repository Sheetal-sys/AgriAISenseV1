import React, { useEffect, useState } from "react";
import { UserCircle, MapPin, Mail, Phone, Calendar, Briefcase } from "lucide-react";
import { getProfile } from "../services/profileService";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((data) => setProfile(data))
      .catch((error) => console.error("Profile fetch failed", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="placeholder-page">
        <h1>Loading Profile...</h1>
        <p>Fetching user profile from MongoDB Atlas.</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <section className="page-hero">
        <div>
          <h1>User Profile</h1>
          <p>Profile data is loaded from MongoDB Atlas.</p>
        </div>
      </section>

      <div className="profile-card">
        <div className="profile-avatar">
          <UserCircle size={90} />
        </div>

        <h2>{profile?.name || "User"}</h2>
        <span className="profile-role">{profile?.role || "AgriAI User"}</span>

        <div className="profile-info-grid">
          <div>
            <Briefcase size={18} />
            <span>Active Module</span>
            <strong>{profile?.active_module || "N/A"}</strong>
          </div>

          <div>
            <MapPin size={18} />
            <span>Location</span>
            <strong>{profile?.location || "N/A"}</strong>
          </div>

          <div>
            <Mail size={18} />
            <span>Email</span>
            <strong>{profile?.email || "N/A"}</strong>
          </div>

          <div>
            <Phone size={18} />
            <span>Phone</span>
            <strong>{profile?.phone || "N/A"}</strong>
          </div>

          <div>
            <Calendar size={18} />
            <span>Member Since</span>
            <strong>{profile?.member_since || "N/A"}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;