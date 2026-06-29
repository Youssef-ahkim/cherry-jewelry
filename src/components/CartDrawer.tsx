"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "./CartProvider"
import { formatPrice } from "@/lib/utils"

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } =
    useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[95] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <h2 className="text-[12px] tracking-[0.3em] uppercase">
                Your Bag ({items.length})
              </h2>
              <button
                onClick={closeCart}
                className="cursor-pointer p-1"
                aria-label="Close cart"
                id="cart-close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="mb-4 text-gray-300">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  <p className="text-gray-400 text-sm font-light">
                    Your bag is empty
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-6 text-[11px] tracking-[0.2em] border-b border-black pb-1 hover:text-gray-500 transition-colors cursor-pointer"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.slug}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-4"
                    >
                      <div className="relative w-20 h-24 bg-gray-100 shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-light truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.product.category}
                        </p>
                        <p className="text-sm mt-2">
                          {formatPrice(item.product.price)}
                        </p>

                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.slug,
                                item.quantity - 1
                              )
                            }
                            className="w-7 h-7 border border-gray-200 flex items-center justify-center text-xs hover:border-black transition-colors cursor-pointer"
                          >
                            −
                          </button>
                          <span className="text-sm w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.slug,
                                item.quantity + 1
                              )
                            }
                            className="w-7 h-7 border border-gray-200 flex items-center justify-center text-xs hover:border-black transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.slug)}
                        className="self-start p-1 cursor-pointer"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 hover:text-black transition-colors">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-200 px-6 py-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] tracking-[0.2em] uppercase">
                    Subtotal
                  </span>
                  <span className="text-lg font-serif">
                    {formatPrice(total)}
                  </span>
                </div>

                <p className="text-[11px] text-gray-400">
                  Shipping & taxes calculated at checkout
                </p>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full text-center text-sm tracking-[0.3em] py-6 font-bold hover:bg-stone transition-all duration-300"
                  style={{ color: "white", backgroundColor: "black" }}
                  id="proceed-checkout"
                >
                  PROCEED TO CHECKOUT
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
