import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  async function logout() {
    try {
      const r = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!r.ok) return;
    } finally {
      setUser(null);
    }
  }
  async function refreshMe() {
    setAuthLoading(true);
    try {
      const r = await fetch("/api/me", { credentials: "include" });
      if (!r.ok) {
        setUser(null);
        return;
      }
      const data = await r.json();
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

  const getUserId = () => user?._id || null;

  return (
    <AuthContext.Provider
      value={{ user, authLoading, refreshMe, getUserId, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
