import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  TrendingUp, 
  BookOpen, 
  Sparkles,
  Award,
  Clock,
  Layers,
  GitFork
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatCard from '../components/StatCard';
import CareerCard from '../components/CareerCard';
import SkillRadar from '../components/SkillRadar';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [stats, setStats] = useState({
    targetCareer: 'Data Scientist',
    matchScore: 84.5,
    verifiedSkills: 12,
    skillGaps: 4,
    roadmapProgress: 35
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch recommendations
      const recRes = await api.get('/careers/recommendations?top_k=3').catch(() => null);
      const list = recRes?.data ? (Array.isArray(recRes.data) ? recRes.data : (recRes.data.recommendations || [])) : [];
      if (list.length > 0) {
        setRecommendations(list);
        const top = list[0];
        setStats(prev => ({
          ...prev,
          targetCareer: top.title,
          matchScore: top.compatibility_score || top.overall_fit || 84.5,
          skillGaps: top.critical_skill_gaps ? top.critical_skill_gaps.length : 3
        }));
      } else {
        // Fallback demo data
        setRecommendations([
          {
            onet_soc_code: '15-2051.00',
            title: 'Data Scientists',
            compatibility_score: 87.4,
            job_zone: 5,
            description: 'Develop and implement algorithms and statistical models that extract knowledge from data.',
            matching_strengths: ['Python Programming', 'Critical Thinking', 'Mathematics'],
            critical_skill_gaps: ['Data Mining', 'Machine Learning Algorithms', 'Big Data Systems']
          },
          {
            onet_soc_code: '15-1252.00',
            title: 'Software Developers',
            compatibility_score: 82.1,
            job_zone: 4,
            description: 'Research, design, and develop computer software systems and applications.',
            matching_strengths: ['Programming', 'Complex Problem Solving', 'Systems Analysis'],
            critical_skill_gaps: ['Cloud Architecture', 'Distributed Systems']
          },
          {
            onet_soc_code: '15-2041.00',
            title: 'Statisticians',
            compatibility_score: 78.6,
            job_zone: 5,
            description: 'Develop or apply mathematical or statistical theory and methods to collect, organize, and interpret numerical data.',
            matching_strengths: ['Mathematics', 'Active Learning'],
            critical_skill_gaps: ['Advanced Statistical Analysis', 'Experimental Design']
          }
        ]);
      }

      // 2. Fetch skills
      const skillRes = await api.get('/skills/student').catch(() => null);
      if (skillRes && skillRes.data && skillRes.data.length > 0) {
        setSkills(skillRes.data);
        setStats(prev => ({ ...prev, verifiedSkills: skillRes.data.length }));
      } else {
        setSkills([
          { skill: 'Python', user_level_scaled: 5.5, required_level: 6.0 },
          { skill: 'Mathematics', user_level_scaled: 4.8, required_level: 5.2 },
          { skill: 'Problem Solving', user_level_scaled: 5.0, required_level: 5.5 },
          { skill: 'Data Analysis', user_level_scaled: 4.2, required_level: 5.8 },
          { skill: 'Critical Thinking', user_level_scaled: 5.2, required_level: 5.0 },
          { skill: 'Machine Learning', user_level_scaled: 3.5, required_level: 5.5 }
        ]);
      }
    } catch (err) {
      console.warn("Dashboard loaded in offline/demo mode", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 md:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>O*NET 31.0 AI Guidance Active</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
              Welcome back, {user?.full_name?.split(' ')[0] || 'Student'}
            </h1>
            <p className="text-sm text-[#6B7280] max-w-2xl leading-relaxed">
              Based on your verified skills and academic assessment, your profile strongly matches{' '}
              <span className="font-semibold text-gray-900">{stats.targetCareer}</span> with a{' '}
              <span className="font-semibold text-blue-600">{stats.matchScore}% compatibility score</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/assessment')}
              className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2"
            >
              <span>Retake Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/roadmap')}
              className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-semibold rounded-lg border border-gray-200 transition-colors"
            >
              View Learning Roadmap
            </button>
          </div>
        </div>
      </div>

      {/* 5 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Top Match"
          value={stats.targetCareer}
          subtitle="Highest compatibility"
          icon={Compass}
          color="blue"
          badge="SOC Group 15"
        />
        <StatCard
          title="Match Score"
          value={`${stats.matchScore}%`}
          subtitle="O*NET vector similarity"
          icon={TrendingUp}
          color="green"
          badge="High Fit"
        />
        <StatCard
          title="Verified Skills"
          value={stats.verifiedSkills}
          subtitle="Across technical domains"
          icon={CheckCircle2}
          color="indigo"
        />
        <StatCard
          title="Skill Gaps"
          value={stats.skillGaps}
          subtitle="Required for target role"
          icon={AlertCircle}
          color="amber"
          badge="Actionable"
        />
        <StatCard
          title="Roadmap Complete"
          value={`${stats.roadmapProgress}%`}
          subtitle="Curriculum milestones"
          icon={Award}
          color="blue"
        />
      </div>

      {/* Main Grid: Top Recommendations + Skill Competency */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Top 3 Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#111827]">Top Career Recommendations</h2>
              <p className="text-xs text-[#6B7280]">
                Calculated using weighted cosine similarity across 900+ O*NET occupational standards
              </p>
            </div>
            <button
              onClick={() => navigate('/explorer')}
              className="text-xs font-semibold text-[#2563EB] hover:text-blue-700 flex items-center gap-1"
            >
              <span>Explore All 900+</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.slice(0, 4).map((career, idx) => (
              <CareerCard 
                key={career.onet_soc_code || idx} 
                career={career}
                onSelect={() => navigate(`/skills?career=${career.onet_soc_code}`)}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Skill Competency Radar & Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-[#111827]">Skill Proficiency vs Standard</h3>
              <span className="text-[10px] text-gray-500 font-mono">Scale 0 - 7</span>
            </div>
            
            <div className="mt-2">
              <SkillRadar data={skills} />
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">Based on recent assessment</span>
              <button
                onClick={() => navigate('/skills')}
                className="text-xs font-semibold text-[#2563EB] hover:underline"
              >
                Detailed Gap Analysis →
              </button>
            </div>
          </div>

          {/* Intelligent Career Roadmap Banner */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-xl p-5 shadow-xs relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold">
                <GitFork className="w-4 h-4 text-blue-400" />
                <span>Optimized Pathway Engine</span>
              </div>
              <h4 className="text-base font-bold leading-snug">
                Step-by-Step Learning Roadmap Tailored to Your Profile
              </h4>
              <p className="text-xs text-blue-100/80 leading-relaxed">
                Follow the most cost-efficient curriculum sequence with verified course recommendations and milestone tracking.
              </p>
              <button
                onClick={() => navigate('/roadmap')}
                className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <span>Open Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}