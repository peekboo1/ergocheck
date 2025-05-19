'use client';

import React, { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  Settings, 
  HelpCircle, 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  Award,
  BookOpen,
  CheckSquare,
  BarChart4,
  Camera
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarNavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  children?: ReactNode;
}

const SidebarNavItem = ({ icon, label, href, active = false, children }: SidebarNavItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = Boolean(children);

  return (
    <div>
      {hasChildren ? (
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium ${
            active
              ? 'bg-cyan-50 text-cyan-600'
              : 'text-gray-600 hover:bg-gray-100'
          } transition-colors duration-200`}
        >
          {icon}
          <span className="flex-1">{label}</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      ) : (
        <Link
          href={href}
          className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium ${
            active
              ? 'bg-cyan-50 text-cyan-600'
              : 'text-gray-600 hover:bg-gray-100'
          } transition-colors duration-200`}
        >
          {icon}
          <span>{label}</span>
        </Link>
      )}

      {hasChildren && expanded && (
        <div className="pl-10 py-1 space-y-1">{children}</div>
      )}
    </div>
  );
};

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Menu items based on user role
  const getSidebarItems = () => {
    if (!user) return [];

    const roleBasedItems = {
      supervisor: [
        {
          icon: <LayoutDashboard size={20} />,
          label: 'Dashboard',
          href: '/dashboard/supervisor',
        },
        {
          icon: <Users size={20} />,
          label: 'Employees',
          href: '/dashboard/supervisor/employees',
        },
        {
          icon: <BarChart4 size={20} />,
          label: 'Ergonomic Data',
          href: '/dashboard/supervisor/ergonomic-data',
        },
        {
          icon: <Calendar size={20} />,
          label: 'Evaluation Schedule',
          href: '/dashboard/supervisor/schedule',
        },
        {
          icon: <BookOpen size={20} />,
          label: 'Quiz Management',
          href: '/dashboard/supervisor/quizzes',
        },
        {
          icon: <FileText size={20} />,
          label: 'Reports',
          href: '/dashboard/supervisor/reports',
        },
      ],
      employee: [
        {
          icon: <LayoutDashboard size={20} />,
          label: 'Dashboard',
          href: '/dashboard/employee',
        },
        {
          icon: <Camera size={20} />,
          label: 'Posture Evaluation',
          href: '/dashboard/employee/posture-evaluation',
        },
        {
          icon: <CheckSquare size={20} />,
          label: 'Recommendations',
          href: '/dashboard/employee/recommendations',
        },
        {
          icon: <BookOpen size={20} />,
          label: 'Quiz & Learning',
          href: '/dashboard/employee/quizzes',
        },
        {
          icon: <Award size={20} />,
          label: 'Progress & Rewards',
          href: '/dashboard/employee/progress',
        },
      ],
      personal: [
        {
          icon: <LayoutDashboard size={20} />,
          label: 'Dashboard',
          href: '/dashboard/personal',
        },
        {
          icon: <Camera size={20} />,
          label: 'Posture Evaluation',
          href: '/dashboard/personal/posture-evaluation',
        },
        {
          icon: <CheckSquare size={20} />,
          label: 'Recommendations',
          href: '/dashboard/personal/recommendations',
        },
        {
          icon: <BookOpen size={20} />,
          label: 'Learning Materials',
          href: '/dashboard/personal/learning',
        },
        {
          icon: <Award size={20} />,
          label: 'Progress & Rewards',
          href: '/dashboard/personal/progress',
        },
      ],
      superadmin: [
        {
          icon: <LayoutDashboard size={20} />,
          label: 'Dashboard',
          href: '/dashboard/superadmin',
        },
        {
          icon: <Users size={20} />,
          label: 'User Management',
          href: '/dashboard/superadmin/users',
        },
        {
          icon: <FileText size={20} />,
          label: 'Content Management',
          href: '/dashboard/superadmin/content',
        },
        {
          icon: <Settings size={20} />,
          label: 'System Configuration',
          href: '/dashboard/superadmin/configuration',
        },
      ],
    };

    return roleBasedItems[user.role as keyof typeof roleBasedItems] || [];
  };

  const sidebarItems = getSidebarItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="px-4 py-6 flex items-center justify-between border-b border-gray-200">
            <Link href="/" className="text-2xl font-bold text-cyan-600 flex items-center gap-2">
              <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                <path d="M12 11h4"></path>
                <path d="M12 16h4"></path>
                <path d="M8 11h.01"></path>
                <path d="M8 16h.01"></path>
              </svg>
              ErgoCheck
            </Link>
            <button
              className="lg:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto pt-5 pb-4">
            <nav className="px-3 space-y-1">
              {sidebarItems.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  active={pathname === item.href}
                />
              ))}
            </nav>
          </div>

          {/* Sidebar footer */}
          <div className="border-t border-gray-200 pt-4 pb-3 px-3">
            <div className="flex items-center px-3 py-2">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-semibold">
                  {user?.name?.charAt(0)}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-700">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                href="/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                <Settings size={16} />
                Settings
              </Link>
              <Link
                href="/help"
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                <HelpCircle size={16} />
                Help & Support
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <div className="sticky top-0 z-10 flex items-center justify-between h-16 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="lg:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center">
            <button className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none">
              <Bell size={20} />
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}