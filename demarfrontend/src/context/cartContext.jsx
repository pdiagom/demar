import React, { createContext, useContext, useReducer, useEffect } from "react";

// Crear el contexto
const CartContext = createContext();

// Estado inicial
const getInitialState = () => {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    return JSON.parse(savedCart);
  }
  return {
    cartItems: [],
    total: 0,
  };
};

// Función para calcular el total con dos decimales
const calculateTotal = (items) => {
  return parseFloat(
    items.reduce((sum, item) => sum + item.article.price * item.quantity, 0)
  ).toFixed(2);
};

// Reducer
const cartReducer = (state, action) => {
  let updatedCartItems;

  switch (action.type) {
    case "ADD_TO_CART":
      const newItem = action.payload;
      const existingIndex = state.cartItems.findIndex(
        (item) => item.article.idArticle === newItem.article.idArticle
      );

      if (existingIndex >= 0) {
        updatedCartItems = [...state.cartItems];
        updatedCartItems[existingIndex].quantity += newItem.quantity;
      } else {
        updatedCartItems = [...state.cartItems, newItem];
      }

      return {
        ...state,
        cartItems: updatedCartItems,
        total: parseFloat(calculateTotal(updatedCartItems)),
      };

    case "REMOVE_FROM_CART":
      updatedCartItems = state.cartItems.filter(
        (item) => item.article.idArticle !== action.payload.idArticle
      );
      return {
        ...state,
        cartItems: updatedCartItems,
        total: parseFloat(calculateTotal(updatedCartItems)),
      };

    case "DECREASE_QUANTITY":
      updatedCartItems = [...state.cartItems];
      const index = updatedCartItems.findIndex(
        (item) => item.article.idArticle === action.payload.idArticle
      );

      if (index >= 0) {
        if (updatedCartItems[index].quantity === 1) {
          updatedCartItems.splice(index, 1); // Quitar el artículo
        } else {
          updatedCartItems[index].quantity -= 1;
        }
      }

      return {
        ...state,
        cartItems: updatedCartItems,
        total: parseFloat(calculateTotal(updatedCartItems)),
      };

    case "CLEAR_CART":
      return {
        cartItems: [],
        total: 0,
      };

    default:
      return state;
  }
};

// Proveedor del contexto
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, getInitialState());

  // Efecto para guardar el estado en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado
export const useCart = () => useContext(CartContext);
