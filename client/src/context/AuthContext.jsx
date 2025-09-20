import { createContext, useContext, useState, useEffect } from "react";
import { registerApi, loginApi, logoutApi, refreshMeApi } from "../lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const register = async (name, email, password, phone) => {
    return registerApi(name, email, password, phone);
  };

  const login = async (email, password) => {
    return loginApi(email, password);
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
      const data = await refreshMeApi();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }

  const isAdmin = user?.role === "admin";
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
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
