"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Pause, Users, Smartphone, Shirt, Home, ShoppingBag } from "lucide-react"

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const heroSlides = [
    {
      id: 1,
      title: "Empower Creators",
      subtitle: "Women-Led Handcrafted Goods",
      description:
        "Shop unique handmade products crafted by inspiring women. Support local creators and get direct access to one-of-a-kind items made with passion.",
      image: "https://images.unsplash.com/photo-1618587194716-40490bdba417?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      bgColor: "from-pink-600 via-pink-500 to-rose-600",
      accentColor: "bg-pink-400",
      icon: Users,
    },
    {
      id: 2,
      title: "Promote Local Industry",
      subtitle: "Sustainablity & Community",
      description:
        "Every purchase helps sustain traditional skills and local economies. Join us in preserving heritage and building sustainable livelihoods in our region.",
      image: "https://plus.unsplash.com/premium_photo-1676486613378-2686513db6be?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      bgColor: "from-pink-500 via-rose-600 to-red-700",
      accentColor: "bg-pink-400",
      icon: Shirt,
    },
    {
      id: 3,
      title: "Shop with Purpose",
      subtitle: "Women-Made Collections",
      description:
        "Discover handcrafted fashion, jewelry, and lifestyle products made by women entrepreneurs. Every purchase empowers a dream.",
      image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      bgColor: "from-pink-600 via-rose-600 to-red-700",
      accentColor: "bg-pink-400",
      icon: ShoppingBag,
    },
  ]

  useEffect(() => {
    if (!isPlaying || isHovered) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [heroSlides.length, isPlaying, isHovered])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <section
      className="relative h-80 md:h-96 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-black/5 z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-white/30 rounded-full animate-bounce delay-1000" />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/40 rounded-full animate-ping delay-2000" />
        <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse delay-500" />
      </div>

      {heroSlides.map((slide, index) => {
        const IconComponent = slide.icon
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-out ${
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-110"
            }`}
            style={{
              transform: `translateX(${(index - currentSlide) * 100}%)`,
              transition: "transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 1s ease-out",
            }}
          >
            <div className={`bg-gradient-to-br ${slide.bgColor} h-full relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)]" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse transform rotate-45" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000 transform -rotate-45" />
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-xl animate-spin-slow transform -translate-x-1/2 -translate-y-1/2" />
              </div>

              <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-full relative z-20">
                <div className="flex items-center justify-between h-full">
                  <div className="w-full md:w-1/2 text-white space-y-8">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 ${slide.accentColor} rounded-full`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className={`w-16 h-1 ${slide.accentColor} rounded-full`} />
                      <span className="text-sm md:text-base font-semibold tracking-widest uppercase opacity-95">
                        {slide.subtitle}
                      </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-none">
                      <span className="block transform transition-all duration-1000 hover:scale-105">
                        {slide.title.split(" ").map((word, i) => (
                          <span
                            key={i}
                            className={`inline-block mr-4 transform transition-all duration-700 hover:rotate-1 ${
                              i === slide.title.split(" ").length - 1 ? "text-yellow-200 drop-shadow-lg" : ""
                            }`}
                            style={{
                              animationDelay: `${i * 0.2}s`,
                              textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                            }}
                          >
                            {word}
                          </span>
                        ))}
                      </span>
                    </h1>

                    <p className="text-lg md:text-xl leading-relaxed opacity-95 max-w-2xl font-light tracking-wide">
                      {slide.description}
                    </p>
                  </div>

                  <div className="hidden md:block w-1/2 pl-16">
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/30 rounded-3xl blur-2xl transform rotate-3 scale-105" />
                      <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl transform -rotate-2 scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl transform rotate-1" />

                      <img
                        src={slide.image || "/placeholder.svg"}
                        alt={slide.title}
                        className="relative w-full h-60 lg:h-72 object-cover rounded-3xl shadow-2xl transform transition-all duration-1000 hover:scale-105 hover:rotate-2 border-4 border-white/20"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10 rounded-3xl" />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent rounded-3xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-30 group/nav"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 transition-transform duration-300 group-hover/nav:-translate-x-0.5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-30 group/nav"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 transition-transform duration-300 group-hover/nav:translate-x-0.5" />
      </button>

      <button
        onClick={togglePlayPause}
        className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-30"
        aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
      </button>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-30">
        {heroSlides.map((slide, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`relative overflow-hidden rounded-full transition-all duration-500 backdrop-blur-sm ${
              index === currentSlide
                ? "w-16 h-4 bg-white shadow-lg shadow-white/50"
                : "w-4 h-4 bg-white/40 hover:bg-white/70 hover:scale-125"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentSlide && (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-white/20 blur-sm animate-ping" />
              </>
            )}
          </button>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-2 bg-white/10 backdrop-blur-sm z-30">
        <div
          className="h-full bg-gradient-to-r from-white via-yellow-200 to-white transition-all duration-500 ease-out shadow-lg shadow-white/30"
          style={{
            width: `${((currentSlide + 1) / heroSlides.length) * 100}%`,
          }}
        />
      </div>
    </section>
  )
}

export default HeroSection
