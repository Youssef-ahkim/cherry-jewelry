"use client"

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from "react"
import { CartState, CartAction, CartItem, Product } from "@/types"

const initialState: CartState = {
  items: [],
  isOpen: false,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (item) => item.product.slug === action.product.slug
      )
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product.slug === action.product.slug
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: 1 }],
      }
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.product.slug !== action.slug),
      }
    case "UPDATE_QUANTITY":
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.product.slug !== action.slug
          ),
        }
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.slug === action.slug
            ? { ...item, quantity: action.quantity }
            : item
        ),
      }
    case "CLEAR_CART":
      return { ...state, items: [] }
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen }
    case "OPEN_CART":
      return { ...state, isOpen: true }
    case "CLOSE_CART":
      return { ...state, isOpen: false }
    default:
      return state
  }
}

interface CartContextType {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product) => void
  removeItem: (slug: string) => void
  updateQuantity: (slug: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    const saved = localStorage.getItem("aurele-cart")
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as CartItem[]
        parsed.forEach((item) => {
          for (let i = 0; i < item.quantity; i++) {
            dispatch({ type: "ADD_ITEM", product: item.product })
          }
        })
      } catch {
        localStorage.removeItem("aurele-cart")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("aurele-cart", JSON.stringify(state.items))
  }, [state.items])

  const addItem = useCallback(
    (product: Product) => dispatch({ type: "ADD_ITEM", product }),
    []
  )
  const removeItem = useCallback(
    (slug: string) => dispatch({ type: "REMOVE_ITEM", slug }),
    []
  )
  const updateQuantity = useCallback(
    (slug: string, quantity: number) =>
      dispatch({ type: "UPDATE_QUANTITY", slug, quantity }),
    []
  )
  const clearCart = useCallback(
    () => dispatch({ type: "CLEAR_CART" }),
    []
  )
  const toggleCart = useCallback(
    () => dispatch({ type: "TOGGLE_CART" }),
    []
  )
  const openCart = useCallback(
    () => dispatch({ type: "OPEN_CART" }),
    []
  )
  const closeCart = useCallback(
    () => dispatch({ type: "CLOSE_CART" }),
    []
  )

  const total = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const itemCount = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextType {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
