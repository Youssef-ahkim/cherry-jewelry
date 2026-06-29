import { Product } from "@/types"

export const products: Product[] = [
  {
    slug: "celestial-diamond-ring",
    name: "Celestial Diamond Ring",
    price: 4200,
    category: "Rings",
    description:
      "A breathtaking solitaire diamond set in an 18k gold band, designed to capture and refract light from every angle. The Celestial Ring is an ode to eternal brilliance, handcrafted by our master artisans in Antwerp.",
    details: [
      "18k Yellow Gold",
      "1.2ct Round Brilliant Diamond",
      "VS1 Clarity, F Color",
      "Handset in a six-prong cathedral setting",
      "Comfort-fit band",
    ],
    images: ["/images/ring-celestial-1.png", "/images/ring-celestial-2.png"],
    hoverImage: "/images/ring-celestial-2.png",
  },
  {
    slug: "serpentine-gold-bangle",
    name: "Serpentine Gold Bangle",
    price: 2800,
    category: "Bracelets",
    description:
      "Inspired by ancient serpentine motifs, this sculptural bangle wraps the wrist in liquid gold. Each curve is hand-hammered to achieve a textured finish that catches the light with organic fluidity.",
    details: [
      "22k Yellow Gold",
      "Hand-hammered finish",
      "Serpent-head detailing",
      "Interior circumference: 6.5 inches",
      "Weight: 42g",
    ],
    images: [
      "/images/bangle-serpentine-1.png",
      "/images/bangle-serpentine-2.png",
    ],
    hoverImage: "/images/bangle-serpentine-2.png",
  },
  {
    slug: "midnight-pearl-necklace",
    name: "Midnight Pearl Necklace",
    price: 6500,
    category: "Necklaces",
    description:
      "Rare Tahitian pearls, each selected for their deep midnight luster, are strung on an 18k gold chain with invisible silk knotting. A statement of quiet, undeniable luxury.",
    details: [
      "Tahitian Black Pearls, 9-11mm",
      "18k Gold Clasp",
      "Silk-knotted strand",
      "Length: 18 inches",
      "Certificate of Authenticity included",
    ],
    images: [
      "/images/necklace-pearl-1.png",
      "/images/necklace-pearl-2.png",
    ],
    hoverImage: "/images/necklace-pearl-2.png",
  },
  {
    slug: "eclipse-onyx-earrings",
    name: "Eclipse Onyx Earrings",
    price: 1900,
    category: "Earrings",
    description:
      "Polished black onyx drops suspended from sculptural gold settings. The Eclipse Earrings embody the dramatic contrast between darkness and light, shadow and radiance.",
    details: [
      "18k Yellow Gold",
      "Natural Black Onyx",
      "Post-back closure",
      "Drop length: 2.5 inches",
      "Weight: 8g each",
    ],
    images: ["/images/earrings-onyx-1.png", "/images/earrings-onyx-2.png"],
    hoverImage: "/images/earrings-onyx-2.png",
  },
  {
    slug: "sovereign-chain-necklace",
    name: "Sovereign Chain Necklace",
    price: 3400,
    category: "Necklaces",
    description:
      "Bold, architectural links form a chain that commands attention. The Sovereign Necklace is a modern heirloom — substantial, structural, and unmistakably powerful.",
    details: [
      "18k Yellow Gold",
      "Handcrafted link chain",
      "Lobster clasp closure",
      "Length: 20 inches",
      "Weight: 65g",
    ],
    images: [
      "/images/necklace-chain-1.png",
      "/images/necklace-chain-2.png",
    ],
    hoverImage: "/images/necklace-chain-2.png",
  },
  {
    slug: "eternal-band-ring",
    name: "Eternal Band Ring",
    price: 2100,
    category: "Rings",
    description:
      "A continuous band of pavé-set diamonds encircles the finger in an unbroken line of light. The Eternal Band is simplicity elevated to its most radiant form.",
    details: [
      "18k Yellow Gold",
      "0.8ct Total Diamond Weight",
      "Pavé setting, 32 stones",
      "Band width: 3mm",
      "Available in sizes 5-9",
    ],
    images: ["/images/ring-eternal-1.png", "/images/ring-eternal-2.png"],
    hoverImage: "/images/ring-eternal-2.png",
  },
  {
    slug: "riviera-diamond-bracelet",
    name: "Riviera Diamond Bracelet",
    price: 8200,
    category: "Bracelets",
    description:
      "An uninterrupted line of brilliant-cut diamonds set in white gold. The Riviera Bracelet is the definition of understated opulence — a river of fire for the wrist.",
    details: [
      "18k White Gold",
      "5.0ct Total Diamond Weight",
      "Brilliant-cut stones",
      "Box clasp with safety",
      "Length: 7 inches",
    ],
    images: [
      "/images/bracelet-riviera-1.png",
      "/images/bracelet-riviera-2.png",
    ],
    hoverImage: "/images/bracelet-riviera-2.png",
  },
  {
    slug: "aurora-drop-earrings",
    name: "Aurora Drop Earrings",
    price: 3600,
    category: "Earrings",
    description:
      "Graceful gold drops adorned with diamond accents that catch the light like the first rays of dawn. The Aurora Earrings move with effortless elegance.",
    details: [
      "18k Yellow Gold",
      "0.4ct Diamond Accents",
      "Lever-back closure",
      "Drop length: 3 inches",
      "Weight: 6g each",
    ],
    images: [
      "/images/earrings-aurora-1.png",
      "/images/earrings-aurora-2.png",
    ],
    hoverImage: "/images/earrings-aurora-2.png",
  },
]

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

