'use client';

import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, FileText, Clock, Search, ChevronDown, ChevronUp } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import api from '@/services/api';

interface Quiz {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  questionsCount?: number;
}

export default function QuizManagement() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'title' | 'createdAt'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState('');

  useEffect(() => {
    fetchQuizzes();
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

  const handleCreateQuiz = async () => {
    if (!newQuizTitle.trim()) return;

    try {
      const response = await api.post('/quiz/create', { title: newQuizTitle });
      setQuizzes([response.data.data, ...quizzes]);
      setNewQuizTitle('');
      setIsCreatingQuiz(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create quiz');
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;

    try {
      await api.delete(`/quiz/${quizId}`);
      setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete quiz');
    }
  };

  const toggleSort = (field: 'title' | 'createdAt') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedQuizzes = quizzes
    .filter(quiz => 
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      quiz.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === 'title') {
        return sortDirection === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else {
        return sortDirection === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quiz Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create and manage ergonomic quizzes for your team
            </p>
          </div>
          <div className="mt-4 flex md:mt-0">
            <button
              type="button"
              onClick={() => setIsCreatingQuiz(true)}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Quiz
            </button>
          </div>
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

        {/* Create quiz form */}
        {isCreatingQuiz && (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Quiz</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="quiz-title" className="block text-sm font-medium text-gray-700">
                  Quiz Title
                </label>
                <input
                  type="text"
                  id="quiz-title"
                  value={newQuizTitle}
                  onChange={(e) => setNewQuizTitle(e.target.value)}
                  className="mt-1 focus:ring-cyan-500 focus:border-cyan-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter quiz title"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingQuiz(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateQuiz}
                  disabled={!newQuizTitle.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search & filter */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search quizzes by title or author"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Quizzes list */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          {/* Table */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('title')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Quiz Title</span>
                    {sortField === 'title' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Author
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('createdAt')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date Created</span>
                    {sortField === 'createdAt' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading quizzes...
                  </td>
                </tr>
              ) : filteredAndSortedQuizzes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchTerm ? 'No quizzes match your search' : 'No quizzes found. Create your first quiz!'}
                  </td>
                </tr>
              ) : (
                filteredAndSortedQuizzes.map((quiz) => (
                  <tr key={quiz.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-cyan-100 text-cyan-600">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{quiz.title}</div>
                          <div className="text-sm text-gray-500">
                            {quiz.questionsCount || 0} questions
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{quiz.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                        {new Date(quiz.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/dashboard/supervisor/quizzes/${quiz.id}`}
                          className="text-cyan-600 hover:text-cyan-900 p-1 rounded hover:bg-cyan-50"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}