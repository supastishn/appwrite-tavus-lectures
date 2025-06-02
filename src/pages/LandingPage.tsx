import React from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-primary-light/30 via-white to-primary-light/10 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors relative">
      {/* Add circle image based on theme */}
      <div className="absolute top-0 right-0 z-0 opacity-20 dark:opacity-20">
        <img 
          src={theme === 'dark' ? "/white_circle_360x360.png" : "/black_circle_360x360.png"}
          alt=""
          className="w-80 h-80"
        />
      </div>
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold text-primary-dark dark:text-white mb-8 leading-tight">
            Transform How You Learn
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
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
              className="px-10 py-4 bg-white text-primary rounded-full font-semibold shadow-card hover:bg-gray-100 dark:bg-gray-800 dark:text-primary-light dark:hover:bg-gray-700 transition"
            >
              How It Works
            </a>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900 dark:text-white">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-card hover:shadow-lg transition">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 dark:text-primary-light font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Instant Video Generation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create AI-powered educational videos in minutes from any topic
              </p>
            </div>
            
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-card hover:shadow-lg transition">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 dark:text-primary-light font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Personalized Learning</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Video lessons tailored to your knowledge level and learning style
              </p>
            </div>
            
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-card hover:shadow-lg transition">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 dark:text-primary-light font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Smart Retention</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Interactive elements boost information retention and engagement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats & Benefits Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Learning Made Simple</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of learners who are mastering new skills faster than ever before
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary dark:text-primary-light mb-2">10K+</div>
              <div className="text-gray-600 dark:text-gray-300">Lessons Created</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary dark:text-primary-light mb-2">5 Min</div>
              <div className="text-gray-600 dark:text-gray-300">Average Creation Time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary dark:text-primary-light mb-2">98%</div>
              <div className="text-gray-600 dark:text-gray-300">User Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary dark:text-primary-light mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-300">AI Availability</div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Students</h3>
              <p className="text-gray-600 dark:text-gray-300">Get personalized explanations for complex topics at your own pace</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Educators</h3>
              <p className="text-gray-600 dark:text-gray-300">Create engaging supplementary content without hours of preparation</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💼</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Professionals</h3>
              <p className="text-gray-600 dark:text-gray-300">Upskill quickly with targeted lessons for career advancement</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-indigo-600 dark:bg-primary-dark text-white transition-colors">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Learning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of educators and students creating exceptional learning experiences
          </p>
          <Link 
            to="/register" 
            className="px-8 py-4 bg-white text-indigo-600 dark:bg-gray-900 dark:text-primary-light rounded-lg font-medium text-lg hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors"
          >
            Create Your First Lesson
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-800 dark:bg-gray-900 text-center text-gray-400 dark:text-gray-500 transition-colors">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} LearnAI. All rights reserved.</p>
          <div className="mt-4">
            <a href="#" className="mx-2 hover:text-white dark:hover:text-primary-light transition-colors">Terms</a> • 
            <a href="#" className="mx-2 hover:text-white dark:hover:text-primary-light transition-colors">Privacy</a> • 
            <a href="#" className="mx-2 hover:text-white dark:hover:text-primary-light transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
