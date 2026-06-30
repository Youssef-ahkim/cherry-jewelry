"use client"

import { Product } from "@/types"
import ProductCard from "./ProductCard"
import FadeIn from "./FadeIn"

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <section id="collection" className="px-6 md:px-12 lg:px-20 py-24 md:py-32">
      <FadeIn>
        <div className="text-center mb-16 md:mb-20">
          <p className="text-[11px] text-gray-400 tracking-[0.4em] uppercase mb-4">
            Curated Selection
          </p>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-tight">
            The Collection
          </h2>
          <div className="w-12 h-[1px] bg-gold mx-auto mt-6" />
        </div>
      </FadeIn>

      <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-10 max-w-[1400px] mx-auto">
        {products.map((product, i) => (
          <div
            key={product.slug}
            className="w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-27px)] max-w-[420px]"
          >
            <ProductCard product={product} index={i} />
          </div>
        ))}
      </div>
    </section>
  )
}

