import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Users, ShoppingBag, Award, Globe, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8">
              BHP connects sellers with customers, creating a vibrant marketplace where quality products meet passionate shoppers.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Store className="h-12 w-12 text-slate-300" />
              <span className="text-3xl font-bold">Buy Her Power</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mission & Vision */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
            <p className="text-lg text-slate-600 mb-6">
              At BuyHerPower, our mission is to empower businesses of all sizes by providing a platform where they can showcase their products to a global audience while offering customers a diverse marketplace to discover unique items they'll love.
            </p>
            <p className="text-lg text-slate-600 mb-6">
              We believe in creating opportunities for entrepreneurs and small businesses to thrive in the digital economy, fostering a community where quality, trust, and exceptional service are paramount.
            </p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-lg text-white">
            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
            <p className="text-lg mb-6">
              To become the world's most trusted multi-vendor marketplace where businesses flourish and customers discover products they love.
            </p>
            <div className="flex items-center">
              <Globe className="h-12 w-12 mr-4" />
              <div>
                <span className="block font-bold">Global Reach</span>
                <span className="text-slate-300">Local Impact</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Values */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Our Core Values</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-none shadow-md">
              <CardContent className="p-6 text-center">
                <div className="bg-slate-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-slate-800" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Community</h3>
                <p className="text-slate-600">
                  Building connections between sellers and buyers, creating a vibrant marketplace ecosystem.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md">
              <CardContent className="p-6 text-center">
                <div className="bg-slate-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-slate-800" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Quality</h3>
                <p className="text-slate-600">
                  Maintaining high standards for products and services across our platform.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md">
              <CardContent className="p-6 text-center">
                <div className="bg-slate-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 text-slate-800" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Accessibility</h3>
                <p className="text-slate-600">
                  Making e-commerce accessible to businesses of all sizes and customers worldwide.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md">
              <CardContent className="p-6 text-center">
                <div className="bg-slate-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Trust</h3>
                <p className="text-slate-600">
                  Building trust through secure transactions, transparency, and reliability.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Team Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Meet Our Team</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              name: 'Mohin Zahid',
              role: 'CEO & Founder',
              image: '',
              bio: 'E-commerce veteran with 15+ years of experience in retail and digital marketplaces.'
            },
            {
              name: 'Amir Bilal',
              role: 'CTO',
              image: '',
              bio: 'Tech innovator with expertise in building scalable marketplace platforms.'
            },
            {
              name: 'Yasir',
              role: 'COO',
              image: '',
              bio: 'Operations expert specialized in optimizing multi-vendor business processes.'
            },
            {
              name: 'Muhammad Jawad',
              role: 'Devloper',
              image: '',
              bio: 'Dedicated to creating exceptional customer journeys and seller experiences.'
            }
          ].map((member, index) => (
            <div key={index} className="text-center">
              <div className="mb-4 relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto object-cover border-2 border-slate-200"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
              <p className="text-slate-600 font-medium mb-2">{member.role}</p>
              <p className="text-sm text-slate-500">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Join Our Community Today</h2>
            <p className="text-lg text-slate-300 mb-8">
              Whether you're looking to sell your products or discover something special, MarketHub is the place for you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/seller/signup">
                <Button size="lg" className="bg-white text-slate-800 hover:bg-slate-100 w-full sm:w-auto">
                  Become a Seller
                </Button>
              </Link>
              <Link to="/">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-slate-700 w-full sm:w-auto">
                  Start Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
