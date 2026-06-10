import React from "react";

function StatCard({ label, value, icon }) {
  return (
    <div className="stat-card">
      <span>{icon}</span>
      <p>{label}</p>
      <h3>{value}</h3>
    </div>
  );
}

export default StatCard;