"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const menuLinks = [
  { label: "HOME", href: "/" },
  { label: "COLLECTIONS", href: "/#collection" },
  { label: "RINGS", href: "/#collection" },
  { label: "NECKLACES", href: "/#collection" },
  { label: "BRACELETS", href: "/#collection" },
  { label: "EARRINGS", href: "/#collection" },
]

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-6 text-white cursor-pointer"
            aria-label="Close menu"
            id="menu-close"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <nav className="flex flex-col items-center gap-8">
            {menuLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="mobile-menu-link text-2xl md:text-4xl font-serif tracking-[0.2em]"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-10 text-white/40 text-[11px] tracking-[0.3em]"
          >
            CHERRY JEWELRY — TIMELESS ELEGANCE
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
