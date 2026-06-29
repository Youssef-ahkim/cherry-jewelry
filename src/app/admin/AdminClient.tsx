"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { addProduct, updateOrderStatus, updateProduct, deleteProduct } from "@/app/actions/admin"
import { formatPrice } from "@/lib/utils"

interface AdminClientProps {
  initialOrders: any[]
  initialProducts: any[]
  isDbConfigured: boolean
}

export default function AdminClient({
  initialOrders,
  initialProducts,
  isDbConfigured,
}: AdminClientProps) {
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders")
  const [ordersState, setOrdersState] = useState(initialOrders)
  const [productsState, setProductsState] = useState(initialProducts)
  const [editingProduct, setEditingProduct] = useState<any | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = async (orderId: number, newStatus: any) => {
    const originalOrders = [...ordersState]
    setOrdersState((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    )

    const res = await updateOrderStatus(orderId, newStatus)
    if (!res.success) {
      alert(res.error || "Failed to update status")
      setOrdersState(originalOrders)
    }
  }

  const handleDeleteProduct = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return
    }

    const res = await deleteProduct(slug)
    if (res.success) {
      setProductsState((prev) => prev.filter((p) => p.slug !== slug))
      if (editingProduct?.slug === slug) {
        setEditingProduct(null)
      }
    } else {
      alert(res.error || "Failed to delete product")
    }
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)
    setFormSuccess(false)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      let res
      if (editingProduct) {
        res = await updateProduct(editingProduct.slug, null, formData)
      } else {
        res = await addProduct(null, formData)
      }

      if (res.success) {
        setFormSuccess(true)
        const name = formData.get("name") as string
        const price = parseFloat(formData.get("price") as string).toFixed(2)
        const category = formData.get("category") as string
        const description = formData.get("description") as string
        const detailsRaw = formData.get("details") as string
        const detailsArray = detailsRaw.split("\n").map((s) => s.trim()).filter(Boolean)

        if (editingProduct) {
          setProductsState((prev) =>
            prev.map((p) =>
              p.slug === editingProduct.slug
                ? {
                    ...p,
                    name,
                    price,
                    category,
                    description,
                    details: JSON.stringify(detailsArray),
                  }
                : p
            )
          )
          setEditingProduct(null)
        } else {
          const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
          const newProduct = {
            slug,
            name,
            price,
            category,
            description,
            details: JSON.stringify(detailsArray),
            images: JSON.stringify([]),
          }
          setProductsState((prev) => [...prev, newProduct])
          ;(e.target as HTMLFormElement).reset()
        }
      } else {
        setFormError(res.error || "Failed to save product.")
      }
    })
  }

  return (
    <div className="min-h-screen pb-24 px-6 md:px-12 lg:px-20" style={{ paddingTop: "140px", backgroundColor: "#FAF5F0" }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-8 mb-12 gap-6">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl tracking-tight mb-2">
              Management Portal
            </h1>
            <p className="text-gray-500 text-sm font-light">
              Add products and manage incoming customer orders
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-3 text-xs tracking-widest font-bold transition-all border ${
                activeTab === "orders"
                  ? "bg-black text-white border-black"
                  : "bg-transparent text-gray-500 border-gray-200 hover:border-black"
              }`}
            >
              ORDERS ({ordersState.length})
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`px-6 py-3 text-xs tracking-widest font-bold transition-all border ${
                activeTab === "products"
                  ? "bg-black text-white border-black"
                  : "bg-transparent text-gray-500 border-gray-200 hover:border-black"
              }`}
            >
              PRODUCTS ({productsState.length})
            </button>
          </div>
        </div>

        {!isDbConfigured && (
          <div className="bg-red-50 border border-red-200 p-6 mb-10 max-w-3xl">
            <h3 className="text-red-800 font-bold text-sm mb-2">
              Database Table Missing!
            </h3>
            <p className="text-red-700 text-xs font-light leading-relaxed mb-4">
              The `products` table does not exist in your XAMPP database. Run the following SQL script to create it:
            </p>
            <pre className="bg-white border border-red-150 p-4 text-[11px] font-mono overflow-x-auto text-gray-700">
{`CREATE TABLE products (
  slug VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  details TEXT NOT NULL,
  images TEXT NOT NULL,
  PRIMARY KEY (slug)
);`}
            </pre>
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === "orders" ? (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {ordersState.length === 0 ? (
                <div className="bg-white border border-gray-200 p-16 text-center">
                  <p className="text-gray-400 text-sm font-light">No orders found.</p>
                </div>
              ) : (
                ordersState.map((order) => (
                  <div key={order.id} className="bg-white border border-gray-200 p-6 md:p-8 flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row justify-between border-b border-gray-100 pb-4 gap-4">
                      <div>
                        <div className="flex items-center gap-4">
                          <h3 className="font-serif text-lg">Order #{order.id}</h3>
                          <span
                            className={`px-3 py-1 text-[9px] font-bold tracking-widest uppercase rounded border ${
                              order.status === "pending"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : order.status === "confirmed"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : order.status === "delivered"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">
                          Placed on: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="text-[10px] tracking-wider text-gray-400 uppercase font-bold">
                          Update Status:
                        </label>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="border border-gray-200 bg-white px-3 py-1.5 text-xs focus:outline-none focus:border-black cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-4 space-y-2">
                        <h4 className="text-[10px] tracking-[0.2em] uppercase text-gray-450 font-bold mb-3">
                          Customer details
                        </h4>
                        <p className="text-sm font-semibold">
                          {order.firstName} {order.lastName}
                        </p>
                        <p className="text-sm text-gray-500">Phone: {order.phone}</p>
                        <p className="text-sm text-gray-500">
                          {order.address}, {order.city}
                        </p>
                      </div>

                      <div className="lg:col-span-8 flex flex-col justify-between">
                        <div>
                          <h4 className="text-[10px] tracking-[0.2em] uppercase text-gray-450 font-bold mb-3">
                            Items Ordered
                          </h4>
                          <div className="divide-y divide-gray-100">
                            {order.items?.map((item: any) => (
                              <div key={item.id} className="py-2.5 flex justify-between text-sm">
                                <div>
                                  <span className="font-light">{item.productName}</span>
                                  <span className="text-gray-400 text-xs ml-2">x {item.quantity}</span>
                                </div>
                                <span className="font-medium">{formatPrice(Number(item.price) * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4 mt-6 flex justify-between items-center">
                          <span className="text-[10px] tracking-widest uppercase font-bold text-gray-400">
                            Total amount
                          </span>
                          <span className="text-xl font-serif text-gold">
                            {formatPrice(Number(order.totalAmount))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              <div className="lg:col-span-7 bg-white border border-gray-200 p-8 md:p-10">
                <h3 className="font-serif text-2xl mb-6">
                  {editingProduct ? `Edit Product` : "Add New Product"}
                </h3>

                <form
                  onSubmit={handleFormSubmit}
                  key={editingProduct ? editingProduct.slug : "new"}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] text-black font-bold uppercase mb-3">
                        Product Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        defaultValue={editingProduct ? editingProduct.name : ""}
                        className="w-full border-2 border-gray-300 px-5 py-4 text-sm font-light bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300"
                        placeholder="e.g. Blossom Diamond Ring"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] tracking-[0.2em] text-black font-bold uppercase mb-3">
                        Price (USD)
                      </label>
                      <input
                        type="number"
                        name="price"
                        required
                        step="0.01"
                        min="1"
                        defaultValue={editingProduct ? editingProduct.price : ""}
                        className="w-full border-2 border-gray-300 px-5 py-4 text-sm font-light bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300"
                        placeholder="e.g. 3500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] text-black font-bold uppercase mb-3">
                      Category
                    </label>
                    <select
                      name="category"
                      required
                      defaultValue={editingProduct ? editingProduct.category : "Rings"}
                      className="w-full border-2 border-gray-300 px-5 py-4 text-sm font-light bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 cursor-pointer"
                    >
                      <option value="Rings">Rings</option>
                      <option value="Necklaces">Necklaces</option>
                      <option value="Bracelets">Bracelets</option>
                      <option value="Earrings">Earrings</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] text-black font-bold uppercase mb-3">
                      Description
                    </label>
                    <textarea
                      name="description"
                      required
                      rows={3}
                      defaultValue={editingProduct ? editingProduct.description : ""}
                      className="w-full border-2 border-gray-300 px-5 py-4 text-sm font-light bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 resize-none"
                      placeholder="Enter a descriptive summary of the luxury piece..."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] text-black font-bold uppercase mb-3">
                      Product Details (One per line)
                    </label>
                    <textarea
                      name="details"
                      required
                      rows={4}
                      defaultValue={
                        editingProduct
                          ? (() => {
                              try {
                                return JSON.parse(editingProduct.details).join("\n")
                              } catch {
                                return editingProduct.details
                              }
                            })()
                          : ""
                      }
                      className="w-full border-2 border-gray-300 px-5 py-4 text-sm font-light bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 resize-none"
                      placeholder="e.g.&#10;18k Rose Gold&#10;0.5ct Brilliant Cut Pink Diamond&#10;Handcrafted in New York"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] text-black font-bold uppercase mb-3">
                      Upload Product Images {editingProduct && "(Optional)"}
                    </label>
                    <input
                      type="file"
                      name="images"
                      accept="image/*"
                      multiple
                      required={!editingProduct}
                      className="w-full border-2 border-gray-300 px-5 py-4 text-sm font-light bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 cursor-pointer"
                    />
                    <p className="text-[10px] text-gray-400 mt-2 font-light">
                      {editingProduct
                        ? "Select new image files to replace the existing ones, or leave blank to keep them."
                        : "Select one or multiple image files from your PC."}
                    </p>
                  </div>

                  {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3">
                      {formError}
                    </div>
                  )}

                  {formSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-3">
                      Product saved successfully! It is now live in the collection.
                    </div>
                  )}

                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full bg-black text-white text-xs tracking-[0.25em] py-5 font-bold hover:bg-stone transition-all duration-300 disabled:opacity-50 cursor-pointer mt-4"
                    >
                      {isPending
                        ? editingProduct
                          ? "UPDATING PRODUCT..."
                          : "ADDING PRODUCT..."
                        : editingProduct
                        ? "UPDATE PRODUCT DETAILS"
                        : "ADD PRODUCT TO SYSTEM"}
                    </button>

                    {editingProduct && (
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="w-full bg-gray-200 text-black text-xs tracking-[0.25em] py-5 font-bold hover:bg-gray-300 transition-all duration-300 cursor-pointer"
                      >
                        CANCEL EDITING
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-gray-200 p-6">
                  <h3 className="font-serif text-xl mb-4">Active Database Products</h3>
                  <div className="divide-y divide-gray-150 max-h-[600px] overflow-y-auto pr-2">
                    {productsState.length === 0 ? (
                      <p className="text-gray-400 text-xs font-light py-4">No database products live yet.</p>
                    ) : (
                      productsState.map((product) => (
                        <div key={product.slug} className="py-4 flex justify-between items-start gap-4">
                          <div>
                            <p className="text-sm font-semibold">{product.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">{product.category}</p>
                            <p className="text-xs font-serif text-gold mt-1.5">{formatPrice(Number(product.price))}</p>
                          </div>
                          <div className="flex gap-3 shrink-0">
                            <button
                              onClick={() => {
                                setEditingProduct(product)
                                window.scrollTo({ top: 0, behavior: "smooth" })
                              }}
                              className="text-[10px] tracking-wider text-blue-600 hover:underline font-bold uppercase cursor-pointer"
                            >
                              Edit
                            </button>
                            <span className="text-gray-200">|</span>
                            <button
                              onClick={() => handleDeleteProduct(product.slug)}
                              className="text-[10px] tracking-wider text-red-600 hover:underline font-bold uppercase cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
