import { createContext, useContext, useState, useEffect } from "react";
import {
  register as registerApi,
  login as loginApi,
  logout as logoutApi,
  refreshMe as refreshMeApi,
} from "../lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const register = async (name, email, password, phone) => {
    try {
      await registerApi(name, email, password, phone);
      return;
    } catch (e) {
      return {
        error: e.body?.error || "unknown_error",
        status: e.status ?? 500,
      };
    }
  };

  const login = async (email, password) => {
    try {
      const data = await loginApi(email, password);
      setUser(data);
      return;
    } catch (e) {
      return {
        error: e.body?.error || "unknown_error",
        status: e.status ?? 500,
      };
    }
  };

  async function logout() {
    try {
      await logoutApi();
    } finally {
      setUser(null);
    }
  }

  async function refreshMe() {
    setAuthLoading(true);
    try {
      const data = await refreshMeApi(() => setUser(null));
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }

  useEffect(() => {
    refreshMe();
  }, []);

  const getUserId = () => user?.id ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        refreshMe,
        getUserId,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
