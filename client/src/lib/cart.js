import { api } from "./api";

export const fetchCartApi = ({ on401, signal } = {}) => {
  return api(`/user/cart`, { on401 }, { key: "GET:/user/cart" });
};

export const updateCartItemApi = (foodId, quantity, { on401, signal } = {}) => {
  return api(`/user/cart`, {
    method: "PATCH",
    body: { foodId, quantity },
    on401,
  });
};

export const removeCartItemApi = (foodId, { on401, signal } = {}) => {
  return api(`/user/cart/${foodId}`, { method: "DELETE", on401 });
};

export const addItemToCartApi = (foodId, quantity, { on401, signal } = {}) => {
  return api(`/user/cart`, {
    method: "POST",
    body: { foodId, quantity },
    on401,
  });
};
