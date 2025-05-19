'use client';

import React, { useState } from 'react';
import { LogIn, Mail, Lock, ArrowRight, User, Eye, EyeOff, Building, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [activeTab, setActiveTab] = useState('enterprise'); // 'enterprise' or 'personal'
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(formData.email, formData.password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-sky-100 to-teal-50 flex flex-col">
      {/* Navigation */}
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-cyan-600 cursor-pointer flex items-center gap-2">
              <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-600">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                <path d="M12 11h4"></path>
                <path d="M12 16h4"></path>
                <path d="M8 11h.01"></path>
                <path d="M8 16h.01"></path>
              </svg>
              ErgoCheck
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/register" className="text-gray-600 hover:text-cyan-600 transition-colors duration-200">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
              <p className="mt-2 text-gray-600">Sign in to your ErgoCheck account</p>
            </div>

            {/* Login Type Tabs */}
            <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab('enterprise')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${
                  activeTab === 'enterprise' 
                    ? 'bg-white text-cyan-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Building size={16} />
                Enterprise
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('personal')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${
                  activeTab === 'personal' 
                    ? 'bg-white text-cyan-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User size={16} />
                Personal
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2">
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="email@company.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/auth/forgot-password" className="font-medium text-cyan-600 hover:text-cyan-500">
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>
            </div>

            {/* Alternative Login Options */}
            <div className="mt-6">
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200"
              >
                <User className="h-5 w-5 text-gray-500 mr-2" />
                Sign in as Demo
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {activeTab === 'enterprise' ? (
                  <>
                    Don't have an account?{' '}
                    <Link href="/auth/contact" className="font-medium text-cyan-600 hover:text-cyan-500">
                      Contact your company admin
                    </Link>
                  </>
                ) : (
                  <>
                    Don't have an account?{' '}
                    <Link href="/auth/register" className="font-medium text-cyan-600 hover:text-cyan-500">
                      Register now
                    </Link>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-600">
        <p>© 2025 ErgoCheck. Institut Teknologi Sepuluh Nopember. All Rights Reserved.</p>
      </footer>
    </div>
  );
}