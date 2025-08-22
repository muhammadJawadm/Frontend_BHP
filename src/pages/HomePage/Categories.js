"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown, ChevronUp } from "lucide-react"

const Categories = () => {
  const navigate = useNavigate()
  const [showAll, setShowAll] = useState(false)

  const categories = [
    { id: 1, name: "Handmade Clothing", icon: "👕", gradient: "from-blue-500 to-cyan-500", bgColor: "bg-blue-50" },
    { id: 2, name: "Traditional Textiles", icon: "🧵", gradient: "from-pink-500 to-rose-500", bgColor: "bg-pink-50" },
    {
      id: 3,
      name: "Crochet & Knitting",
      icon: "🧶",
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      id: 4,
      name: "Jewelry & Accessories",
      icon: "💍",
      gradient: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-50",
    },
    {
      id: 5,
      name: "Bags & Purses",
      icon: "👜",
      gradient: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
    },
    { id: 6, name: "Home Decor", icon: "🏡", gradient: "from-indigo-500 to-blue-500", bgColor: "bg-indigo-50" },
    { id: 7, name: "Kitchen & Dining", icon: "🍽️", gradient: "from-yellow-500 to-orange-500", bgColor: "bg-yellow-50" },
    { id: 8, name: "Local Crafts", icon: "🎨", gradient: "from-amber-500 to-yellow-500", bgColor: "bg-amber-50" },
    { id: 9, name: "Organic & Herbal", icon: "🌿", gradient: "from-teal-500 to-green-500", bgColor: "bg-teal-50" },
    { id: 10, name: "Beauty & Care", icon: "💄", gradient: "from-slate-500 to-gray-500", bgColor: "bg-slate-50" },
    {
      id: 11,
      name: "Food & Homemade Items",
      icon: "🍪",
      gradient: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
    },
    {
      id: 12,
      name: "Pet & Kids Items",
      icon: "🧸",
      gradient: "from-violet-500 to-purple-500",
      bgColor: "bg-violet-50",
    },
  ]

  const handleCategoryClick = (categoryName) => {
    navigate(`/products/category/${categoryName}`)
  }

  const displayedCategories = showAll ? categories : categories.slice(0, 6)

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing products across all our carefully curated categories
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {displayedCategories.map((category) => {
            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.name)}
                className={`${category.bgColor} rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 group hover:shadow-2xl hover:-translate-y-2 border border-white/50 backdrop-blur-sm relative overflow-hidden`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}
                ></div>

                <div
                  className={`relative z-10 w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <span className="text-2xl">{category.icon}</span>
                </div>

                <h3 className="relative z-10 font-bold text-gray-900 mb-1 group-hover:text-gray-800 transition-colors duration-300 text-sm leading-tight">
                  {category.name}
                </h3>

                <div className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2">
                  <div className="w-6 h-0.5 bg-gradient-to-r from-gray-400 to-gray-600 mx-auto rounded-full"></div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span className="font-medium">{showAll ? "Show Less" : "Show More"}</span>
            {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </section>
  )
}

export default Categories
