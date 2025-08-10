import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  async function refreshMe() {
    setAuthLoading(true);
    try {
      const r = await fetch("/api/me", { credentials: "include" });
      setUser(r.ok ? await r.json() : null);
    } finally {
      setAuthLoading(false);
    }
  }

  useEffect(() => {
    refreshMe();
  }, []);

  const getUserId = () => user?._id || null;

  return (
    <AuthContext.Provider value={{ user, authLoading, refreshMe, getUserId }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
