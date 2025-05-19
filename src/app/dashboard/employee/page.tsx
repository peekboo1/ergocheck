'use client';

import React, { useState } from 'react';
import { Calendar, Activity, Award, CheckCircle, AlertTriangle, Camera, BookOpen } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';

// Sample data for progress chart
const progressData = [
  { date: 'Jan 1', score: 55 },
  { date: 'Jan 15', score: 58 },
  { date: 'Feb 1', score: 62 },
  { date: 'Feb 15', score: 65 },
  { date: 'Mar 1', score: 69 },
  { date: 'Mar 15', score: 72 },
  { date: 'Apr 1', score: 75 },
  { date: 'Apr 15', score: 77 },
  { date: 'May 1', score: 80 },
  { date: 'May 15', score: 83 },
];

// Sample data for recent evaluations
const recentEvaluations = [
  { id: 1, date: 'May 15, 2025', score: 83, status: 'Good', areas: ['Posture', 'Desk Height', 'Monitor Position'] },
  { id: 2, date: 'May 1, 2025', score: 80, status: 'Good', areas: ['Posture', 'Desk Height', 'Monitor Position'] },
  { id: 3, date: 'Apr 15, 2025', score: 77, status: 'Average', areas: ['Posture', 'Desk Height', 'Monitor Position'] },
];

// Sample badges/achievements
const badges = [
  { id: 1, name: 'First Evaluation', icon: <Camera size={24} />, earned: true, date: 'Jan 1, 2025' },
  { id: 2, name: 'Posture Perfect', icon: <CheckCircle size={24} />, earned: true, date: 'Mar 15, 2025' },
  { id: 3, name: 'Quiz Master', icon: <BookOpen size={24} />, earned: false },
  { id: 4, name: 'Consistent Improver', icon: <Activity size={24} />, earned: true, date: 'Apr 1, 2025' },
  { id: 5, name: 'Ergonomics Champion', icon: <Award size={24} />, earned: false },
];

// Sample upcoming assessments
const upcomingAssessments = [
  { id: 1, type: 'Posture Evaluation', date: 'May 25, 2025', time: '10:00 AM' },
  { id: 2, type: 'Ergonomics Quiz', date: 'June 1, 2025', time: '2:00 PM' },
];

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';

  if (status === 'Good') {
    bgColor = 'bg-green-100';
    textColor = 'text-green-800';
  } else if (status === 'Average') {
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-800';
  } else if (status === 'Needs Improvement') {
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
  }

  return (
    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};

export default function EmployeeDashboard() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Ergonomic Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user.name}! Monitor your ergonomic health and progress.
          </p>
        </div>

        {/* Current Score & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Score */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 lg:col-span-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Your Ergonomic Progress</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Track your ergonomic improvement over time
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <StatusBadge status="Good" />
              </div>
            </div>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[50, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="score"
                    name="Ergonomic Score"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            <div className="mt-6 space-y-4">
              <a
                href="/dashboard/employee/posture-evaluation"
                className="block w-full py-3 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-center font-medium transition-colors duration-200"
              >
                <div className="flex items-center justify-center">
                  <Camera size={18} className="mr-2" />
                  Start Posture Evaluation
                </div>
              </a>
              <a
                href="/dashboard/employee/quizzes"
                className="block w-full py-3 px-4 rounded-lg bg-white hover:bg-gray-50 text-gray-700 text-center font-medium border border-gray-300 transition-colors duration-200"
              >
                <div className="flex items-center justify-center">
                  <BookOpen size={18} className="mr-2" />
                  Take Ergonomic Quiz
                </div>
              </a>
              <a
                href="/dashboard/employee/recommendations"
                className="block w-full py-3 px-4 rounded-lg bg-white hover:bg-gray-50 text-gray-700 text-center font-medium border border-gray-300 transition-colors duration-200"
              >
                <div className="flex items-center justify-center">
                  <CheckCircle size={18} className="mr-2" />
                  View Recommendations
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Recent Evaluations & Upcoming Assessments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Evaluations */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Evaluations</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {recentEvaluations.map((evaluation) => (
                <li key={evaluation.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{evaluation.date}</p>
                      <div className="mt-1 flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Score: {evaluation.score}/100</span>
                        <StatusBadge status={evaluation.status} />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {evaluation.areas.map((area, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                    <a
                      href={`/dashboard/employee/evaluations/${evaluation.id}`}
                      className="text-cyan-600 hover:text-cyan-900 text-sm font-medium"
                    >
                      View Details
                    </a>
                  </div>
                </li>
              ))}
            </ul>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <a
                href="/dashboard/employee/evaluations"
                className="text-sm font-medium text-cyan-600 hover:text-cyan-900"
              >
                View all evaluations →
              </a>
            </div>
          </div>

          {/* Upcoming Assessments */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Upcoming Assessments</h3>
            </div>
            {upcomingAssessments.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {upcomingAssessments.map((assessment) => (
                  <li key={assessment.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{assessment.type}</p>
                        <p className="mt-1 text-sm text-gray-500">
                          {assessment.date} at {assessment.time}
                        </p>
                      </div>
                      <a
                        href="#"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
                      >
                        Add to Calendar
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-6 py-8 text-center">
                <p className="text-sm text-gray-500">No upcoming assessments scheduled.</p>
              </div>
            )}
          </div>
        </div>

        {/* Achievements & Badges */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">Your Achievements</h3>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`flex flex-col items-center p-4 rounded-lg border ${
                  badge.earned ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200 opacity-50'
                }`}
              >
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    badge.earned ? 'bg-cyan-100 text-cyan-600' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {badge.icon}
                </div>
                <p className="mt-3 text-sm font-medium text-center text-gray-900">{badge.name}</p>
                {badge.earned ? (
                  <p className="mt-1 text-xs text-gray-500">Earned {badge.date}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">Not yet earned</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}