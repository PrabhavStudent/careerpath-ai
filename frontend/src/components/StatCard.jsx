import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, badge, color = 'blue' }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    indigo: 'bg-indigo-50 text-indigo-600'
  };

  return (
    <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-[#111827] mt-1.5">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${colorMap[color] || colorMap.blue}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-[#6B7280]">{subtitle}</span>
        {badge && (
          <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
