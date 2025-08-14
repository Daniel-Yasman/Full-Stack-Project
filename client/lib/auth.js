import { api } from "./api";

export const register = (name, email, password, phone, on401) => {
  return api("/register", {
    method: "POST",
    body: { name, email, password, phone },
    on401,
  });
};

export const login = (email, password, on401) => {
  return api("/login", {
    method: "POST",
    body: { email, password },
    on401,
  });
};

export const logout = (on401) => {
  return api("/logout", { method: "POST", on401 });
};

export const refreshMe = (on401) => {
  return api("/me", { on401 });
};
