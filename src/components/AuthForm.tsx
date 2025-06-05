import React, { useState } from 'react';
import { login } from '../services/auth';
import { LogIn, Brain } from 'lucide-react';
import { useAppwriteUser } from '../contexts/UserContext';
import { Link } from 'react-router-dom';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { refetchUser } = useAppwriteUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      refetchUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      {/* Update card with dark mode background and border */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-10 rounded-3xl shadow-lg w-full max-w-md font-sans">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h2 className="text-4xl font-extrabold mb-8 text-center text-primary-dark tracking-tight">
          Welcome Back
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary-light transition bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary-light transition bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl hover:bg-primary-dark transition-colors duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-700 dark:hover:bg-indigo-800"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <LogIn size={22} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/register"
            className="text-primary hover:text-primary-dark text-sm font-medium underline underline-offset-2 transition"
          >
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
