
'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Clock, CheckCircle, AlertCircle, BookOpen } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

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

export default function TakeQuiz({ params }: { params: { id: string } }) {
  const router = useRouter();
  const quizId = params.id;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  
  // Timer
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    fetchQuizData();
  }, [quizId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (timerActive && timeRemaining > 0) {
      timer = setTimeout(() => setTimeRemaining(time => time - 1), 1000);
    } else if (timeRemaining === 0 && timerActive) {
      submitQuiz();
    }
    
    return () => clearTimeout(timer);
  }, [timeRemaining, timerActive]);

  const fetchQuizData = async () => {
    setLoading(true);
    try {
      // Get quiz questions and options
      const response = await api.get(`/question/${quizId}`);
      setQuestions(response.data.data);
      
      // Get quiz title
      const quizResponse = await api.get(`/quiz/${quizId}`);
      setQuizTitle(quizResponse.data.data.title);
      
      // Set a default time limit based on the number of questions (2 minutes per question)
      setTimeRemaining(response.data.data.length * 120);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch quiz questions');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async () => {
    try {
      // Create quiz attempt
      const response = await api.post(`/quiz-attempt/start/${quizId}`);
      setAttemptId(response.data.data.id);
      
      // Start the quiz
      setQuizStarted(true);
      setTimerActive(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to start quiz');
    }
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionId]: optionId
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitQuiz = async () => {
    if (!attemptId) return;
    
    setTimerActive(false);
    setLoading(true);
    
    try {
      // Submit answers one by one
      const currentQuestion = questions[currentQuestionIndex];
      
      if (currentQuestion && selectedOptions[currentQuestion.question]) {
        // Submit the current answer
        await api.post(`/quiz-attempt/submit/${attemptId}`, {
          questionId: currentQuestion.question,
          optionId: selectedOptions[currentQuestion.question]
        });
      }
      
      // Get final score
      const finalResponse = await api.get(`/quiz-attempt/detail-history`);
      const quizResult = finalResponse.data.data.find((quiz: any) => quiz.id === attemptId);
      
      if (quizResult) {
        setQuizScore(quizResult.score);
      }
      
      setQuizCompleted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (loading && !quizStarted) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center">
          <Link 
            href="/dashboard/employee/quizzes" 
            className="mr-4 p-1 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quizTitle}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Test your ergonomic knowledge
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

        {/* Quiz content */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          {!quizStarted && !quizCompleted ? (
            <div className="text-center space-y-6">
              <div className="h-20 w-20 mx-auto bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600">
                <BookOpen className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{quizTitle}</h2>
              <div className="text-gray-500 space-y-2">
                <p>You are about to start the quiz with {questions.length} questions.</p>
                <p>You will have {formatTime(timeRemaining)} to complete the quiz.</p>
                <p>Please ensure you have enough time to complete the quiz in one sitting.</p>
              </div>
              <button
                type="button"
                onClick={startQuiz}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700"
              >
                Start Quiz
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          ) : quizCompleted ? (
            <div className="text-center space-y-6">
              <div className="h-20 w-20 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Quiz Completed!</h2>
              <div className="text-gray-500">
                <p>Thank you for completing the quiz.</p>
                <p className="mt-2">Your score: 
                  <span className="text-2xl font-bold ml-2 text-gray-900">
                    {quizScore !== null ? `${quizScore}%` : 'Calculating...'}
                  </span>
                </p>
              </div>
              <div className="flex justify-center space-x-4">
                <Link
                  href="/dashboard/employee/quizzes"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Back to Quizzes
                </Link>
                {attemptId && (
                  <Link
                    href={`/dashboard/employee/quiz-results/${attemptId}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700"
                  >
                    View Results
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div>
              {/* Timer and progress */}
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
                <div className="flex items-center text-sm font-medium text-gray-700">
                  <Clock className="h-4 w-4 mr-1 text-gray-400" />
                  Time remaining: {formatTime(timeRemaining)}
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div 
                  className="bg-cyan-600 h-2 rounded-full" 
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Question */}
              {currentQuestion && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">{currentQuestion.question}</h3>
                  
                  {/* Options */}
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => (
                      <div 
                        key={option.id}
                        onClick={() => handleSelectOption(currentQuestion.question, option.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                          selectedOptions[currentQuestion.question] === option.id
                            ? 'border-cyan-500 bg-cyan-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div 
                            className={`w-5 h-5 rounded-full border ${
                              selectedOptions[currentQuestion.question] === option.id
                                ? 'border-cyan-500 bg-cyan-500'
                                : 'border-gray-300'
                            } flex items-center justify-center mr-3`}
                          >
                            {selectedOptions[currentQuestion.question] === option.id && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <span className="text-gray-700">{option.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Navigation buttons */}
                  <div className="flex justify-between pt-6">
                    <button
                      type="button"
                      onClick={goToPreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Previous
                    </button>
                    
                    {isLastQuestion ? (
                      <button
                        type="button"
                        onClick={submitQuiz}
                        disabled={!selectedOptions[currentQuestion.question]}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit Quiz
                        <CheckCircle className="ml-2 h-5 w-5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={goToNextQuestion}
                        disabled={!selectedOptions[currentQuestion.question]}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}