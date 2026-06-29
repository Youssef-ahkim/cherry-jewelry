"use client"

import Link from "next/link"
import FadeIn from "./FadeIn"

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            <div className="md:col-span-1">
              <h3 className="font-serif text-2xl tracking-[0.15em] mb-4">
                CHERRY JEWELRY
              </h3>
              <p className="text-white/40 text-sm font-light leading-relaxed max-w-xs">
                Handcrafted luxury jewelry for the modern connoisseur. Each piece tells a story of timeless elegance.
              </p>
            </div>

            <div>
              <h4 className="text-[11px] tracking-[0.3em] uppercase mb-6 text-white/60">
                Collections
              </h4>
              <ul className="space-y-3">
                {["Rings", "Necklaces", "Bracelets", "Earrings"].map((item) => (
                  <li key={item}>
                    <Link
                      href="/#collection"
                      className="text-white/40 text-sm font-light hover:text-white transition-colors duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] tracking-[0.3em] uppercase mb-6 text-white/60">
                About
              </h4>
              <ul className="space-y-3">
                {["Our Story", "Craftsmanship", "Sustainability", "Press"].map(
                  (item) => (
                    <li key={item}>
                      <span className="text-white/40 text-sm font-light hover:text-white transition-colors duration-300 cursor-pointer">
                        {item}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] tracking-[0.3em] uppercase mb-6 text-white/60">
                Contact
              </h4>
              <ul className="space-y-3">
                <li className="text-white/40 text-sm font-light">
                  contact@cherryjewelry.com
                </li>
                <li className="text-white/40 text-sm font-light">
                  +1 (555) 012-3456
                </li>
                <li className="text-white/40 text-sm font-light">
                  New York, NY
                </li>
              </ul>
            </div>
          </div>
        </FadeIn>

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-[11px] tracking-[0.15em]">
            © {new Date().getFullYear()} CHERRY JEWELRY. ALL RIGHTS RESERVED.
          </p>

          <div className="flex items-center gap-6">
            {["Instagram", "Pinterest", "Twitter"].map((social) => (
              <span
                key={social}
                className="text-white/30 text-[11px] tracking-[0.15em] hover:text-white/60 transition-colors duration-300 cursor-pointer"
              >
                {social.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
