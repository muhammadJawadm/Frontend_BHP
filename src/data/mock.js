// Mock data for MarketHub e-commerce platform

export const mockStores = [
  {
    id: 1,
    name: "TechVault Electronics",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=300&fit=crop&crop=center",
    description: "Premium electronics and gadgets for tech enthusiasts. Authorized dealer for major brands with warranty support.",
    owner_id: 101,
    rating: 4.8,
    total_products: 45
  },
  {
    id: 2,
    name: "StyleCraft Fashion",
    logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop&crop=center",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=300&fit=crop&crop=center",
    description: "Trendy fashion for men and women. Quality clothing at affordable prices with fast shipping.",
    owner_id: 102,
    rating: 4.6,
    total_products: 32
  },
  {
    id: 3,
    name: "HomeEssentials Hub",
    logo: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop&crop=center",
    banner: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=300&fit=crop&crop=center",
    description: "Everything you need for your home. From kitchen essentials to decor items.",
    owner_id: 103,
    rating: 4.7,
    total_products: 28
  },
  {
    id: 4,
    name: "BookWorm Paradise",
    logo: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop&crop=center",
    banner: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=300&fit=crop&crop=center",
    description: "Your one-stop destination for books across all genres. New releases and classics available.",
    owner_id: 104,
    rating: 4.9,
    total_products: 15
  }
];

export const mockProducts = [
  // TechVault Electronics products
  {
    id: 1,
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    price: 299,
    sale_price: 249,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center",
    store_id: 1,
    category: "Electronics",
    in_stock: true,
    rating: 4.8
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracking with heart rate monitor, GPS, and smartphone integration. Water-resistant design.",
    price: 399,
    sale_price: null,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center",
    store_id: 1,
    category: "Electronics",
    in_stock: true,
    rating: 4.7
  },
  {
    id: 3,
    name: "Wireless Gaming Mouse",
    description: "Professional gaming mouse with customizable buttons and RGB lighting. Ultra-responsive for competitive gaming.",
    price: 89,
    sale_price: 69,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop&crop=center",
    store_id: 1,
    category: "Electronics",
    in_stock: true,
    rating: 4.6
  },
  {
    id: 4,
    name: "4K Webcam",
    description: "Ultra HD webcam for streaming and video calls. Auto-focus and built-in microphone included.",
    price: 149,
    sale_price: null,
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&h=400&fit=crop&crop=center",
    store_id: 1,
    category: "Electronics",
    in_stock: true,
    rating: 4.5
  },

  // StyleCraft Fashion products
  {
    id: 5,
    name: "Classic Denim Jacket",
    description: "Timeless denim jacket made from premium cotton. Perfect for casual and smart-casual looks.",
    price: 79,
    sale_price: 59,
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop&crop=center",
    store_id: 2,
    category: "Fashion",
    in_stock: true,
    rating: 4.4
  },
  {
    id: 6,
    name: "Premium Cotton T-Shirt",
    description: "Soft, comfortable cotton t-shirt available in multiple colors. Perfect fit and long-lasting quality.",
    price: 29,
    sale_price: null,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
    store_id: 2,
    category: "Fashion",
    in_stock: true,
    rating: 4.3
  },
  {
    id: 7,
    name: "Designer Sneakers",
    description: "Trendy sneakers with comfortable sole and stylish design. Perfect for everyday wear.",
    price: 119,
    sale_price: 89,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center",
    store_id: 2,
    category: "Fashion",
    in_stock: true,
    rating: 4.7
  },
  {
    id: 8,
    name: "Leather Handbag",
    description: "Elegant leather handbag with multiple compartments. Perfect for work and casual occasions.",
    price: 149,
    sale_price: null,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center",
    store_id: 2,
    category: "Fashion",
    in_stock: true,
    rating: 4.6
  },

  // HomeEssentials Hub products
  {
    id: 9,
    name: "Ceramic Coffee Mug Set",
    description: "Set of 4 beautiful ceramic mugs perfect for coffee, tea, and hot beverages. Dishwasher safe.",
    price: 45,
    sale_price: 35,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=400&fit=crop&crop=center",
    store_id: 3,
    category: "Home",
    in_stock: true,
    rating: 4.5
  },
  {
    id: 10,
    name: "Decorative Table Lamp",
    description: "Modern table lamp with adjustable brightness. Perfect accent lighting for any room.",
    price: 89,
    sale_price: null,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop&crop=center",
    store_id: 3,
    category: "Home",
    in_stock: true,
    rating: 4.4
  },
  {
    id: 11,
    name: "Kitchen Cutting Board Set",
    description: "Bamboo cutting board set with different sizes. Eco-friendly and durable for daily cooking.",
    price: 39,
    sale_price: 29,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center",
    store_id: 3,
    category: "Home",
    in_stock: true,
    rating: 4.6
  },

  // BookWorm Paradise products
  {
    id: 12,
    name: "The Art of Programming",
    description: "Comprehensive guide to modern programming techniques and best practices. Perfect for developers.",
    price: 49,
    sale_price: null,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=400&fit=crop&crop=center",
    store_id: 4,
    category: "Books",
    in_stock: true,
    rating: 4.8
  },
  {
    id: 13,
    name: "Mystery Novel Collection",
    description: "Thrilling mystery novels from bestselling authors. Perfect for mystery lovers and book clubs.",
    price: 29,
    sale_price: 19,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=center",
    store_id: 4,
    category: "Books",
    in_stock: true,
    rating: 4.7
  },
  {
    id: 14,
    name: "Cooking Masterclass",
    description: "Learn professional cooking techniques from world-renowned chefs. Includes recipes and tips.",
    price: 39,
    sale_price: 29,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&crop=center",
    store_id: 4,
    category: "Books",
    in_stock: true,
    rating: 4.6
  },
  {
    id: 15,
    name: "Digital Marketing Guide",
    description: "Complete guide to digital marketing strategies for businesses. Updated with latest trends.",
    price: 34,
    sale_price: null,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center",
    store_id: 4,
    category: "Books",
    in_stock: true,
    rating: 4.5
  }
];

