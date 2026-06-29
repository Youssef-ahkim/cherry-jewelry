import { db } from "@/db"
import { orders, orderItems, dbProducts } from "@/db/schema"
import { desc } from "drizzle-orm"
import AdminClient from "./AdminClient"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminPage() {
  let ordersList: any[] = []
  let productsList: any[] = []
  let isDbConfigured = true

  try {
    const rawOrders = await db.select().from(orders).orderBy(desc(orders.createdAt))
    const rawItems = await db.select().from(orderItems)
    ordersList = rawOrders.map((order) => ({
      ...order,
      id: Number(order.id),
      items: rawItems.filter((item) => Number(item.orderId) === Number(order.id)),
    }))
  } catch (error) {
    console.error("Admin page error loading orders:", error)
  }

  try {
    productsList = await db.select().from(dbProducts)
  } catch (error) {
    isDbConfigured = false
    console.error("Admin page error loading products:", error)
  }

  return (
    <AdminClient
      initialOrders={ordersList}
      initialProducts={productsList}
      isDbConfigured={isDbConfigured}
    />
  )
}
