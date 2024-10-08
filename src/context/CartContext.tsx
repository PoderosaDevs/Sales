// context/CartContext.tsx
import React, { createContext, useContext, useState } from "react";
import { CartItem, Produto, ShoppingCartContextType } from "./types/CartContext";

const CartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addProduct = (produto: Produto) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === produto.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...produto, quantidade: 1 }];
      }
    });
  };

  const removeProduct = (produtoId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== produtoId));
  };

  const updateItemQuantity = (id: string, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantidade: Math.max(newQuantity, 1) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addProduct, removeProduct, updateItemQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useShoppingCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useShoppingCart must be used within a CartProvider");
  }
  return context;
}