export const mockUsers = [
  // Buyers
  {
    id: 1001,
    name: "John Customer",
    email: "john@example.com",
    role: "customer",
    password: "password123"
  },
  {
    id: 1002,
    name: "Sarah Buyer",
    email: "sarah@example.com", 
    role: "customer",
    password: "password123"
  },
  // Sellers
  {
    id: 101,
    name: "Mike Seller",
    email: "mike@techvault.com",
    role: "store_owner",
    password: "seller123",
    store_id: 1
  },
  {
    id: 102,
    name: "Emma Fashion",
    email: "emma@stylecraft.com",
    role: "store_owner", 
    password: "seller123",
    store_id: 2
  },
  {
    id: 103,
    name: "David Home",
    email: "david@homeessentials.com",
    role: "store_owner",
    password: "seller123",
    store_id: 3
  },
  {
    id: 104,
    name: "Lisa Books",
    email: "lisa@bookworm.com",
    role: "store_owner",
    password: "seller123",
    store_id: 4
  }
];

export const categories = [
  "Electronics",
  "Fashion", 
  "Home",
  "Books",
  "Sports",
  "Beauty",
  "Automotive"
];

// Helper functions
export const getProductsByStore = (storeId) => {
  return mockProducts.filter(product => product.store_id === storeId);
};

export const getStoreById = (storeId) => {
  return mockStores.find(store => store.id === parseInt(storeId));
};

export const getProductById = (productId) => {
  return mockProducts.find(product => product.id === parseInt(productId));
};

export const getUserByEmail = (email) => {
  return mockUsers.find(user => user.email === email);
};

export const getProductsOnSale = () => {
  return mockProducts.filter(product => product.sale_price !== null);
};

export const searchProducts = (query) => {
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  );
};