import { Metadata } from "next"
import CheckoutClient from "./CheckoutClient"

export const metadata: Metadata = {
  title: "Checkout — CHERRY JEWELRY",
  description: "Complete your order with Cash on Delivery.",
}

export default function CheckoutPage() {
  return <CheckoutClient />
}
