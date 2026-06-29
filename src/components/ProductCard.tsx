"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Product } from "@/types"
import { formatPrice } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  index: number
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
    >
      <Link
        href={`/product/${product.slug}`}
        className="group block"
        id={`product-${product.slug}`}
      >
        <div
          className="relative overflow-hidden bg-gray-100 aspect-[3/4]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-700 ease-out ${
              isHovered ? "scale-105 opacity-0" : "scale-100 opacity-100"
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <Image
            src={product.hoverImage}
            alt={`${product.name} styled`}
            fill
            className={`object-cover transition-all duration-700 ease-out absolute inset-0 ${
              isHovered ? "scale-100 opacity-100" : "scale-105 opacity-0"
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          <div className={`absolute inset-0 bg-black/0 transition-all duration-500 ${isHovered ? "bg-black/10" : ""}`} />

          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-4 left-0 right-0 text-center"
          >
            <span className="inline-block bg-white text-black text-[10px] tracking-[0.2em] px-6 py-2.5">
              VIEW DETAILS
            </span>
          </motion.div>
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase">
            {product.category}
          </p>
          <h3 className="text-sm font-light tracking-wide">{product.name}</h3>
          <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </motion.div>
  )
}
