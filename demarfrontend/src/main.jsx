import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from './context/cartContext';

// Se asume que en public/index.html existe un elemento con id 'root'
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
        <CartProvider>
            <App />
        </CartProvider>
  </React.StrictMode>
);
