"use client"

import { useState } from "react"
import { Heart, ShoppingCart, Eye, Star } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default function ProductCard({ product }) {
  const [isLiked, setIsLiked] = useState(false)
  const [imageError, setImageError] = useState(false)

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PKR",
    }).format(price / 1)
  }

  const calculateDiscount = (price, salePrice) => {
    if (!salePrice || salePrice >= price) return 0
    return Math.round(((price - salePrice) / price) * 100)
  }

  const discount = calculateDiscount(product.price, product.sale_price)

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-md">
      <div className="relative overflow-hidden">
        {/* Product Image */}
        <div className="aspect-square bg-muted relative">
          {!imageError && product.images && product.images[0] ? (
            <img
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ShoppingCart className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground text-sm">No image available</p>
              </div>
            </div>
          )}
        </div>

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <Button size="sm" variant="secondary" className="rounded-full w-10 h-10 p-0">
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full w-10 h-10 p-0"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current text-primary" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1">
          {discount > 0 && (
            <Badge variant="destructive" className="text-xs font-semibold">
              -{discount}%
            </Badge>
          )}
          {product.quantity < 5 && (
            <Badge variant="secondary" className="text-xs">
              Low Stock
            </Badge>
          )}
        </div>

        {/* Store Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="text-xs bg-white/90 backdrop-blur-sm">
            {product.store_id?.name || "BHP Store"}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Product Name */}
        <h3 className="font-semibold text-foreground line-clamp-2 text-sm leading-tight">{product.name}</h3>

        {/* Category */}
        <p className="text-xs text-muted-foreground">{product.category}</p>

        {/* Rating (placeholder) */}
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-current text-secondary" />
          ))}
          <span className="text-xs text-muted-foreground ml-1">(4.8)</span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          {product.sale_price && product.sale_price < product.price ? (
            <>
              <span className="font-bold text-primary">{formatPrice(product.sale_price)}</span>
              <span className="text-sm text-muted-foreground line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="font-bold text-primary">{formatPrice(product.price)}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pl-2 space-x-2 pt-2">
            <Link to={`/viewproduct/${product._id}`}>
          <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
            <Eye className="w-4 h-4 mr-2" />
           Get Detail
          </Button>
          </Link>
          <Link to={`/viewproduct/${product._id}`}>
          <Button size="sm" variant="outline" className="px-5 bg-transparent">
            <ShoppingCart className="w-4 h-4" />
            Buy Now
          </Button>
          </Link> 
        </div>
      </CardContent>
    </Card>
  )
}
