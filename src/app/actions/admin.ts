"use server"

import { db } from "@/db"
import { dbProducts, orders } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

interface AdminState {
  success: boolean
  error?: string
}

import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function addProduct(
  prevState: AdminState | null,
  formData: FormData
): Promise<AdminState> {
  try {
    const name = formData.get("name") as string
    const priceRaw = formData.get("price") as string
    const category = formData.get("category") as string
    const description = formData.get("description") as string
    const detailsRaw = formData.get("details") as string
    const imagesFiles = formData.getAll("images") as File[]

    if (!name || !priceRaw || !category || !description || !detailsRaw || !imagesFiles || imagesFiles.length === 0) {
      return { success: false, error: "All fields are required." }
    }

    const price = parseFloat(priceRaw)
    if (isNaN(price) || price <= 0) {
      return { success: false, error: "Please enter a valid price." }
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    if (!slug) {
      return { success: false, error: "Invalid product name format for slug generation." }
    }

    const detailsArray = detailsRaw
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)

    const imagesArray: string[] = []
    const uploadDir = path.join(process.cwd(), "public", "images", "uploads")
    await mkdir(uploadDir, { recursive: true })

    for (const file of imagesFiles) {
      if (file.size > 0) {
        const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
        const buffer = Buffer.from(await file.arrayBuffer())
        await writeFile(path.join(uploadDir, safeName), buffer)
        imagesArray.push(`/images/uploads/${safeName}`)
      }
    }

    if (imagesArray.length === 0) {
      return { success: false, error: "Please upload at least one valid image file." }
    }

    await db.insert(dbProducts).values({
      slug,
      name,
      price: price.toFixed(2),
      category,
      description,
      details: JSON.stringify(detailsArray),
      images: JSON.stringify(imagesArray),
    })

    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true }
  } catch (error: any) {
    console.error("Add product error:", error)
    if (error?.code === "ER_DUP_ENTRY" || error?.message?.includes("Duplicate entry")) {
      return { success: false, error: "A product with a similar name or slug already exists." }
    }
    return { success: false, error: "Failed to add product. Ensure database table exists." }
  }
}

export async function updateOrderStatus(
  orderId: number,
  status: "pending" | "confirmed" | "delivered" | "cancelled"
): Promise<{ success: boolean; error?: string }> {
  try {
    await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, orderId))

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Update order status error:", error)
    return { success: false, error: "Failed to update order status." }
  }
}

export async function updateProduct(
  slug: string,
  prevState: AdminState | null,
  formData: FormData
): Promise<AdminState> {
  try {
    const name = formData.get("name") as string
    const priceRaw = formData.get("price") as string
    const category = formData.get("category") as string
    const description = formData.get("description") as string
    const detailsRaw = formData.get("details") as string
    const imagesFiles = formData.getAll("images") as File[]

    if (!name || !priceRaw || !category || !description || !detailsRaw) {
      return { success: false, error: "All fields are required." }
    }

    const price = parseFloat(priceRaw)
    if (isNaN(price) || price <= 0) {
      return { success: false, error: "Please enter a valid price." }
    }

    const detailsArray = detailsRaw
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)

    const newSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    if (!newSlug) {
      return { success: false, error: "Invalid product name format for slug generation." }
    }

    let imagesArray: string[] = []
    const existing = await db.select().from(dbProducts).where(eq(dbProducts.slug, slug)).limit(1)
    if (existing.length > 0) {
      imagesArray = JSON.parse(existing[0].images)
    }

    const uploadDir = path.join(process.cwd(), "public", "images", "uploads")
    await mkdir(uploadDir, { recursive: true })

    const uploadedImages: string[] = []
    for (const file of imagesFiles) {
      if (file.size > 0) {
        const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
        const buffer = Buffer.from(await file.arrayBuffer())
        await writeFile(path.join(uploadDir, safeName), buffer)
        uploadedImages.push(`/images/uploads/${safeName}`)
      }
    }

    if (uploadedImages.length > 0) {
      imagesArray = uploadedImages
    }

    if (imagesArray.length === 0) {
      return { success: false, error: "Product must have at least one image." }
    }

    await db
      .update(dbProducts)
      .set({
        slug: newSlug,
        name,
        price: price.toFixed(2),
        category,
        description,
        details: JSON.stringify(detailsArray),
        images: JSON.stringify(imagesArray),
      })
      .where(eq(dbProducts.slug, slug))

    revalidatePath("/")
    revalidatePath("/admin")
    revalidatePath(`/product/${slug}`)
    revalidatePath(`/product/${newSlug}`)
    return { success: true }
  } catch (error) {
    console.error("Update product error:", error)
    return { success: false, error: "Failed to update product." }
  }
}

export async function deleteProduct(slug: string): Promise<{ success: boolean; error?: string }> {
  try {
    await db.delete(dbProducts).where(eq(dbProducts.slug, slug))
    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Delete product error:", error)
    return { success: false, error: "Failed to delete product." }
  }
}

