import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getProductBySlug, getAllSlugs, getAllProducts } from "@/lib/products"
import ProductDetailClient from "@/app/product/[slug]/ProductDetailClient"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}

  return {
    title: `${product.name} — CHERRY JEWELRY`,
    description: product.description,
    openGraph: {
      title: `${product.name} — CHERRY JEWELRY`,
      description: product.description,
      images: [product.images[0]],
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const allProducts = await getAllProducts()
  const recommendations = allProducts
    .filter((p) => p.slug !== slug)
    .slice(0, 3)

  return <ProductDetailClient product={product} recommendations={recommendations} />
}


