import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  <i className="fas fa-hammer text-white text-lg"></i>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                  <i className="fas fa-wrench text-white text-xs"></i>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LabourEase
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Connect • Work • Succeed</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                How it Works
              </a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                About
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Find Skilled
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Laborers
                  </span>
                  Near You
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Connect with verified, skilled workers in your area. Get quality work done quickly and reliably with LabourEase.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <i className="fas fa-rocket mr-2"></i>
                  Start Finding Workers
                </Link>
                <Link
                  to="/register?type=laborer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <i className="fas fa-briefcase mr-2"></i>
                  Join as Worker
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-shield-alt text-green-500"></i>
                  <span>Verified Workers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-star text-yellow-500"></i>
                  <span>Rated & Reviewed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-clock text-blue-500"></i>
                  <span>Quick Response</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <i className="fas fa-map-marker-alt text-white text-xl"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Live Location Tracking</h3>
                        <p className="text-sm text-gray-600">Find workers near you in real-time</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                        <i className="fas fa-user-check text-white text-xl"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Verified Profiles</h3>
                        <p className="text-sm text-gray-600">All workers are background checked</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <i className="fas fa-comments text-white text-xl"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Direct Communication</h3>
                        <p className="text-sm text-gray-600">Chat and negotiate directly</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <i className="fas fa-star text-white text-xl"></i>
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <i className="fas fa-check text-white text-lg"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose LabourEase?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make finding skilled workers simple, safe, and efficient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: 'fas fa-map-marked-alt',
                title: 'Live Location Tracking',
                description: 'Find workers in your exact area with real-time location services',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: 'fas fa-shield-alt',
                title: 'Verified Workers',
                description: 'All workers are background checked and verified for your safety',
                color: 'from-green-500 to-green-600'
              },
              {
                icon: 'fas fa-star',
                title: 'Rated & Reviewed',
                description: 'Read reviews and ratings from previous customers',
                color: 'from-yellow-500 to-yellow-600'
              },
              {
                icon: 'fas fa-comments',
                title: 'Direct Communication',
                description: 'Chat directly with workers to discuss your project',
                color: 'from-purple-500 to-purple-600'
              },
              {
                icon: 'fas fa-clock',
                title: 'Quick Response',
                description: 'Get responses within minutes from available workers',
                color: 'from-orange-500 to-orange-600'
              },
              {
                icon: 'fas fa-dollar-sign',
                title: 'Fair Pricing',
                description: 'Negotiate fair prices directly with workers',
                color: 'from-red-500 to-red-600'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <i className={`${feature.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Set Your Location',
                description: 'Allow location access to find workers near you',
                icon: 'fas fa-map-marker-alt'
              },
              {
                step: '2',
                title: 'Browse Workers',
                description: 'View profiles, ratings, and reviews of available workers',
                icon: 'fas fa-users'
              },
              {
                step: '3',
                title: 'Connect & Hire',
                description: 'Chat with workers and hire the best one for your job',
                icon: 'fas fa-handshake'
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-white font-bold text-2xl">{step.step}</span>
                  </div>
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <i className={`${step.icon} text-blue-600 text-2xl`}></i>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of customers who trust LabourEase for their projects
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <i className="fas fa-rocket mr-2"></i>
              Start Finding Workers
            </Link>
            <Link
              to="/register?type=laborer"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <i className="fas fa-briefcase mr-2"></i>
              Join as Worker
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <i className="fas fa-hammer text-white text-sm"></i>
                </div>
                <h3 className="text-lg font-bold">LabourEase</h3>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Connecting skilled laborers with customers who need quality work done. 
                Your trusted platform for reliable, professional services.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-facebook text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">How it Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Safety & Trust</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Become a Worker</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Success Stories</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 LabourEase. All rights reserved. Made with ❤️ for connecting communities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 