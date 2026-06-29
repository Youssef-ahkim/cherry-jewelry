"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Product } from "@/types"
import { useCart } from "@/components/CartProvider"
import { formatPrice } from "@/lib/utils"
import FadeIn from "@/components/FadeIn"
import ProductCard from "@/components/ProductCard"
interface ProductDetailClientProps {
  product: Product
  recommendations: Product[]
}

export default function ProductDetailClient({
  product,
  recommendations,
}: ProductDetailClientProps) {
  const { addItem, openCart } = useCart()
  const [added, setAdded] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string>("6")
  const [activeAccordion, setActiveAccordion] = useState<string | null>("story")
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const handleAddToCart = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => {
      openCart()
      setAdded(false)
    }, 600)
  }

  const toggleAccordion = (panel: string) => {
    setActiveAccordion(activeAccordion === panel ? null : panel)
  }

  const showSizes = product.category === "Rings"

  return (
    <div className="bg-white" style={{ paddingTop: "60px", paddingBottom: "48px" }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-6 border-b border-gray-100 flex items-center justify-between">
        <Link
          href="/"
          className="text-[10px] tracking-[0.3em] text-gray-400 hover:text-black transition-colors font-medium"
        >
          ← BACK TO COLLECTION
        </Link>
        <span className="text-[10px] tracking-[0.3em] text-gray-350">
          AURÈLE ATELIER
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-[1440px] mx-auto px-6 md:px-12 mt-10">
        <div className="lg:w-[55%] xl:w-[60%] bg-white">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            <div className="hidden md:flex flex-col gap-3 w-20 shrink-0">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  onMouseEnter={() => setActiveImageIndex(i)}
                  className={`relative aspect-[3/4] w-full overflow-hidden bg-gray-50 border cursor-pointer transition-all duration-300 ${
                    activeImageIndex === i ? "border-black" : "border-gray-200 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>

            <div className="flex-1 w-full flex flex-col items-center justify-start pt-4">
              <div className="relative aspect-[3/4] w-full max-w-[480px] bg-gray-50 overflow-hidden border border-gray-100">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative w-full h-full group"
                  >
                    <Image
                      src={product.images[activeImageIndex]}
                      alt={`${product.name} main view`}
                      fill
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex md:hidden gap-3 justify-center mt-6 w-full">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`relative aspect-[3/4] w-16 overflow-hidden bg-gray-50 border cursor-pointer transition-all duration-305 ${
                      activeImageIndex === i ? "border-black" : "border-gray-250 opacity-60"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-[45%] xl:w-[40%] bg-white">
          <div className="lg:sticky lg:top-36 py-4">
            <FadeIn>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] tracking-[0.25em] text-gray-400 uppercase font-semibold">
                  {product.category}
                </span>
                <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                <span className="text-[10px] tracking-[0.25em] text-gold uppercase font-semibold">
                  IN STOCK
                </span>
              </div>

              <h1 className="font-serif text-3xl md:text-4xl xl:text-5xl tracking-tight leading-[1.1] mb-6">
                {product.name}
              </h1>

              <p className="text-2xl font-light text-gray-900 mb-8 tracking-wide">
                {formatPrice(product.price)}
              </p>

              <div className="w-full h-px bg-gray-200 mb-8" />

              {showSizes && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] tracking-[0.25em] uppercase text-gray-400 font-semibold">
                      SELECT SIZE (US)
                    </span>
                    <span className="text-[10px] tracking-[0.25em] uppercase text-gray-300 hover:text-black transition-colors cursor-pointer underline">
                      SIZE GUIDE
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {["5", "6", "7", "8"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 border text-xs tracking-wider flex items-center justify-center transition-all duration-300 cursor-pointer ${
                          selectedSize === size
                            ? "border-black bg-black text-white"
                            : "border-gray-200 hover:border-black text-gray-600"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <motion.button
                onClick={handleAddToCart}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4.5 text-[11px] tracking-[0.3em] font-semibold uppercase transition-all duration-500 cursor-pointer shadow-sm ${
                  added
                    ? "bg-gold text-black border border-gold"
                    : "bg-black text-white hover:bg-stone border border-black"
                }`}
                id="add-to-bag"
              >
                {added ? "ADDED TO BAG ✓" : "ADD TO BAG"}
              </motion.button>

              <div className="mt-10 border-t border-gray-100">
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => toggleAccordion("story")}
                    className="w-full py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer group"
                  >
                    <span className="text-[11px] tracking-[0.2em] font-semibold text-gray-800 uppercase group-hover:text-gold transition-colors">
                      THE DESIGN STORY
                    </span>
                    <span className="text-gray-400 text-lg">
                      {activeAccordion === "story" ? "−" : "+"}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {activeAccordion === "story" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 text-sm text-gray-500 font-light leading-relaxed">
                          {product.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="border-b border-gray-100">
                  <button
                    onClick={() => toggleAccordion("specs")}
                    className="w-full py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer group"
                  >
                    <span className="text-[11px] tracking-[0.2em] font-semibold text-gray-800 uppercase group-hover:text-gold transition-colors">
                      SPECIFICATIONS
                    </span>
                    <span className="text-gray-400 text-lg">
                      {activeAccordion === "specs" ? "−" : "+"}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {activeAccordion === "specs" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <ul className="pb-6 space-y-2">
                          {product.details.map((detail, i) => (
                            <li
                              key={i}
                              className="text-sm text-gray-500 font-light flex items-center gap-3"
                            >
                              <span className="w-1.5 h-1.5 bg-gold rounded-full shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="border-b border-gray-100">
                  <button
                    onClick={() => toggleAccordion("shipping")}
                    className="w-full py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer group"
                  >
                    <span className="text-[11px] tracking-[0.2em] font-semibold text-gray-800 uppercase group-hover:text-gold transition-colors">
                      COMPLIMENTARY SERVICES
                    </span>
                    <span className="text-gray-400 text-lg">
                      {activeAccordion === "shipping" ? "−" : "+"}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {activeAccordion === "shipping" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 space-y-4">
                          <p className="text-sm text-gray-500 font-light leading-relaxed">
                            Every AURÈLE creation arrives in our signature leather case, packaged within our secure, anonymous shipping box.
                          </p>
                          <ul className="space-y-2 text-xs text-gray-400 font-light">
                            <li>• Free express courier worldwide (fully tracked)</li>
                            <li>• Lifetime resizing & adjustment support</li>
                            <li>• Certified valuation paperwork included</li>
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 px-6 md:px-12 lg:px-20 py-24 bg-gray-50">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] text-gray-400 tracking-[0.4em] uppercase mb-4">
              Curated Recs
            </p>
            <h2 className="font-serif text-2xl md:text-4xl tracking-tight">
              Recommended Pieces
            </h2>
            <div className="w-10 h-[1px] bg-gold mx-auto mt-5" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendations.map((recommendation, idx) => (
              <ProductCard
                key={recommendation.slug}
                product={recommendation}
                index={idx}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-250 px-6 py-4 flex items-center justify-between shadow-2xl">
        <div>
          <p className="text-xs font-semibold text-gray-800 tracking-wide truncate max-w-[180px]">
            {product.name}
          </p>
          <p className="text-xs font-medium text-gray-900 mt-0.5">
            {formatPrice(product.price)}
          </p>
        </div>
        <motion.button
          onClick={handleAddToCart}
          whileTap={{ scale: 0.98 }}
          className={`px-8 py-3 text-[10px] tracking-[0.25em] font-semibold uppercase transition-all duration-500 cursor-pointer shadow-md ${
            added
              ? "bg-gold text-black"
              : "bg-black text-white hover:bg-stone"
          }`}
          id="add-to-bag-mobile"
        >
          {added ? "ADDED" : "ADD TO BAG"}
        </motion.button>
      </div>
    </div>
  )
}
