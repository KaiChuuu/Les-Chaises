"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type CartItem = {
  merchandiseId: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (merchandiseId: string) => void;
  updateCart: (item: CartItem) => void;
};

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (error) {
        console.log("Failed to get cart from localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingItem = prev.find(
        (p) => p.merchandiseId === item.merchandiseId
      );
      if (existingItem) {
        return prev.map((p) =>
          p.merchandiseId === item.merchandiseId
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (merchandiseId: string) => {
    setCart((prev) => prev.filter((p) => p.merchandiseId !== merchandiseId));
  };

  const updateCart = (item: CartItem) => {
    setCart((prev) => {
      const existingItem = prev.find(
        (p) => p.merchandiseId === item.merchandiseId
      );
      if (existingItem) {
        return prev.map((p) =>
          p.merchandiseId === item.merchandiseId
            ? { ...p, quantity: item.quantity }
            : p
        );
      }
      return [...prev, item];
    });
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
