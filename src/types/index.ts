export interface Product {
  slug: string
  name: string
  price: number
  category: string
  description: string
  details: string[]
  images: string[]
  hoverImage: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
}

export type CartAction =
  | { type: "ADD_ITEM"; product: Product }
  | { type: "REMOVE_ITEM"; slug: string }
  | { type: "UPDATE_QUANTITY"; slug: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }

export interface OrderFormData {
  firstName: string
  lastName: string
  phone: string
  city: string
  address: string
}

export interface OrderResult {
  success: boolean
  orderId?: number
  error?: string
}
