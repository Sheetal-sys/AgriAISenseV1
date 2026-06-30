import React from "react";

function StatCard({ icon, title, value, note, variant = "green" }) {
  return (
    <div className={`stat-card ${variant}`}>
      <div className="stat-card-icon">{icon}</div>
      <p>{title}</p>
      <h2>{value}</h2>
      <span>{note}</span>
    </div>
  );
}

export default StatCard;