import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import MachineCard from "@/components/MachineCard";
import { machines } from "@/data/machines";
import { Activity, Shield, Zap, Heart, ArrowRight, Phone, Mail, MapPin, Star, Award, Clock, CheckCircle, Users, TrendingUp, Globe } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const featuredMachines = machines.filter((m) => m.availability).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section - Ultra Modern */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-10">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-semibold shadow-lg backdrop-blur-sm">
                  <Award className="h-5 w-5" />
                  Industry Leading Excellence Since 2018
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight">
                  Next-Generation
                  <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Medical Equipment</span>
                  <span className="block text-gray-700 dark:text-gray-300">Solutions</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed font-light max-w-2xl">
                  Revolutionizing healthcare delivery through cutting-edge refurbished medical equipment. 
                  Our comprehensive solutions empower healthcare providers with reliable, cost-effective 
                  technology that exceeds industry standards and drives exceptional patient outcomes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/machines")}
                  className="h-16 px-10 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Explore Premium Equipment
                  <ArrowRight className="h-6 w-6 ml-3" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate("/login")}
                  className="h-16 px-10 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Request Consultation
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">1000+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Healthcare Partners</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">99.8%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">24/7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Expert Support</div>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Visual */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700">
                <img
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&q=80"
                  alt="Advanced medical equipment in modern healthcare facility"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-transparent" />
              </div>
              
              {/* Floating Achievement Cards */}
              <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">ISO 13485 Certified</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Medical Device Quality</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 -left-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">98% Uptime</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Equipment Reliability</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-background dark:to-gray-900/50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-semibold mb-6">
              <Globe className="h-4 w-4" />
              World-Class Standards
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
              Why Leading Healthcare Providers
              <span className="block text-blue-600 dark:text-blue-400">Choose Our Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Our comprehensive approach to medical equipment solutions combines cutting-edge technology, 
              rigorous quality assurance, and unparalleled customer support to deliver exceptional value 
              to healthcare organizations worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <Card className="text-center p-10 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
              <CardContent className="space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <Shield className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Quality Assurance</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our proprietary 127-point inspection protocol ensures every piece of equipment meets 
                  or exceeds original manufacturer specifications, backed by comprehensive testing and certification.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-10 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/20">
              <CardContent className="space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <Zap className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Rapid Deployment Solutions</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Streamlined logistics and installation processes ensure your equipment is operational 
                  within 24-48 hours, minimizing downtime and maximizing patient care continuity.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-10 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20">
              <CardContent className="space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <Heart className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Comprehensive Support Ecosystem</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our dedicated team of certified technicians and clinical specialists provides ongoing 
                  support, training, and maintenance to ensure optimal equipment performance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Equipment */}
      <section className="py-24 md:py-32 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-6">
              <Activity className="h-4 w-4" />
              Premium Equipment Portfolio
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Cutting-Edge Medical Technology
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover our curated selection of premium refurbished medical equipment, each piece 
              meticulously restored to deliver exceptional performance and reliability for your healthcare facility.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
            {featuredMachines.map((machine, index) => (
              <div key={machine.id} className="animate-fade-in hover:scale-105 transition-transform duration-300" style={{ animationDelay: `${index * 150}ms` }}>
                <MachineCard machine={machine} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button 
              size="lg"
              variant="outline" 
              onClick={() => navigate("/machines")}
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-10 h-14 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Explore Complete Equipment Catalog
              <ArrowRight className="h-6 w-6 ml-3" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32 px-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900/50 dark:to-blue-900/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-700 dark:text-yellow-300 text-sm font-semibold mb-6">
              <Users className="h-4 w-4" />
              Client Success Stories
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Trusted by Healthcare Leaders Worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <Card className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800">
              <CardContent className="space-y-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  "The comprehensive equipment solutions provided have transformed our facility's 
                  operational efficiency. The quality and reliability exceed our expectations, 
                  delivering exceptional value for our investment."
                </p>
                <div className="border-t pt-6">
                  <p className="font-bold text-gray-900 dark:text-white text-lg">Dr. Sarah Johnson</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Chief Medical Officer, Metropolitan Health System</p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800">
              <CardContent className="space-y-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  "Outstanding service delivery and technical expertise. The rapid deployment 
                  capabilities and ongoing support have been instrumental in our expansion strategy 
                  and improved patient outcomes."
                </p>
                <div className="border-t pt-6">
                  <p className="font-bold text-gray-900 dark:text-white text-lg">Dr. Michael Chen</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Director of Operations, Advanced Care Network</p>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800">
              <CardContent className="space-y-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  "The comprehensive warranty program and proactive maintenance services provide 
                  peace of mind. Their commitment to excellence aligns perfectly with our 
                  quality standards and patient care objectives."
                </p>
                <div className="border-t pt-6">
                  <p className="font-bold text-gray-900 dark:text-white text-lg">Dr. Emily Rodriguez</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Medical Director, Regional Healthcare Alliance</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Transform Your Healthcare Facility Today
            </h2>
            <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed">
              Partner with industry leaders to access premium medical equipment solutions that drive 
              exceptional patient outcomes and operational excellence. Experience the difference 
              that quality makes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate("/machines")}
                className="h-16 px-10 text-lg bg-white text-blue-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Explore Premium Solutions
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="h-16 px-10 text-lg border-2 border-white text-white hover:bg-white/10 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Schedule Consultation: +91 98765 43210
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 justify-center text-sm opacity-80">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5" />
                <span>24/7 Expert Consultation</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5" />
                <span>Rapid Response Guarantee</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5" />
                <span>Comprehensive Warranty Coverage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="h-7 w-7 text-white" />
                </div>
                <span className="text-2xl font-bold">MediEquip Solutions</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md text-lg leading-relaxed">
                Leading provider of premium refurbished medical equipment solutions, 
                empowering healthcare organizations worldwide with cutting-edge technology 
                and unparalleled service excellence.
              </p>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5" />
                  <span>Global Headquarters: Mumbai, Maharashtra, India</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5" />
                  <span>+91 98765 43210 (24/7 Support)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5" />
                  <span>solutions@mediequip.com</span>
                </div>
              </div>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="font-bold mb-6 text-lg">Premium Solutions</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="/machines" className="hover:text-white transition-colors">Advanced Equipment Catalog</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">Flexible Rental Programs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Comprehensive Warranties</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Expert Support Services</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-bold mb-6 text-lg">Service Excellence</h3>
              <ul className="space-y-3 text-gray-400">
                <li>Premium Equipment Sales</li>
                <li>Flexible Rental Solutions</li>
                <li>Professional Installation</li>
                <li>Ongoing Maintenance Support</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2024 MediEquip Solutions. All rights reserved. | ISO 13485 Certified
            </p>
            <div className="flex gap-8 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Quality Standards</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;