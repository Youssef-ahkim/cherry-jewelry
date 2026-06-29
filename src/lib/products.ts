import { Product } from "@/types"

export const products: Product[] = []

export async function getAllProducts(): Promise<Product[]> {
  try {
    const { db } = await import("@/db")
    const { dbProducts } = await import("@/db/schema")
    const dbItems = await db.select().from(dbProducts)
    
    const formattedDbItems: Product[] = dbItems.map((item) => {
      let parsedDetails: string[] = []
      let parsedImages: string[] = []
      try {
        parsedDetails = JSON.parse(item.details)
      } catch {
        parsedDetails = item.details.split("\n").filter(Boolean)
      }
      try {
        parsedImages = JSON.parse(item.images)
      } catch {
        parsedImages = item.images.split(",").map((s) => s.trim()).filter(Boolean)
      }
      return {
        slug: item.slug,
        name: item.name,
        price: Number(item.price),
        category: item.category,
        description: item.description,
        details: parsedDetails,
        images: parsedImages.length ? parsedImages : ["/images/hero.png"],
        hoverImage: parsedImages[1] || parsedImages[0] || "/images/hero.png",
      }
    })
    return [...products, ...formattedDbItems]
  } catch (error) {
    console.error("Error fetching database products:", error)
    return products
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const all = await getAllProducts()
  return all.find((p) => p.slug === slug)
}

export async function getAllSlugs(): Promise<string[]> {
  const all = await getAllProducts()
  return all.map((p) => p.slug)
}

