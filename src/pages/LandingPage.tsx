import React from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/30 via-white to-primary-light/10 font-sans">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-dark rounded
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold text-primary-dark mb-8 leading-tight">
            Transform How You Learn
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Create AI-powered video lessons from any topic in minutes. 
            Personalized education for every learner.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/register" 
              className="px-10 py-4 bg-primary text-white rounded-full text-lg font-semibold shadow-card hover:bg-primary-dark transition-colors"
            >
              Start Creating
            </Link>
            <a 
              href="#features" 
              className="px-10 py-4 bg-white text-primary rounded-full font-semibold shadow-card hover:bg-gray-100 transition"
            >
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-8 bg-white rounded-xl shadow-card hover:shadow-lg transition">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Instant Video Generation</h3>
              <p className="text-gray-600">
                Create AI-powered educational videos in minutes from any topic
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-xl shadow-card hover:shadow-lg transition">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Personalized Learning</h3>
              <p className="text-gray-600">
                Video lessons tailored to your knowledge level and learning style
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-xl shadow-card hover:shadow-lg transition">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Retention</h3>
              <p className="text-gray-600">
                Interactive elements boost information retention and engagement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats & Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Learning Made Simple</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of learners who are mastering new skills faster than ever before
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-gray-600">Lessons Created</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">5 Min</div>
              <div className="text-gray-600">Average Creation Time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-gray-600">User Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray-600">AI Availability</div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Students</h3>
              <p className="text-gray-600">Get personalized explanations for complex topics at your own pace</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Educators</h3>
              <p className="text-gray-600">Create engaging supplementary content without hours of preparation</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💼</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Professionals</h3>
              <p className="text-gray-600">Upskill quickly with targeted lessons for career advancement</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Learning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of educators and students creating exceptional learning experiences
          </p>
          <Link 
            to="/register" 
            className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-medium text-lg hover:bg-indigo-50 transition-colors"
          >
            Create Your First Lesson
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-800 text-center text-gray-400">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} LearnAI. All rights reserved.</p>
          <div className="mt-4">
            <a href="#" className="mx-2 hover:text-white transition-colors">Terms</a> • 
            <a href="#" className="mx-2 hover:text-white transition-colors">Privacy</a> • 
            <a href="#" className="mx-2 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
