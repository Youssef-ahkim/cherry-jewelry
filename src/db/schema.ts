import {
  mysqlTable,
  serial,
  varchar,
  text,
  decimal,
  int,
  timestamp,
  mysqlEnum,
} from "drizzle-orm/mysql-core"

export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  address: text("address").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", [
    "pending",
    "confirmed",
    "delivered",
    "cancelled",
  ])
    .default("pending")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const orderItems = mysqlTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: int("order_id").notNull(),
  productSlug: varchar("product_slug", { length: 100 }).notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: int("quantity").notNull(),
})
