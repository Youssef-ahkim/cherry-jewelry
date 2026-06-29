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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 max-w-[1400px] mx-auto">
        {products.slice(0, 3).map((product, i) => (
          <div
            key={product.slug}
            className={i === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-1" : ""}
          >
            <ProductCard product={product} index={i} />
          </div>
        ))}

        {products.length > 3 && (
          <div className="sm:col-span-2 lg:col-span-2">
            <ProductCard product={products[3]} index={3} />
          </div>
        )}
        {products.length > 4 && (
          <div>
            <ProductCard product={products[4]} index={4} />
          </div>
        )}

        {products.slice(5).map((product, i) => (
          <div key={product.slug}>
            <ProductCard product={product} index={i + 5} />
          </div>
        ))}
      </div>
    </section>
  )
}

