import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Compass, 
  Activity, 
  GitFork, 
  BookOpen, 
  Briefcase, 
  User, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Career Assessment', path: '/assessment', icon: ClipboardCheck },
    { name: 'Career Explorer', path: '/explorer', icon: Compass },
    { name: 'Skill Analysis', path: '/skills', icon: Activity },
    { name: 'Learning Roadmap', path: '/roadmap', icon: GitFork },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Job Opportunities', path: '/jobs', icon: Briefcase },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen transition-transform bg-[#FFFFFF] border-r border-[#E5E7EB] w-64 flex flex-col justify-between ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-[#E5E7EB]">
          <NavLink to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-[#111827] tracking-tight">
              CareerPath <span className="text-[#2563EB]">AI</span>
            </span>
          </NavLink>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen && setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-[#2563EB] font-semibold'
                      : 'text-[#6B7280] hover:bg-[#F7F8FA] hover:text-[#111827]'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-[#E5E7EB] bg-[#F7F8FA]/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-xs flex-shrink-0">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-[#111827] truncate">
                {user?.full_name || 'Student Account'}
              </p>
              <p className="text-[11px] text-[#6B7280] truncate">
                {user?.email || 'student@careerpath.ai'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 text-[#6B7280] hover:text-[#DC2626] hover:bg-white rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
