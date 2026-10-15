import React, { useState, useCallback } from "react";
import { AuthContext } from "./AuthContext.js";
import { authClient } from "../features/auth/services/authClient.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authClient.getUser());
  const [token, setToken] = useState(() => authClient.getToken());
  const [isAuthenticated, setIsAuthenticated] = useState(() => authClient.isAuthenticated());
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async ({ email, password, rememberMe = false }) => {
    setIsLoading(true);
    try {
      const res = await authClient.login({ email, password, rememberMe });
      if (res.success) {
        setUser(res.user);
        setToken(res.token);
        setIsAuthenticated(true);
        return { success: true, user: res.user };
      }
      return { success: false, error: res.error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authClient.logout();
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
