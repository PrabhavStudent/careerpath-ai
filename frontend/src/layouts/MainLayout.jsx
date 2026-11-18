import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/dashboard': return 'Dashboard & Career Overview';
      case '/assessment': return 'Occupational Skill Assessment';
      case '/explorer': return 'O*NET 31.0 Career Explorer';
      case '/skills': return 'Personal Skill Gap Analysis';
      case '/roadmap': return 'Optimized Learning Roadmap';
      case '/courses': return 'Targeted Course Recommendations';
      case '/jobs': return 'Curated Job Opportunities';
      case '/profile': return 'Student Profile';
      case '/settings': return 'Platform Settings';
      default: return 'CareerPath AI';
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-xs"
        />
      )}

      <div className="md:pl-64 flex flex-col min-h-screen">
        <Navbar 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          title={getPageTitle(location.pathname)} 
        />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
