"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, Menu, X, User, ChevronDown, LogOut, Settings, ShoppingBag } from "lucide-react"
const REACT_APP_API_URL = process.env.REACT_APP_API_URL || "https://buyherpower.onrender.com"

import logo from "../../assets/Black.png"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState(null)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetchUserProfile(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch(`${REACT_APP_API_URL}/api/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user || userData)
      } else {
        // Token might be invalid, remove it
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignInClick = () => {
    if (user) {
      setShowUserDropdown(!showUserDropdown)
    } else {
      navigate("/customer/login")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setShowUserDropdown(false)
    navigate("/")
  }

  const handleSettings = () => {
    setShowUserDropdown(false)
    navigate("/profile/settings")
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserDropdown && !event.target.closest(".user-dropdown-container")) {
        setShowUserDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showUserDropdown])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
          : "bg-gradient-to-r from-white via-gray-50 to-white shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img src={logo} alt="BHP Logo" className="h-24 w-24 object-contain" />
          </div>

          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-0 group-focus-within:opacity-25 transition duration-300"></div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
                </div>
                <input
                  type="text"
                  placeholder="Search products, stores, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg leading-5 bg-white/80 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 hover:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* User Profile Section */}
            <div className="relative user-dropdown-container">
              {isLoading ? (
                <div className="w-10 h-10 animate-pulse bg-gradient-to-r from-purple-200 to-pink-200 rounded-full"></div>
              ) : user ? (
                <button
                  onClick={handleSignInClick}
                  className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 px-4 py-2 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 group"
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">{user.name || "User"}</p>
                    <p className="text-xs text-gray-500">Welcome back!</p>
                  </div>
                  <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform duration-200" />
                </button>
              ) : (
                <button
                  onClick={handleSignInClick}
                  className="flex items-center space-x-2 text-gray-700 hover:text-white px-4 py-2 rounded-xl hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all duration-200 group"
                >
                  <User className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Sign In</span>
                </button>
              )}

              {showUserDropdown && user && (
                <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleSettings}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 flex items-center space-x-3 transition-all duration-200 group"
                  >
                    <Settings className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                    <span>My Orders</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-all duration-200 group"
                  >
                    <LogOut className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            <button className="relative group overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center space-x-2">
                <ShoppingBag className="h-4 w-4" />
                <Link to="/seller/signup">Sell on BHP</Link>
              </span>
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-2 pb-4 space-y-3 bg-white/95 backdrop-blur-md shadow-xl border-t border-gray-100">
            {/* Mobile Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            {/* Mobile User Section */}
            {user ? (
              <div className="space-y-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 pb-3 border-b border-purple-100">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleSettings}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-white/50 rounded-lg transition-colors duration-200"
                >
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </button>
            )}

            <Link to="/seller/signup">
              <button
                className="block w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Sell on BHP
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
