import { api } from "./api";

export const fetchCart = (on401) => {
  return api(`/user/cart`, { on401 });
};

export const updateCartItem = (foodId, quantity) => {
  return api(`/user/cart`, {
    method: "PATCH",
    body: { foodId, quantity },
  });
};

export const removeCartItem = (foodId) => {
  return api(`/user/cart/${foodId}`, { method: "DELETE" });
};
