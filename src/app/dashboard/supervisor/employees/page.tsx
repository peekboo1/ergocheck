'use client';

import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Edit, Trash2, User, Mail, ExternalLink, ChevronDown, ChevronUp, Filter, Download } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import api from '@/services/api';

interface Division {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  divisionName: string;
  companyName: string;
}

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // For adding new employee
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    password: '',
    divisionId: '',
  });
  
  // For filtering and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [divisionFilter, setDivisionFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'name' | 'email' | 'divisionName'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchEmployees();
    fetchDivisions();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.get('/supervisor/get-all-employee');
      setEmployees(response.data.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchDivisions = async () => {
    try {
      const response = await api.get('/division/get-all-division');
      setDivisions(response.data.data.divisions);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch divisions');
    }
  };

  const handleAddEmployee = async () => {
    // Validate form
    if (!newEmployee.name.trim() || !newEmployee.email.trim() || !newEmployee.password || !newEmployee.divisionId) {
      setError('Please fill all required fields');
      return;
    }

    try {
      const response = await api.post('/employee/register', newEmployee);
      fetchEmployees(); // Refetch employees to get the updated list
      setNewEmployee({
        name: '',
        email: '',
        password: '',
        divisionId: '',
      });
      setIsAddingEmployee(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add employee');
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    try {
      await api.delete(`/employee/${employeeId}`);
      setEmployees(employees.filter(emp => emp.id !== employeeId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete employee');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const toggleSort = (field: 'name' | 'email' | 'divisionName') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort employees
  const filteredAndSortedEmployees = employees
    .filter(emp => 
      (searchTerm === '' || 
       emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       emp.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (divisionFilter === 'all' || emp.divisionName === divisionFilter)
    )
    .sort((a, b) => {
      const directionModifier = sortDirection === 'asc' ? 1 : -1;
      
      if (sortField === 'name') {
        return a.name.localeCompare(b.name) * directionModifier;
      } else if (sortField === 'email') {
        return a.email.localeCompare(b.email) * directionModifier;
      } else if (sortField === 'divisionName') {
        return a.divisionName.localeCompare(b.divisionName) * directionModifier;
      }
      
      return 0;
    });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your team members and their access
            </p>
          </div>
          <div className="mt-4 flex md:mt-0">
            <button
              type="button"
              onClick={() => setIsAddingEmployee(true)}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Employee
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

        {/* Add employee form */}
        {isAddingEmployee && (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Employee</h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={newEmployee.name}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={newEmployee.email}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={newEmployee.password}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="divisionId" className="block text-sm font-medium text-gray-700">
                  Division
                </label>
                <div className="mt-1">
                  <select
                    id="divisionId"
                    name="divisionId"
                    value={newEmployee.divisionId}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Select Division</option>
                    {divisions.map((division) => (
                      <option key={division.id} value={division.id}>
                        {division.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddingEmployee(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddEmployee}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  Add Employee
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
                placeholder="Search employees by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                value={divisionFilter}
                onChange={(e) => setDivisionFilter(e.target.value)}
              >
                <option value="all">All Divisions</option>
                {divisions.map((division) => (
                  <option key={division.id} value={division.name}>
                    {division.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Employee list */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Your Team</h3>
            <button
              type="button"
              onClick={() => {}}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
          </div>
          
          {/* Table */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Name</span>
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('email')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Email</span>
                    {sortField === 'email' && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('divisionName')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Division</span>
                    {sortField === 'divisionName' && (
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
                    Loading employees...
                  </td>
                </tr>
              ) : filteredAndSortedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchTerm || divisionFilter !== 'all' ? 'No employees match your search' : 'No employees found. Add your first employee!'}
                  </td>
                </tr>
              ) : (
                filteredAndSortedEmployees.map((employee) => (
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
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-1.5" />
                        {employee.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full bg-cyan-100 text-cyan-800">
                        {employee.divisionName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/dashboard/supervisor/employees/${employee.id}`}
                          className="text-cyan-600 hover:text-cyan-900 p-1 rounded hover:bg-cyan-50"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteEmployee(employee.id)}
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