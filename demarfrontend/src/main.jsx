import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./context/cartContext";
import { LoadingProvider } from "./context/loadingContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LoadingProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </LoadingProvider>
  </React.StrictMode>
);
