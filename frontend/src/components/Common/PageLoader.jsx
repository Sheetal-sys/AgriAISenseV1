import React from "react";
import LoadingSpinner from "./LoadingSpinner";

function PageLoader({
  title = "Loading...",
  subtitle = "Please wait while we fetch your data."
}) {
  return (
    <div className="page-loader">
      <LoadingSpinner size="lg" />
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

export default PageLoader;