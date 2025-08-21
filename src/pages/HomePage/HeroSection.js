import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      id: 1,
      title: "Mega Sale Up to 70% Off",
      subtitle: "Electronics & Gadgets",
      description: "Discover amazing deals on smartphones, laptops, and accessories",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop",
      buttonText: "Shop Electronics",
      bgColor: "from-blue-600 to-purple-700"
    },
    {
      id: 2,
      title: "Fashion Week Special",
      subtitle: "Latest Trends & Styles",
      description: "Get the latest fashion trends with free shipping worldwide",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
      buttonText: "Shop Fashion",
      bgColor: "from-pink-500 to-rose-600"
    },
    {
      id: 3,
      title: "Home Makeover Sale",
      subtitle: "Transform Your Space",
      description: "Premium home decor and furniture at unbeatable prices",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop",
      buttonText: "Shop Home",
      bgColor: "from-green-500 to-teal-600"
    }
  ];

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section className="relative h-96 md:h-[500px] overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}
        >
          <div className={`bg-gradient-to-r ${slide.bgColor} h-full`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
              <div className="flex items-center h-full">
                <div className="w-full md:w-1/2 text-white">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                  <h2 className="text-xl md:text-2xl mb-4 opacity-90">{slide.subtitle}</h2>
                  <p className="text-lg mb-8 opacity-80">{slide.description}</p>
                </div>
                <div className="hidden md:block w-1/2">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-80 object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slider Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slider Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;