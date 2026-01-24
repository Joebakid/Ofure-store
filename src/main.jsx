import React from "react";
import { createRoot } from "react-dom/client";

/* Global styles FIRST */
import "../globals.css";
import "./styles/fonts.css";

/* App & Providers */
import App from "./App";
import { CartProvider } from "./context/CartContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);
