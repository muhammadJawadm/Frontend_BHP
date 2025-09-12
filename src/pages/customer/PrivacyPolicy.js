import { Shield, Eye, Lock, Users, FileText, Mail, Cookie, RefreshCw } from "lucide-react"

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
            <Shield className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Privacy Policy</h1>
          <p className="text-xl text-rose-100 max-w-2xl mx-auto text-pretty">
            Your privacy matters to us. Learn how we protect and respect your personal information.
          </p>
          <div className="mt-6 text-sm text-rose-200">Last Updated: December 9, 2025</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-8 mb-8">
          <p className="text-gray-700 leading-relaxed text-lg">
            At <span className="font-semibold text-rose-600">Buy Her Power (BHP)</span>, we respect and protect your
            privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you
            use our platform. By accessing or using our services, you agree to the practices described here.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
          </div>
          <p className="text-gray-700 mb-6">
            When you use our platform (as a buyer, seller, or visitor), we may collect the following information:
          </p>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <span className="font-semibold text-gray-900">Personal Information:</span>
                <span className="text-gray-700">
                  {" "}
                  Name, email, phone number, address, payment details, and store information when you register or make a
                  purchase.
                </span>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <span className="font-semibold text-gray-900">Store Information (Sellers):</span>
                <span className="text-gray-700">
                  {" "}
                  Business name, product details, bank/withdrawal information, and documents required to verify your
                  store.
                </span>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <span className="font-semibold text-gray-900">Usage Data:</span>
                <span className="text-gray-700">
                  {" "}
                  Device type, browser, IP address, and activity on the platform to improve user experience.
                </span>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <span className="font-semibold text-gray-900">Communication Data:</span>
                <span className="text-gray-700"> Messages, reviews, or feedback shared through the platform.</span>
              </div>
            </div>
          </div>
        </div>

        {/* How We Use Your Information */}
        <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
          </div>
          <p className="text-gray-700 mb-6">We use your information to:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-700">Create and manage your account</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-700">Process payments and withdrawals securely</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-700">Connect buyers with sellers</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-700">Improve our services and website functionality</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-700">Communicate about your account and promotions</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-700">Ensure platform safety and prevent fraud</span>
            </div>
          </div>
        </div>

        {/* Sharing of Information */}
        <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Sharing of Information</h2>
          </div>
          <p className="text-gray-700 mb-6">
            We do not sell or rent your personal data to third parties. However, we may share information in the
            following cases:
          </p>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-700">
                With trusted service providers (payment gateways, shipping partners, IT support)
              </span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-700">When required by law or regulation</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-700">
                To protect the rights, safety, and property of BHP, our users, and the community
              </span>
            </div>
          </div>
        </div>

        {/* Data Security */}
        <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
          </div>
          <p className="text-gray-700">
            We take security seriously. Your personal data is stored securely, and we use industry-standard safeguards
            to protect it. While we strive to protect your information, no online platform can be 100% secure. Please
            keep your login details private.
          </p>
        </div>

        {/* Your Rights */}
        <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
          </div>
          <p className="text-gray-700 mb-6">As a user of BHP, you have the right to:</p>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-700">Access and update your personal information</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-700">
                Request deletion of your account and data (subject to legal or regulatory requirements)
              </span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-700">Opt out of promotional communications at any time</span>
            </div>
          </div>
        </div>

        {/* Cookies & Tracking */}
        <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
              <Cookie className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Cookies & Tracking</h2>
          </div>
          <p className="text-gray-700 mb-6">Our platform uses cookies and similar tools to:</p>
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-700">Improve user experience</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-700">Remember your preferences</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-700">Analyze website traffic and performance</span>
            </div>
          </div>
          <p className="text-gray-700">
            You may disable cookies in your browser, but some features may not work properly.
          </p>
        </div>

        {/* Changes to This Policy */}
        <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Changes to This Policy</h2>
          </div>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. Any changes will be posted here with a revised "Last
            Updated" date.
          </p>
        </div>

        {/* Contact Us */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl shadow-lg p-8 text-white text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-rose-100 mb-6 max-w-2xl mx-auto">
            If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at:
          </p>
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
            <Mail className="w-5 h-5 mr-2" />
            <span className="font-medium">info@buyherpower.com</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
