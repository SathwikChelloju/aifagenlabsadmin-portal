import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => ({ success: false }),
  logout: async () => {},
});
