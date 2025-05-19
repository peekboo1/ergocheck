'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Calendar, Filter, BarChart2, CheckCircle, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '@/services/api';

interface EvaluationHistory {
  id: string;
  userId: string;
  fileUrl: string;
  skorBahuRula: number;
  skorLeherReba: number;
  skorLututReba: number;
  skorPergelanganRula: number;
  skorSikuReba: number;
  skorSikuRula: number;
  skorTrunkReba: number;
  totalReba: number;
  totalRula: number;
  feedback: string;
  createdAt: string;
  updatedAt: string;
}

export default function EvaluationHistory() {
  const [evaluations, setEvaluations] = useState<EvaluationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'all' | '3months' | '6months' | '1year'>('all');
  const [filterType, setFilterType] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  
  useEffect(() => {
    fetchEvaluationHistory();
  }, []);

  const fetchEvaluationHistory = async () => {
    setLoading(true);
    try {
      // Get current user ID from local storage
      const user = localStorage.getItem('user');
      const userId = user ? JSON.parse(user).id : null;
      
      if (userId) {
        const response = await api.get(`/ergonomic/history/${userId}`);
        setEvaluations(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch evaluation history');
    } finally {
      setLoading(false);
    }
  };

  const downloadHistory = async () => {
    try {
      // Get current user ID from local storage
      const user = localStorage.getItem('user');
      const userId = user ? JSON.parse(user).id : null;
      
      if (userId) {
        const response = await api.get(`/ergonomic/download-history/${userId}`, {
          responseType: 'blob',
        });
        
        // Create a download link and trigger download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `ergonomic-history-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to download history');
    }
  };

  // Apply filters to evaluations
  const filteredEvaluations = evaluations.filter(evaluation => {
    // Time filter
    if (timeRange !== 'all') {
      const evalDate = new Date(evaluation.createdAt);
      const now = new Date();
      const monthsDiff = (now.getFullYear() - evalDate.getFullYear()) * 12 + now.getMonth() - evalDate.getMonth();
      
      if (timeRange === '3months' && monthsDiff > 3) return false;
      if (timeRange === '6months' && monthsDiff > 6) return false;
      if (timeRange === '1year' && monthsDiff > 12) return false;
    }
    
    // Risk level filter
    if (filterType !== 'all') {
      const combinedScore = (evaluation.totalReba + evaluation.totalRula) / 2;
      
      if (filterType === 'high' && combinedScore < 7) return false;
      if (filterType === 'medium' && (combinedScore < 4 || combinedScore > 6)) return false;
      if (filterType === 'low' && combinedScore > 3) return false;
    }
    
    return true;
  });

  // Prepare chart data
  const chartData = evaluations.map(evaluation => ({
    date: new Date(evaluation.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    RULA: evaluation.totalRula * 10, // Scale to 0-100
    REBA: evaluation.totalReba * 10, // Scale to 0-100
    combined: ((evaluation.totalRula + evaluation.totalReba) / 2) * 10 // Average and scale
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Helper function to determine risk level
  const getRiskLevel = (evaluation: EvaluationHistory) => {
    const combinedScore = (evaluation.totalReba + evaluation.totalRula) / 2;
    
    if (combinedScore >= 7) return { label: 'High Risk', color: 'text-red-600 bg-red-100' };
    if (combinedScore >= 4) return { label: 'Medium Risk', color: 'text-yellow-600 bg-yellow-100' };
    return { label: 'Low Risk', color: 'text-green-600 bg-green-100' };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center">
          <Link 
            href="/dashboard/employee" 
            className="mr-4 p-1 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Evaluation History</h1>
            <p className="mt-1 text-sm text-gray-500">
              View your posture evaluation history and trends
            </p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
              >
                <option value="all">All Time</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
            </div>
            <div className="relative md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
              >
                <option value="all">All Risk Levels</option>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
              </select>
            </div>
            <button
              type="button"
              onClick={downloadHistory}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              <Download className="mr-2 h-5 w-5" />
              Download CSV
            </button>
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

        {/* Score Trend Chart */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Ergonomic Score Trend</h2>
          {chartData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="RULA" 
                    name="RULA Score" 
                    stroke="#0ea5e9" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="REBA" 
                    name="REBA Score" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="combined" 
                    name="Combined Score" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No evaluation data available to display trends
            </div>
          )}
        </div>

        {/* Evaluations List */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Evaluation Results</h3>
          </div>
          
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-gray-500">Loading evaluations...</p>
            </div>
          ) : filteredEvaluations.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              {evaluations.length === 0 ? 
                "No evaluations found. Start your first posture evaluation!" :
                "No evaluations match your current filters."
              }
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredEvaluations.map((evaluation) => {
                const riskLevel = getRiskLevel(evaluation);
                
                return (
                  <li key={evaluation.id} className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <span 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskLevel.color} mr-2`}
                          >
                            {riskLevel.label}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(evaluation.createdAt).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <h4 className="mt-2 text-lg font-medium text-gray-900">
                          Posture Evaluation Results
                        </h4>
                        <div className="mt-2 flex items-center space-x-4 text-sm">
                          <div>
                            <span className="text-gray-500">RULA Score:</span>{' '}
                            <span className="font-medium">{evaluation.totalRula}/10</span>
                          </div>
                          <div>
                            <span className="text-gray-500">REBA Score:</span>{' '}
                            <span className="font-medium">{evaluation.totalReba}/10</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Combined:</span>{' '}
                            <span className="font-medium">
                              {((evaluation.totalRula + evaluation.totalReba) / 2).toFixed(1)}/10
                            </span>
                          </div>
                        </div>
                        
                        {/* Body part scores */}
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                          <div className="bg-gray-50 rounded p-2">
                            <div className="text-xs text-gray-500">Neck</div>
                            <div className="text-sm font-medium">{evaluation.skorLeherReba}/10</div>
                          </div>
                          <div className="bg-gray-50 rounded p-2">
                            <div className="text-xs text-gray-500">Shoulder/Arm</div>
                            <div className="text-sm font-medium">{evaluation.skorBahuRula}/10</div>
                          </div>
                          <div className="bg-gray-50 rounded p-2">
                            <div className="text-xs text-gray-500">Elbow</div>
                            <div className="text-sm font-medium">{evaluation.skorSikuReba}/10</div>
                          </div>
                          <div className="bg-gray-50 rounded p-2">
                            <div className="text-xs text-gray-500">Wrist</div>
                            <div className="text-sm font-medium">{evaluation.skorPergelanganRula}/10</div>
                          </div>
                          <div className="bg-gray-50 rounded p-2">
                            <div className="text-xs text-gray-500">Back/Trunk</div>
                            <div className="text-sm font-medium">{evaluation.skorTrunkReba}/10</div>
                          </div>
                        </div>
                        
                        {/* Feedback */}
                        <div className="mt-4 p-3 bg-cyan-50 border border-cyan-100 rounded text-sm text-gray-700">
                          <div className="font-medium mb-1">Recommendations:</div>
                          {evaluation.feedback}
                        </div>
                      </div>
                      
                      {/* Image preview */}
                      <div className="ml-4 flex-shrink-0">
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${evaluation.fileUrl}`}
                          alt="Posture evaluation result"
                          className="w-32 h-32 object-cover rounded border border-gray-200"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 text-right">
                      <Link
                        href={`/dashboard/employee/evaluation/${evaluation.id}`}
                        className="text-cyan-600 hover:text-cyan-900 font-medium text-sm"
                      >
                        View Full Details
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}