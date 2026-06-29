"use client"

import { useActionState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useCart } from "@/components/CartProvider"
import { formatPrice } from "@/lib/utils"
import { submitOrder } from "@/app/actions/checkout"
import FadeIn from "@/components/FadeIn"

export default function CheckoutClient() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()

  const [state, formAction, isPending] = useActionState(submitOrder, null)

  useEffect(() => {
    if (state?.success && state.orderId) {
      clearCart()
      router.push(`/checkout/success?order=${state.orderId}`)
    }
  }, [state, clearCart, router])

  if (items.length === 0 && !state?.success) {
    return (
      <div className="pt-32 pb-20 text-center px-6">
        <h1 className="font-serif text-3xl mb-4">Your bag is empty</h1>
        <p className="text-gray-400 text-sm mb-8">
          Add some items before proceeding to checkout.
        </p>
        <a
          href="/"
          className="inline-block border border-black text-[11px] tracking-[0.2em] px-10 py-3 hover:bg-black hover:text-white transition-all duration-300"
        >
          SHOP NOW
        </a>
      </div>
    )
  }

  const cartItemsJson = JSON.stringify(
    items.map((item) => ({
      slug: item.product.slug,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }))
  )

  return (
    <div className="pb-20 pr-6" style={{ paddingTop: "60px", paddingLeft: "5%", paddingRight: "5%" }}>
      <div className="max-w-[1200px] mx-auto">
        <FadeIn>
          <h1 className="font-serif text-3xl md:text-4xl mb-2">Checkout</h1>
          <p className="text-gray-400 text-sm mb-12">
            Cash on Delivery — Pay when your order arrives
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <FadeIn delay={0.1}>
              <h2 className="text-[12px] tracking-[0.3em] uppercase mb-8">
                Delivery Information
              </h2>

              <form action={formAction} className="space-y-6">
                <input type="hidden" name="cartItems" value={cartItemsJson} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-[11px] tracking-[0.2em] text-black font-bold uppercase mb-4"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full border-2 border-gray-300 px-6 py-5 text-base font-light bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 placeholder-gray-405"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-[11px] tracking-[0.2em] text-black font-bold uppercase mb-4"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full border-2 border-gray-300 px-6 py-5 text-base font-light bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 placeholder-gray-405"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-[11px] tracking-[0.2em] text-black font-bold uppercase mb-4"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full border-2 border-gray-300 px-6 py-5 text-base font-light bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 placeholder-gray-405"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-[11px] tracking-[0.2em] text-black font-bold uppercase mb-4"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    className="w-full border-2 border-gray-300 px-6 py-5 text-base font-light bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 placeholder-gray-405"
                    placeholder="Enter your city"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-[11px] tracking-[0.2em] text-black font-bold uppercase mb-4"
                  >
                    Detailed Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    required
                    rows={4}
                    className="w-full border-2 border-gray-300 px-6 py-5 text-base font-light bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 placeholder-gray-405 resize-none"
                    placeholder="Street address, apartment, building, floor..."
                  />
                </div>

                {state?.error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3"
                  >
                    {state.error}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={isPending}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-black text-white text-sm tracking-[0.3em] py-6 font-bold hover:bg-stone transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-4"
                  id="confirm-order"
                >
                  {isPending
                    ? "PROCESSING..."
                    : "CONFIRM ORDER (PAY ON DELIVERY)"}
                </motion.button>

                <p className="text-[11px] text-gray-400 text-center mt-4">
                  By placing this order, you agree to pay the total amount upon delivery.
                </p>
              </form>
            </FadeIn>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="lg:sticky lg:top-36">
              <FadeIn delay={0.2}>
                <h2 className="text-[12px] tracking-[0.3em] uppercase mb-8">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-8">
                  {items.map((item) => (
                    <div key={item.product.slug} className="flex gap-4">
                      <div className="relative w-16 h-20 bg-gray-100 shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-light truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm mt-1">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-gold text-[11px] tracking-wider">
                      COMPLIMENTARY
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="text-[12px] tracking-[0.2em] uppercase">
                      Total
                    </span>
                    <span className="text-xl font-serif">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold shrink-0">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    <div>
                      <p className="text-[11px] tracking-[0.15em] uppercase">
                        Cash on Delivery
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Pay when your package arrives
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
