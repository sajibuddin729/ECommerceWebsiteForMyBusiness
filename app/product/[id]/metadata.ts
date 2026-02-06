import { Metadata } from 'next'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface Product {
    _id: string
    name: string
    description: string
    price: number
    category: string
    images: string[]
    rating: number
    reviewCount: number
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
    stock: number
}

async function getProduct(id: string): Promise<Product | null> {
    try {
        const res = await fetch(`${API_URL}/api/products/${id}`, {
            cache: 'no-store'
        })
        if (!res.ok) return null
        const data = await res.json()
        return data.product
    } catch (error) {
        console.error('Error fetching product:', error)
        return null
    }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const product = await getProduct(params.id)

    if (!product) {
        return {
            title: 'Product Not Found',
            description: 'The product you are looking for could not be found.'
        }
    }

    const title = product.metaTitle || `${product.name} | FusionBytePro`
    const description = product.metaDescription || product.description || `Buy ${product.name} - ${product.category}. Handmade with love. Price: $${product.price}`
    const keywords = product.keywords || [product.name, product.category, 'handmade', 'artisan', 'unique']
    const imageUrl = product.images?.[0] || '/placeholder.jpg'
    const productUrl = `/product/${product._id}`

    return {
        title,
        description,
        keywords,
        authors: [{ name: 'Artisan Market' }],
        openGraph: {
            type: 'website',
            url: productUrl,
            title,
            description,
            images: [{
                url: imageUrl,
                width: 800,
                height: 800,
                alt: product.name,
            }],
            siteName: 'Artisan Market',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        },
        alternates: {
            canonical: productUrl,
        },
        other: {
            // JSON-LD structured data as a string
            'script:ld+json': JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: product.name,
                description: product.description,
                image: product.images,
                offers: {
                    '@type': 'Offer',
                    url: productUrl,
                    priceCurrency: 'USD',
                    price: product.price,
                    availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                    itemCondition: 'https://schema.org/NewCondition',
                },
                aggregateRating: product.reviewCount > 0 ? {
                    '@type': 'AggregateRating',
                    ratingValue: product.rating,
                    reviewCount: product.reviewCount,
                    bestRating: 5,
                    worstRating: 1,
                } : undefined,
                brand: {
                    '@type': 'Brand',
                    name: 'Artisan Market',
                },
                category: product.category,
            }),
        },
    }
}
