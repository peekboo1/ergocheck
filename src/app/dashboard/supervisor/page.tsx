'use client';

import React, { useState, useEffect } from 'react';
import { User, CheckCircle, AlertTriangle, Clock, Activity, BarChart, BarChart2, Users, Calendar } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { BarChart as ReChartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  bgColor?: string;
}

const StatCard = ({ title, value, icon, change, trend, bgColor = 'bg-white' }: StatCardProps) => {
  return (
    <div className={`${bgColor} rounded-xl shadow-sm p-6 border border-gray-100`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-900">{value}</h3>
          {change && (
            <p className={`text-xs font-medium mt-2 flex items-center ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 
              'text-gray-500'
            }`}>
              {trend === 'up' && <span className="mr-1">↑</span>}
              {trend === 'down' && <span className="mr-1">↓</span>}
              {change}
            </p>
          )}
        </div>
        <div className="h-12 w-12 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600">
          {icon}
        </div>
      </div>
    </div>
  );
};

// Sample data for charts
const ergonomicScoreData = [
  { name: 'Jan', average: 65 },
  { name: 'Feb', average: 68 },
  { name: 'Mar', average: 72 },
  { name: 'Apr', average: 75 },
  { name: 'May', average: 79 },
];

const riskDistributionData = [
  { name: 'Low Risk', value: 60, color: '#10b981' },
  { name: 'Medium Risk', value: 30, color: '#f59e0b' },
  { name: 'High Risk', value: 10, color: '#ef4444' },
];

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

const employeeListData = [
  { id: 1, name: 'Sarah Johnson', department: 'IT', score: 85, status: 'Good' },
  { id: 2, name: 'Michael Chen', department: 'HR', score: 67, status: 'Average' },
  { id: 3, name: 'Emily Rodriguez', department: 'Marketing', score: 92, status: 'Good' },
  { id: 4, name: 'David Kim', department: 'Finance', score: 58, status: 'Needs Improvement' },
  { id: 5, name: 'Jessica Taylor', department: 'Operations', score: 74, status: 'Average' },
];

export default function SupervisorDashboard() {
  const [timeframe, setTimeframe] = useState('month');
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Supervisor Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back, {user.name}! Here's what's happening with your team's ergonomic health.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Employees"
            value="24"
            icon={<Users size={24} />}
            change="2 new this month"
            trend="up"
          />
          <StatCard
            title="Average Ergonomic Score"
            value="76/100"
            icon={<Activity size={24} />}
            change="12% improvement"
            trend="up"
          />
          <StatCard
            title="Pending Evaluations"
            value="5"
            icon={<Clock size={24} />}
            change="2 due today"
            trend="neutral"
          />
          <StatCard
            title="Upcoming Quizzes"
            value="3"
            icon={<Calendar size={24} />}
            change="Next on May 22"
            trend="neutral"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Ergonomic Score Trend */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Team Ergonomic Score Trend</h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ReChartsBarChart
                  data={ergonomicScoreData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="average"
                    name="Average Score"
                    fill="#0ea5e9"
                    radius={[4, 4, 0, 0]}
                  />
                </ReChartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Ergonomic Risk Distribution</h3>
            <div className="mt-4 h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Employee List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Employee Overview</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Department
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ergonomic Score
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employeeListData.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700">
                          {employee.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.score}/100</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          employee.status === 'Good'
                            ? 'bg-green-100 text-green-800'
                            : employee.status === 'Average'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <a href="#" className="text-cyan-600 hover:text-cyan-900 mr-4">View</a>
                      <a href="#" className="text-cyan-600 hover:text-cyan-900">Message</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}