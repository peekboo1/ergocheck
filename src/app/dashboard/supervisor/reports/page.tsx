'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar, 
  ArrowDownToLine, 
  BarChart2, 
  PieChart,
  Users,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';
import api from '@/services/api';

// Sample data for ergonomic scores
const monthlyScoreData = [
  { month: 'Jan', average: 65, highRisk: 3, mediumRisk: 8, lowRisk: 13 },
  { month: 'Feb', average: 68, highRisk: 2, mediumRisk: 7, lowRisk: 15 },
  { month: 'Mar', average: 72, highRisk: 1, mediumRisk: 6, lowRisk: 17 },
  { month: 'Apr', average: 75, highRisk: 1, mediumRisk: 5, lowRisk: 18 },
  { month: 'May', average: 79, highRisk: 0, mediumRisk: 4, lowRisk: 20 },
];

// Sample data for body part risk
const bodyPartRiskData = [
  { name: 'Neck', highRisk: 3, mediumRisk: 7, lowRisk: 14 },
  { name: 'Shoulders', highRisk: 5, mediumRisk: 9, lowRisk: 10 },
  { name: 'Back', highRisk: 6, mediumRisk: 8, lowRisk: 10 },
  { name: 'Wrists', highRisk: 2, mediumRisk: 6, lowRisk: 16 },
  { name: 'Legs', highRisk: 1, mediumRisk: 4, lowRisk: 19 },
];

// Sample data for risk distribution
const riskDistributionData = [
  { name: 'Low Risk', value: 60, color: '#10b981' },
  { name: 'Medium Risk', value: 30, color: '#f59e0b' },
  { name: 'High Risk', value: 10, color: '#ef4444' },
];

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

// Sample data for top ergonomic issues
const topIssuesData = [
  { issue: 'Poor chair height', count: 12, percentage: 50 },
  { issue: 'Monitor position too low', count: 9, percentage: 37.5 },
  { issue: 'Keyboard too far', count: 8, percentage: 33.3 },
  { issue: 'Wrist positioning', count: 7, percentage: 29.2 },
  { issue: 'Inadequate lumbar support', count: 6, percentage: 25 },
];

export default function ReportsPage() {
  const [timeframe, setTimeframe] = useState('month');
  const [employees, setEmployees] = useState([]);
  const [division, setDivision] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [divisions, setDivisions] = useState([
    { id: 'all', name: 'All Divisions' },
    { id: 'it', name: 'IT' },
    { id: 'hr', name: 'Human Resources' },
    { id: 'eng', name: 'Engineering' },
  ]);
  
  const [reportType, setReportType] = useState('overview');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    // Fetch divisions and employee data
    fetchDivisions();
    fetchEmployees();
  }, []);
  
  const fetchDivisions = async () => {
    try {
      const response = await api.get('/division/get-all-division');
      const divisionData = response.data.data.divisions;
      
      // Format divisions for dropdown
      const formattedDivisions = [
        { id: 'all', name: 'All Divisions' },
        ...divisionData.map((div: any) => ({ id: div.id, name: div.name }))
      ];
      
      setDivisions(formattedDivisions);
    } catch (err) {
      console.error('Failed to fetch divisions:', err);
    }
  };
  
  const fetchEmployees = async () => {
    try {
      const response = await api.get('/supervisor/get-all-employee');
      setEmployees(response.data.data.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  const generatePdf = async () => {
    setIsGeneratingPdf(true);
    
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would call an API to generate the PDF
      // const response = await api.post('/reports/generate-pdf', {
      //   timeframe,
      //   division,
      //   reportType
      // });
      
      // Then download the file
      // window.location.href = response.data.fileUrl;
      
      alert('PDF report would be downloaded here');
    } catch (err: any) {
      setError(err.message || 'Failed to generate PDF');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const generateExcel = async () => {
    try {
      // Simulate Excel generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would call an API to generate the Excel file
      // const response = await api.post('/reports/generate-excel', {
      //   timeframe,
      //   division,
      //   reportType
      // });
      
      // Then download the file
      // window.location.href = response.data.fileUrl;
      
      alert('Excel report would be downloaded here');
    } catch (err: any) {
      setError(err.message || 'Failed to generate Excel');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="mt-1 text-sm text-gray-500">
              Generate reports and view ergonomic analytics for your team
            </p>
          </div>
        </div>

        {/* Filters and Export */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 mb-1">
                Time Period
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="timeframe"
                  className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-1">
                Division
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="division"
                  className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                >
                  {divisions.map((div) => (
                    <option key={div.id} value={div.id}>
                      {div.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">
                Report Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="reportType"
                  className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="overview">Overview Report</option>
                  <option value="detailed">Detailed Analysis</option>
                  <option value="compliance">Compliance Report</option>
                  <option value="trends">Trend Analysis</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-end space-x-2">
              <button
                type="button"
                onClick={generatePdf}
                disabled={isGeneratingPdf}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
              >
                {isGeneratingPdf ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    PDF Report
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={generateExcel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 flex-1"
              >
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                Excel
              </button>
            </div>
          </div>
        </div>

        {/* Charts and Data Section */}
        <div className="space-y-5">
          {/* Team Ergonomic Score Trend */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-5">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Team Ergonomic Score Trend</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyScoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    name="Average Score" 
                    stroke="#0ea5e9" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-5">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Risk Distribution</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={riskDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {riskDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Body Part Risk Analysis */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-5">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Body Part Risk Analysis</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={bodyPartRiskData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="lowRisk" name="Low Risk" fill="#10b981" stackId="a" />
                    <Bar dataKey="mediumRisk" name="Medium Risk" fill="#f59e0b" stackId="a" />
                    <Bar dataKey="highRisk" name="High Risk" fill="#ef4444" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Ergonomic Issues */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-5">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Top Ergonomic Issues</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Issue
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Count
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      % of Employees
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Severity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topIssuesData.map((issue, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {issue.issue}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {issue.count} employees
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-cyan-600 h-2.5 rounded-full"
                              style={{ width: `${issue.percentage}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-500">{issue.percentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            index === 0 || index === 1
                              ? 'bg-red-100 text-red-800'
                              : index === 2 || index === 3
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {index === 0 || index === 1
                            ? 'High'
                            : index === 2 || index === 3
                            ? 'Medium'
                            : 'Low'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Team Compliance Summary */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Team Compliance Summary</h2>
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Compliant</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">18</p>
                    <p className="text-sm text-gray-500 mt-1">employees</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Due for Evaluation</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">4</p>
                    <p className="text-sm text-gray-500 mt-1">employees</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">High Risk</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
                    <p className="text-sm text-gray-500 mt-1">employees</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                </div>
              </div>
              
              <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">78/100</p>
                    <p className="text-sm text-gray-500 mt-1">team overall</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                    <BarChart2 className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}