import { api } from "./api";

export const fetchCart = (uid, on401) => {
  return api(`/user/${uid}/cart`, { on401 });
};

export const updateCartItem = (uid, foodId, quantity) => {
  return api(`/user/${uid}/cart`, {
    method: "PATCH",
    body: { foodId, quantity },
  });
};

export const removeCartItem = (uid, foodId) => {
  return api(`/user/${uid}/cart/${foodId}`, { method: "DELETE" });
};
