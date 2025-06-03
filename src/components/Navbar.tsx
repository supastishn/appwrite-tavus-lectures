import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAppwriteUser } from '../contexts/UserContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, handleLogout } = useAppwriteUser();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-dark rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">LearnAI</span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'text-primary dark:text-primary-light'
                      : 'text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/profile')
                      ? 'text-primary dark:text-primary-light'
                      : 'text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light'
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/login')
                      ? 'text-primary dark:text-primary-light'
                      : 'text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/register')
                      ? 'text-primary dark:text-primary-light'
                      : 'text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light'
                  }`}
                >
                  Register
                </Link>
              </>
            )}
            
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
