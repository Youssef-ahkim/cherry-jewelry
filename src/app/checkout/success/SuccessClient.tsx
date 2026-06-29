"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Suspense } from "react"

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order")

  return (
    <div className="bg-white flex flex-col items-center justify-center w-full" style={{ paddingTop: "160px", paddingBottom: "80px" }}>
      <div className="w-full max-w-lg px-6">
        <div className="bg-white border border-gray-200 p-8 md:p-12 flex flex-col items-center text-center gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="w-20 h-20 rounded-full flex items-center justify-center border-2 shrink-0"
            style={{ borderColor: "#C9A96E" }}
          >
            <motion.svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C9A96E"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.path
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              />
            </motion.svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center justify-center w-full gap-4"
          >
            <h1 className="font-serif text-2xl md:text-3xl tracking-tight">
              Order Confirmed
            </h1>

            <p className="text-gray-500 text-sm font-light leading-relaxed max-w-sm mx-auto">
              Thank you for your order. Your exquisite pieces will be carefully
              packaged and delivered to your doorstep.
            </p>

            <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase">
              PAY ON DELIVERY
            </p>

            {orderId && (
              <div className="bg-gray-50 border border-gray-150 px-8 py-4 w-full max-w-xs flex flex-col items-center justify-center gap-1 mb-2">
                <p className="text-[10px] tracking-[0.25em] text-gray-400 uppercase font-bold">
                  Order Number
                </p>
                <p className="font-serif text-lg text-black">#{orderId}</p>
              </div>
            )}

            <Link
              href="/"
              className="inline-block text-center text-xs tracking-[0.25em] py-5 px-12 font-bold hover:bg-stone transition-all duration-300 w-full max-w-xs mt-2"
              style={{ color: "white", backgroundColor: "black" }}
            >
              CONTINUE SHOPPING
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function SuccessClient() {
  return (
    <Suspense
      fallback={
        <div className="bg-white" style={{ paddingTop: "160px", paddingBottom: "80px" }}>
          <div className="max-w-md mx-auto px-6 text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full border-2 border-gray-200 animate-pulse" />
            <div className="h-8 w-48 mx-auto bg-gray-100 animate-pulse mb-4" />
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
