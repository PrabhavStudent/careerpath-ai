import React from 'react';
import { Menu, Bell, Search, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenuClick, title = "Overview" }) {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-[#FFFFFF] border-b border-[#E5E7EB] flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-[#6B7280] hover:text-[#111827] rounded-lg hover:bg-[#F7F8FA]"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-[#111827]">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Verification Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full text-[11px] font-medium text-green-700">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>O*NET 31.0 Official Data</span>
        </div>

        {/* User initials badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E5E7EB]">
          <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'S'}
          </div>
          <span className="hidden md:inline-block text-xs font-medium text-[#111827]">
            {user?.full_name || 'Student'}
          </span>
        </div>
      </div>
    </header>
  );
}
