import React from "react";
import { Navigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="auth-loading-screen">
        <h1>Loading AgriAI...</h1>
        <p>Checking secure session.</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;