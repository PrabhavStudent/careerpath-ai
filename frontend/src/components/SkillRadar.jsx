import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

export default function SkillRadar({ data, title = "Competency Comparison" }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-gray-400">
        No skill data available for visualization
      </div>
    );
  }

  // Format data for Radar Chart
  const chartData = data.slice(0, 8).map(d => ({
    subject: d.skill || d.name,
    "Student Level": d.user_level_scaled || d.user_level || 0,
    "Required Level": d.required_level || d.importance || 3.5
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 500 }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 7]} 
            tick={{ fill: '#9CA3AF', fontSize: 10 }} 
          />
          <Radar
            name="Your Proficiency (Scaled)"
            dataKey="Student Level"
            stroke="#2563EB"
            fill="#2563EB"
            fillOpacity={0.35}
          />
          <Radar
            name="O*NET Required Standard"
            dataKey="Required Level"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.2}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '8px', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
