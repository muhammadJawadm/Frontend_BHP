import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API request
    try {
      // In a real app, you would send this data to your backend
      // const response = await fetch('https://backend-bhp.onrender.com/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormStatus({
        submitted: true,
        success: true,
        message: 'Thank you for your message. We will get back to you soon!'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Something went wrong. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-lg md:text-xl text-slate-300">
              Have questions or feedback? We're here to help. Get in touch with our team.
            </p>
          </div>
        </div>
      </div>
      
      {/* Contact Information and Form */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Get In Touch</h2>
            <p className="text-slate-600 mb-8">
              Have a question or need assistance? Our team is ready to help you with any inquiries.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-slate-100 p-3 rounded-full mr-4">
                  <Mail className="h-5 w-5 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Email Us</h3>
                  <p className="text-slate-600">support@markethub.com</p>
                  <p className="text-slate-600">info@markethub.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-slate-100 p-3 rounded-full mr-4">
                  <Phone className="h-5 w-5 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Call Us</h3>
                  <p className="text-slate-600">Customer Support: +1 (555) 123-4567</p>
                  <p className="text-slate-600">Seller Support: +1 (555) 987-6543</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-slate-100 p-3 rounded-full mr-4">
                  <MapPin className="h-5 w-5 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Visit Us</h3>
                  <p className="text-slate-600">
                    MarketHub Headquarters<br />
                    123 E-Commerce Street<br />
                    San Francisco, CA 94105
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <a 
                    key={social}
                    href={`https://${social}.com/markethub`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-100 hover:bg-slate-200 p-2 rounded-full"
                  >
                    <img 
                      src={`https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/${social}.svg`}
                      alt={social}
                      className="h-5 w-5"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <MessageSquare className="h-5 w-5 text-slate-700" />
                  <h2 className="text-2xl font-bold text-slate-900">Send a Message</h2>
                </div>
                
                {formStatus.submitted && (
                  <Alert className={formStatus.success ? 'bg-green-50 text-green-800 mb-6' : 'bg-red-50 text-red-800 mb-6'}>
                    {formStatus.success ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertTitle>{formStatus.success ? 'Success!' : 'Error'}</AlertTitle>
                    <AlertDescription>
                      {formStatus.message}
                    </AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Type your message here..."
                      rows={5}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="bg-slate-800 hover:bg-slate-900 w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Map Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Visit Our Office</h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe 
              title="MarketHub Office Location"
              className="w-full h-[400px] rounded-lg border border-slate-200"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50470.68994085393!2d-122.43300991774757!3d37.77493706850806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858080a379575d%3A0x6fcd18536592a403!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1691175624413!5m2!1sen!2sus" 
              allowFullScreen="" 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {[
            {
              question: "How do I become a seller on MarketHub?",
              answer: "To become a seller, click on 'Seller Signup' in the navigation menu, complete the registration form, and follow the verification process. Once approved, you can start adding products to your store."
            },
            {
              question: "What payment methods are accepted?",
              answer: "MarketHub accepts credit cards, PayPal, and Apple Pay. We're working on adding more payment options in the future to accommodate all our customers."
            },
            {
              question: "How long does shipping take?",
              answer: "Shipping times vary by seller and location. Most domestic orders arrive within 3-5 business days, while international orders can take 1-3 weeks. Specific delivery estimates are provided at checkout."
            },
            {
              question: "What is your return policy?",
              answer: "Our return policy allows customers to return most items within 30 days of delivery. Some products may have specific return conditions set by the seller, which will be clearly indicated on the product page."
            }
          ].map((faq, index) => (
            <details 
              key={index}
              className="group bg-white rounded-lg border border-slate-200 p-6"
            >
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                <span className="text-lg font-semibold">{faq.question}</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" width="24" className="text-slate-500" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </summary>
              <p className="text-slate-600 mt-4 group-open:animate-fadeIn">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
