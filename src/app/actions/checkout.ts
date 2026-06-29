"use server"

import { db } from "@/db"
import { orders, orderItems } from "@/db/schema"

interface CartItemData {
  slug: string
  name: string
  price: number
  quantity: number
}

interface CheckoutState {
  success: boolean
  orderId?: number
  error?: string
}

export async function submitOrder(
  prevState: CheckoutState | null,
  formData: FormData
): Promise<CheckoutState> {
  try {
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const phone = formData.get("phone") as string
    const city = formData.get("city") as string
    const address = formData.get("address") as string
    const cartData = formData.get("cartItems") as string

    if (!firstName || !lastName || !phone || !city || !address) {
      return { success: false, error: "All fields are required." }
    }

    const phoneRegex = /^[\d\s+\-()]{7,20}$/
    if (!phoneRegex.test(phone)) {
      return { success: false, error: "Please enter a valid phone number." }
    }

    let items: CartItemData[]
    try {
      items = JSON.parse(cartData)
    } catch {
      return { success: false, error: "Invalid cart data." }
    }

    if (!items || items.length === 0) {
      return { success: false, error: "Your cart is empty." }
    }

    const totalAmount = items
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2)

    const [result] = await db.insert(orders).values({
      firstName,
      lastName,
      phone,
      city,
      address,
      totalAmount,
      status: "pending",
    })

    const orderId = result.insertId

    await db.insert(orderItems).values(
      items.map((item) => ({
        orderId,
        productSlug: item.slug,
        productName: item.name,
        price: item.price.toFixed(2),
        quantity: item.quantity,
      }))
    )

    return { success: true, orderId }
  } catch (error) {
    console.error("Order submission error:", error)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}
