"use client"

import { useState, useEffect, useCallback } from "react"
import { Loader2, Filter, Grid, List } from "lucide-react"
import Header from "../pages/HomePage/Header"
import Footer from "../pages/HomePage/Footer"
import ProductCard from "../components/ui/product-card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState("grid")

  const fetchProducts = useCallback(async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      setError(null)

      const response = await fetch(`https://buyherpower.onrender.com/api/products?page=${page}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.products) {
        if (append) {
          setProducts((prev) => [...prev, ...data.products])
        } else {
          setProducts(data.products)
        }

        setCurrentPage(data.pagination.current_page)
        setTotalPages(data.pagination.total_pages)
        setTotalProducts(data.pagination.total_products)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      console.error("Error fetching products:", err)
      setError(err.message)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts(1)
  }, [fetchProducts])

  const loadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      fetchProducts(currentPage + 1, true)
    }
  }

  const retry = () => {
    fetchProducts(1)
  }

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading amazing products...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error && products.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Oops! Something went wrong</h2>
              <p className="text-muted-foreground mb-4">We couldn't load the products. Please try again.</p>
              <Button onClick={retry} className="bg-primary hover:bg-primary/90">
                Try Again
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Discover Amazing Products</h1>
          <p className="text-xl text-primary-foreground/90 mb-6 text-pretty max-w-2xl mx-auto">
            Support women entrepreneurs and discover unique handcrafted goods made with love and passion.
          </p>
          {/* <div className="flex items-center justify-center space-x-4 text-sm">
            <Badge variant="secondary" className="bg-secondary/20 text-primary-foreground border-primary-foreground/20">
              {totalProducts} Products
            </Badge>
            <Badge variant="secondary" className="bg-secondary/20 text-primary-foreground border-primary-foreground/20">
              Women-Made
            </Badge>
            <Badge variant="secondary" className="bg-secondary/20 text-primary-foreground border-primary-foreground/20">
              Handcrafted
            </Badge>
          </div> */}
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Filters and View Toggle */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <p className="text-muted-foreground text-sm">
                Showing {products.length} of {totalProducts} products
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div
            className={`grid gap-6 ${
              viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
            }`}
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Load More Button */}
          {currentPage < totalPages && (
            <div className="text-center mt-12">
              <Button onClick={loadMore} disabled={loadingMore} size="lg" className="bg-primary hover:bg-primary/90">
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading More...
                  </>
                ) : (
                  `Load More Products (${totalProducts - products.length} remaining)`
                )}
              </Button>
            </div>
          )}

          {/* End Message */}
          {currentPage >= totalPages && products.length > 0 && (
            <div className="text-center mt-12 py-8 border-t border-border">
              <p className="text-muted-foreground">
                You've seen all {totalProducts} products!
                <span className="block mt-2 text-sm">
                  Check back soon for new arrivals from our amazing women creators.
                </span>
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
