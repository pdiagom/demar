import React, { createContext, useContext, useReducer } from 'react';

// Crear el contexto
const CartContext = createContext();

// Inicializar el estado del carrito
const initialState = {
    cartItems: [],
    total: 0,
};

// Reducer para manejar las acciones del carrito
const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const newItem = action.payload;
            const existingItemIndex = state.cartItems.findIndex(item => item.article.idArticle === newItem.article.idArticle);
            if (existingItemIndex >= 0) {
                // Si el artículo ya está en el carrito, aumenta la cantidad
                const updatedCartItems = [...state.cartItems];
                updatedCartItems[existingItemIndex].quantity += 1;
                return {
                    ...state,
                    cartItems: updatedCartItems,
                    total: (state.total + newItem.article.price * newItem.quantity).toFixed(2),
                };
            } else {
                // Si el artículo no está en el carrito, agrégalo
                return {
                    ...state,
                    cartItems: [...state.cartItems, newItem],
                    total: state.total + newItem.article.price * newItem.quantity,
                };
            }
        case 'REMOVE_FROM_CART':
            // Eliminar completamente el artículo del carrito
            const updatedItems = state.cartItems.filter(item => item.article.idArticle !== action.payload.idArticle);
            const itemToRemove = state.cartItems.find(item => item.article.idArticle === action.payload.idArticle);
            return {
                ...state,
                cartItems: updatedItems,
                total: state.total - (itemToRemove ? itemToRemove.article.price * itemToRemove.quantity : 0),
            };
        case 'DECREASE_QUANTITY':
            // Disminuir la cantidad de un artículo
            const itemIndex = state.cartItems.findIndex(item => item.article.idArticle === action.payload.idArticle);
            if (itemIndex >= 0) {
                const updatedCartItems = [...state.cartItems];
                const item = updatedCartItems[itemIndex];
                
                // Si la cantidad es 1, eliminamos el artículo
                if (item.quantity === 1) {
                    return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: item });
                } else {
                    // De lo contrario, disminuimos la cantidad
                    item.quantity -= 1;
                    return {
                        ...state,
                        cartItems: updatedCartItems,
                        total: state.total - item.article.price,
                    };
                }
            }
            return state; // Si no se encuentra el artículo, devolvemos el estado actual
        case 'CLEAR_CART':
            return initialState;
        default:
            return state;
    }
};

// Proveedor del contexto
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

// Hook para usar el contexto
export const useCart = () => {
    return useContext(CartContext);
};
