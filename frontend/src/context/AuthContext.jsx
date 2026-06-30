import React, { createContext, useEffect, useState } from "react";

import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/authService";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(() =>
    localStorage.getItem("agri_ai_token")
  );
  const [authLoading, setAuthLoading] = useState(true);

  const isAuthenticated = Boolean(token && currentUser);

  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Auth restore failed", error);
        localStorage.removeItem("agri_ai_token");
        setToken(null);
        setCurrentUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    loadCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await loginUser(email, password);

    localStorage.setItem("agri_ai_token", data.access_token);
    setToken(data.access_token);
    setCurrentUser(data.user);

    return data.user;
  };

  const register = async (formData) => {
    const data = await registerUser(formData);

    localStorage.setItem("agri_ai_token", data.access_token);
    setToken(data.access_token);
    setCurrentUser(data.user);

    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("agri_ai_token");
    setToken(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isAuthenticated,
        authLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;