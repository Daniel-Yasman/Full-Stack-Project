import { api } from "./api";

export const fetchFoodsApi = ({ on401 } = {}) => {
  return api("/food/", { on401 });
};
