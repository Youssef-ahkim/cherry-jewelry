import Image from "next/image"
import Link from "next/link"
import HeroSection from "@/components/HeroSection"
import ProductGrid from "@/components/ProductGrid"
import ParallaxImage from "@/components/ParallaxImage"
import FadeIn from "@/components/FadeIn"
import { getAllProducts } from "@/lib/products"

export default async function HomePage() {
  const productsList = await getAllProducts()

  return (
    <>
      <HeroSection />

      <ProductGrid products={productsList} />

      <section className="relative">
        <ParallaxImage speed={0.2} className="h-[60vh] md:h-[80vh]">
          <Image
            src="/images/editorial.png"
            alt="AURÈLE editorial"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
        </ParallaxImage>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
          <FadeIn>
            <p className="text-white/60 text-[11px] tracking-[0.4em] uppercase mb-4">
              The Art of Adornment
            </p>
            <h2 className="text-white font-serif text-3xl md:text-5xl lg:text-6xl tracking-tight mb-6">
              Crafted to Endure
            </h2>
            <p className="text-white/50 text-sm md:text-base font-light max-w-lg mx-auto leading-relaxed mb-10">
              Every piece in the AURÈLE collection is meticulously handcrafted by
              master artisans, using only the finest precious metals and
              ethically sourced gemstones.
            </p>
            <Link
              href="/#collection"
              className="inline-block border border-white/30 text-white text-[11px] tracking-[0.3em] px-10 py-4 hover:bg-white hover:text-black transition-all duration-500"
            >
              EXPLORE
            </Link>
          </FadeIn>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-20 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto">
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 text-center">
              <div>
                <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 className="text-[12px] tracking-[0.3em] uppercase mb-3">
                  Complimentary Shipping
                </h3>
                <p className="text-gray-400 text-sm font-light">
                  Free worldwide delivery on all orders, beautifully packaged
                  in our signature boxes.
                </p>
              </div>

              <div>
                <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className="text-[12px] tracking-[0.3em] uppercase mb-3">
                  Lifetime Guarantee
                </h3>
                <p className="text-gray-400 text-sm font-light">
                  Every AURÈLE piece comes with our lifetime craftsmanship
                  guarantee and certificate.
                </p>
              </div>

              <div>
                <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                </div>
                <h3 className="text-[12px] tracking-[0.3em] uppercase mb-3">
                  Ethically Sourced
                </h3>
                <p className="text-gray-400 text-sm font-light">
                  All gemstones and precious metals are responsibly sourced
                  and fully traceable.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
