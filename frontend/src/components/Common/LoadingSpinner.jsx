import React from "react";

function LoadingSpinner({ size = "md", label = "Loading..." }) {
  return (
    <div className={`loading-spinner-wrap ${size}`}>
      <div className="loading-spinner" />
      {label && <p>{label}</p>}
    </div>
  );
}

export default LoadingSpinner;