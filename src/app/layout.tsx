import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { CartProvider } from "@/components/CartProvider"
import Navigation from "@/components/Navigation"
import CartDrawer from "@/components/CartDrawer"
import Footer from "@/components/Footer"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "AURÈLE — Luxury Jewelry | Timeless Elegance",
  description:
    "Discover handcrafted luxury jewelry by AURÈLE. Exquisite rings, necklaces, bracelets, and earrings designed for the discerning collector. Timeless elegance, modern craftsmanship.",
  openGraph: {
    title: "AURÈLE — Luxury Jewelry",
    description:
      "Handcrafted luxury jewelry for the modern connoisseur. Each piece tells a story of timeless elegance.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col font-sans">
        <CartProvider>
          <Navigation />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
