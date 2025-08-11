import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const register = async (name, email, password, phone) => {
    const r = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        phone,
      }),
    });
    if (!r.ok) {
      let payload = null;
      try {
        payload = await r.json();
      } catch {}
      return {
        ok: false,
        error: payload?.error || "unknown_error",
        status: r.status,
      };
    }
    return { ok: true };
  };

  const login = async (email, password) => {
    const r = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });
    if (!r.ok) {
      let payload = null;
      try {
        payload = await r.json();
      } catch {}
      return {
        ok: false,
        error: payload?.error || "invalid_credentials",
        status: r.status,
      };
    }
    const data = await r.json();
    setUser(data);
    return { ok: true, data };
  };

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
