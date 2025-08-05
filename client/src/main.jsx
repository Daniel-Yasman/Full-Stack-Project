import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.jsx";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Reservation from "./pages/Reservation.jsx";
import MyReservations from "./pages/MyReservations";
import Home from "./pages/Home";
import { CartProvider } from "./context/CartContext";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      {" "}
      {/* 🛠 THIS must wrap everything that uses useCart */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/reserve" element={<Reservation />} />
          <Route path="/my-reservations" element={<MyReservations />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </StrictMode>
);
