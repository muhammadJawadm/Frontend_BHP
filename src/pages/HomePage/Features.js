import { User, Factory, RefreshCw } from "lucide-react"

const Features = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-purple-500 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Our Platform
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover unique handmade products crafted with love and purpose
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20">
            <div className="relative mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <User className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
              Empower Women
            </h3>
            <p className="text-gray-600 leading-relaxed">
  Supporting <span className="font-semibold text-pink-600">women entrepreneurs</span> by giving them a platform to showcase and sell their handmade products
</p>
          </div>

          <div className="group text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20">
            <div className="relative mb-6">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Factory className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors duration-300">
              Enable Local Industry
            </h3>
            <p className="text-gray-600 leading-relaxed">
  Promoting <span className="font-semibold text-green-600">local craftsmanship</span> and industries to strengthen communities and boost sustainable growth
</p>
          </div>

          <div className="group text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20">
            <div className="relative mb-6">
              <div className="bg-gradient-to-br from-orange-500 to-amber-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <RefreshCw className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
              Preserve Heritage & Culture
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Keep <span className="font-semibold text-orange-600">timeless crafts and traditions alive</span> by supporting women artisans who carry our cultural heritage forward.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
