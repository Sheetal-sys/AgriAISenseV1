import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AuthProvider from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#0f172a",
              color: "#f8fafc",
              border: "1px solid rgba(45, 212, 191, 0.22)",
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;