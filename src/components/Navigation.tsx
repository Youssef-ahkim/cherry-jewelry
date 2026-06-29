"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { useCart } from "./CartProvider"
import MobileMenu from "@/components/MobileMenu"


const navLinks = [
  { label: "COLLECTIONS", href: "/#collection" },
  { label: "RINGS", href: "/#collection" },
  { label: "NECKLACES", href: "/#collection" },
  { label: "BRACELETS", href: "/#collection" },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { toggleCart, itemCount } = useCart()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50)
  })

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/95 backdrop-blur-md border-b border-white/10 py-3"
            : "bg-black/30 backdrop-blur-sm border-b border-white/5 py-5"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none -z-10" />

        <nav className="flex items-center justify-between px-6 md:px-12">
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col gap-[8px] cursor-pointer group z-50 focus:outline-none"
            aria-label="Open menu"
            id="menu-toggle"
          >
            <span className="block w-10 h-[2.5px] bg-white transition-all duration-300 group-hover:w-14" />
            <span className="block w-10 h-[2.5px] bg-white transition-all duration-300 group-hover:w-8" />
            <span className="block w-10 h-[2.5px] bg-white transition-all duration-300 group-hover:w-11" />
          </button>

          <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="nav-link-custom text-[11px] tracking-[0.25em] font-semibold focus:outline-none"
              >
                {link.label}
              </Link>
            ))}

            <Link href="/" className="mx-8 focus:outline-none">
              <h1 className="text-white text-lg md:text-xl lg:text-2xl font-serif tracking-[0.18em] whitespace-nowrap hover:text-gold transition-colors duration-300">
                CHERRY JEWELRY
              </h1>
            </Link>

            {navLinks.slice(2).map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="nav-link-custom text-[11px] tracking-[0.25em] font-semibold focus:outline-none"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link href="/" className="lg:hidden absolute left-1/2 -translate-x-1/2 focus:outline-none">
            <h1 className="text-white text-base md:text-lg font-serif tracking-[0.18em] whitespace-nowrap">
              CHERRY JEWELRY
            </h1>
          </Link>

          <button
            onClick={toggleCart}
            className="relative cursor-pointer z-50 focus:outline-none"
            aria-label="Open cart"
            id="cart-toggle"
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-white transition-transform duration-300 hover:scale-110 hover:text-gold"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-5.5 h-5.5 bg-gold text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg"
              >
                {itemCount}
              </motion.span>
            )}
          </button>
        </nav>
      </motion.header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
