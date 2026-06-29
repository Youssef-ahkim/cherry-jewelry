import { Metadata } from "next"
import SuccessClient from "@/app/checkout/success/SuccessClient"

export const metadata: Metadata = {
  title: "Order Confirmed — CHERRY JEWELRY",
  description: "Your order has been placed successfully.",
}

export default function SuccessPage() {
  return <SuccessClient />
}
