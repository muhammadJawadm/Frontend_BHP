import React from 'react';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const navigate = useNavigate();
  
  const categories = [
    { id: 1, name: "Electronics", icon: "📱" },
  { id: 2, name: "Fashion", icon: "👗" },
  { id: 3, name: "Home & Living", icon: "🏠" },
  { id: 4, name: "Beauty & Care", icon: "💄" },
  { id: 5, name: "Sports & Outdoors", icon: "⚽" },
  { id: 6, name: "Books & Media", icon: "📚" },
  { id: 7, name: "Toys & Games", icon: "🧸" },
  { id: 8, name: "Food & Beverages", icon: "🍔" },
  { id: 9, name: "Health & Wellness", icon: "💊" },
  { id: 10, name: "Automotive", icon: "🚗" },
  { id: 11, name: "Pet Supplies", icon: "🐶" },
  { id: 12, name: "Jewelry & Accessories", icon: "💍" }
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/products/category/${categoryName}`);
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-lg text-gray-600">All categories</p>
        </div>
       
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 cursor-pointer transition-colors group transform hover:scale-105"
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-slate-700">{category.name}</h3>
              {/* <p className="text-xs text-gray-500">{category.count}</p> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;