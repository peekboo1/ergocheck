'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Clock, Search, Award, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import api from '@/services/api';

interface Quiz {
  id: string;
  title: string;
  author: string;
  createdAt: string;
}

interface Question {
  question: string;
  quizId: string;
  options: Option[];
}

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  questionId: string;
}

export default function EmployeeQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // For quiz history
  const [quizHistory, setQuizHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetchQuizzes();
    fetchQuizHistory();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/quiz/get-quiz');
      setQuizzes(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizHistory = async () => {
    setLoadingHistory(true);
    try {
      // Get current user ID from local storage
      const user = localStorage.getItem('user');
      const userId = user ? JSON.parse(user).id : null;
      
      if (userId) {
        const response = await api.get(`/quiz-attempt/history/${userId}`);
        setQuizHistory(response.data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch quiz history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    quiz.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ergonomic Quizzes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Take quizzes to test your ergonomic knowledge and improve your workplace health
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search quizzes"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Available Quizzes */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Available Quizzes</h3>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
              <p className="mt-2 text-gray-500">Loading quizzes...</p>
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No quizzes found. Check back later for new quizzes!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {filteredQuizzes.map((quiz) => (
                <div 
                  key={quiz.id} 
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="px-4 py-5 bg-cyan-50 border-b border-gray-200">
                    <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-cyan-100 text-cyan-600 mx-auto">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-center text-gray-900 truncate">{quiz.title}</h3>
                  </div>
                  <div className="px-4 py-3 bg-white">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(quiz.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        ~10 min
                      </div>
                    </div>
                    <Link 
                      href={`/dashboard/employee/quizzes/${quiz.id}`}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700"
                    >
                      Start Quiz
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quiz History */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Your Quiz History</h3>
          </div>
          
          {loadingHistory ? (
            <div className="p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
              <p className="mt-2 text-gray-500">Loading history...</p>
            </div>
          ) : quizHistory.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              You haven't taken any quizzes yet. Start one now to track your progress!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quiz
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Taken
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quizHistory.map((attempt, index) => (
                    <tr key={attempt.id || index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{attempt.quizName || 'Ergonomic Quiz'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(attempt.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div 
                            className={`mr-2 h-8 w-8 rounded-full flex items-center justify-center font-medium ${
                              attempt.score >= 80 ? 'bg-green-100 text-green-800' :
                              attempt.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            {attempt.score}
                          </div>
                          <div className="text-sm text-gray-500">
                            {attempt.score >= 80 ? 'Excellent' :
                             attempt.score >= 60 ? 'Good' :
                             'Needs Improvement'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/dashboard/employee/quiz-results/${attempt.id}`}
                          className="text-cyan-600 hover:text-cyan-900"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}