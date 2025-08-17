import { api } from "./api";

export const listReservationsApi = ({ on401 } = {}) => {
  return api(`/reservations/`, { on401 });
};

export const deleteReservationApi = (id, { on401 } = {}) => {
  return api(`/reservations/${id}`, { method: "DELETE", on401 });
};
