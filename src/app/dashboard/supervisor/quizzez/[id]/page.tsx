'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Save, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

interface Question {
  id: string;
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

interface QuizData {
  id: string;
  title: string;
  supervisorId: string;
}

export default function EditQuiz({ params }: { params: { id: string } }) {
  const router = useRouter();
  const quizId = params.id;
  
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editedQuestionText, setEditedQuestionText] = useState('');
  const [addingOptions, setAddingOptions] = useState<string | null>(null);
  
  // Form for new options
  const [newOptions, setNewOptions] = useState<{text: string, isCorrect: boolean}[]>([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ]);
  
  useEffect(() => {
    fetchQuizData();
    fetchQuestions();
  }, [quizId]);

  const fetchQuizData = async () => {
    try {
      const response = await api.get(`/quiz/${quizId}`);
      setQuizData(response.data.data);
      setEditedTitle(response.data.data.title);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch quiz data');
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/question/${quizId}`);
      setQuestions(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTitle = async () => {
    if (!editedTitle.trim() || !quizData) return;
    
    try {
      await api.put(`/quiz/update/${quizId}`, { title: editedTitle });
      setQuizData({ ...quizData, title: editedTitle });
      setEditingTitle(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update quiz title');
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.trim()) return;
    
    try {
      const response = await api.post(`/question/${quizId}`, { text: newQuestion });
      setQuestions([...questions, response.data.data]);
      setNewQuestion('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add question');
    }
  };

  const handleUpdateQuestion = async (questionId: string) => {
    if (!editedQuestionText.trim()) return;
    
    try {
      await api.put(`/question/${questionId}`, { text: editedQuestionText });
      setQuestions(questions.map(q => 
        q.id === questionId ? { ...q, question: editedQuestionText } : q
      ));
      setEditingQuestionId(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update question');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    try {
      await api.delete(`/question/${questionId}`);
      setQuestions(questions.filter(q => q.id !== questionId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete question');
    }
  };

  const handleAddOptions = async (questionId: string) => {
    // Check if at least one option is filled and one is correct
    const hasContent = newOptions.some(o => o.text.trim() !== '');
    const hasCorrectOption = newOptions.some(o => o.isCorrect);
    
    if (!hasContent || !hasCorrectOption) {
      setError('Please add at least one option and mark one as correct');
      return;
    }
    
    // Filter out empty options
    const validOptions = newOptions.filter(o => o.text.trim() !== '');
    
    try {
      const response = await api.post(`/option/${questionId}`, { options: validOptions });
      
      // Update questions with new options
      setQuestions(questions.map(q => 
        q.id === questionId ? { ...q, options: response.data.data } : q
      ));
      
      // Reset option form
      setNewOptions([
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]);
      
      setAddingOptions(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add options');
    }
  };

  const handleOptionTextChange = (index: number, text: string) => {
    const updatedOptions = [...newOptions];
    updatedOptions[index].text = text;
    setNewOptions(updatedOptions);
  };

  const handleOptionCorrectChange = (index: number) => {
    const updatedOptions = newOptions.map((option, i) => ({
      ...option,
      isCorrect: i === index
    }));
    setNewOptions(updatedOptions);
  };

  if (loading && !quizData) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center">
          <Link 
            href="/dashboard/supervisor/quizzes" 
            className="mr-4 p-1 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Quiz</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage quiz questions and options
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quiz title */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          {editingTitle ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="quiz-title" className="block text-sm font-medium text-gray-700">
                  Quiz Title
                </label>
                <input
                  type="text"
                  id="quiz-title"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="mt-1 focus:ring-cyan-500 focus:border-cyan-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingTitle(false)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateTitle}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  Save Title
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">{quizData?.title}</h2>
              <button
                type="button"
                onClick={() => setEditingTitle(true)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit Title
              </button>
            </div>
          )}
        </div>

        {/* Add Question */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Question</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="new-question" className="block text-sm font-medium text-gray-700">
                Question Text
              </label>
              <textarea
                id="new-question"
                rows={3}
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="mt-1 focus:ring-cyan-500 focus:border-cyan-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter your question here"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddQuestion}
                disabled={!newQuestion.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Question
              </button>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Quiz Questions</h3>
          </div>
          
          {questions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No questions added yet. Add your first question above.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {questions.map((question) => (
                <li key={question.id} className="p-6">
                  {/* Question display and edit */}
                  {editingQuestionId === question.id ? (
                    <div className="space-y-4">
                      <textarea
                        rows={3}
                        value={editedQuestionText}
                        onChange={(e) => setEditedQuestionText(e.target.value)}
                        className="mt-1 focus:ring-cyan-500 focus:border-cyan-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => setEditingQuestionId(null)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuestion(question.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                        >
                          Save Question
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="text-lg font-medium text-gray-900 mb-2">{question.question}</div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingQuestionId(question.id);
                              setEditedQuestionText(question.question);
                            }}
                            className="text-cyan-600 hover:text-cyan-900 p-1 rounded hover:bg-cyan-50"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Options section */}
                      {question.options && question.options.length > 0 ? (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Options:</h4>
                          <ul className="space-y-2">
                            {question.options.map((option) => (
                              <li key={option.id} className="flex items-center">
                                <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                                  option.isCorrect 
                                    ? 'bg-green-100 text-green-600' 
                                    : 'bg-gray-100 text-gray-400'
                                }`}>
                                  {option.isCorrect ? (
                                    <CheckCircle className="h-4 w-4" />
                                  ) : (
                                    <XCircle className="h-4 w-4" />
                                  )}
                                </div>
                                <span className="text-gray-800">{option.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="mt-4">
                          {addingOptions === question.id ? (
                            <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-md">
                              <h4 className="text-sm font-medium text-gray-700">Add Options:</h4>
                              {newOptions.map((option, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                  <div 
                                    className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer ${
                                      option.isCorrect 
                                        ? 'bg-green-100 text-green-600' 
                                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                    }`}
                                    onClick={() => handleOptionCorrectChange(index)}
                                  >
                                    {option.isCorrect ? (
                                      <CheckCircle className="h-4 w-4" />
                                    ) : (
                                      <div className="w-3 h-3 rounded-full border border-gray-400"></div>
                                    )}
                                  </div>
                                  <input
                                    type="text"
                                    value={option.text}
                                    onChange={(e) => handleOptionTextChange(index, e.target.value)}
                                    placeholder={`Option ${index + 1}`}
                                    className="flex-1 focus:ring-cyan-500 focus:border-cyan-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                  />
                                </div>
                              ))}
                              <div className="flex justify-end space-x-3 mt-4">
                                <button
                                  type="button"
                                  onClick={() => setAddingOptions(null)}
                                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAddOptions(question.id)}
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                                >
                                  Save Options
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setAddingOptions(question.id)}
                              className="inline-flex items-center px-3 py-1.5 mt-2 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Options
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}