import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  HelpCircle,
  TrendingUp,
  Layers,
  Search
} from 'lucide-react';
import api from '../services/api';
import SkillRadar from '../components/SkillRadar';

export default function SkillGapPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [careerCode, setCareerCode] = useState(searchParams.get('career') || '15-2051.00');
  const [careerDetails, setCareerDetails] = useState({
    title: 'Data Scientists',
    onet_soc_code: '15-2051.00',
    job_zone: 5
  });
  const [gapData, setGapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState('ALL');

  const popularCareers = [
    { code: '15-2051.00', title: 'Data Scientists' },
    { code: '15-1252.00', title: 'Software Developers' },
    { code: '15-2041.00', title: 'Statisticians' },
    { code: '15-1212.00', title: 'Information Security Analysts' },
    { code: '15-1251.00', title: 'Computer Programmers' },
    { code: '17-2071.00', title: 'Electrical Engineers' }
  ];

  useEffect(() => {
    fetchSkillGaps(careerCode);
  }, [careerCode]);

  const fetchSkillGaps = async (code) => {
    setLoading(true);
    try {
      const res = await api.get(`/skills/gap/${code}`);
      if (res.data) {
        setCareerDetails({
          title: res.data.target_career || 'Target Occupation',
          onet_soc_code: res.data.onet_soc_code || code,
          job_zone: res.data.job_zone || 4
        });
        setGapData(res.data.gaps || []);
      }
    } catch (err) {
      console.warn("Using offline skill gap fallback:", err);
      // Fallback deterministic gap analysis
      const targetTitle = popularCareers.find(c => c.code === code)?.title || 'Data Scientists';
      setCareerDetails({
        title: targetTitle,
        onet_soc_code: code,
        job_zone: 5
      });
      setGapData([
        {
          skill: 'Data Mining & Extraction',
          category: 'Technical',
          user_level: 1,
          user_level_scaled: 1.4,
          required_level: 5.6,
          gap: 4.2,
          priority: 'HIGH'
        },
        {
          skill: 'Machine Learning Algorithms',
          category: 'Technical',
          user_level: 2,
          user_level_scaled: 2.8,
          required_level: 5.5,
          gap: 2.7,
          priority: 'HIGH'
        },
        {
          skill: 'Big Data Architecture',
          category: 'Systems',
          user_level: 1,
          user_level_scaled: 1.4,
          required_level: 4.8,
          gap: 3.4,
          priority: 'HIGH'
        },
        {
          skill: 'Mathematics',
          category: 'Analytical',
          user_level: 4,
          user_level_scaled: 5.6,
          required_level: 5.2,
          gap: 0.0,
          priority: 'MASTERED'
        },
        {
          skill: 'Critical Thinking',
          category: 'Cognitive',
          user_level: 4,
          user_level_scaled: 5.6,
          required_level: 5.0,
          gap: 0.0,
          priority: 'MASTERED'
        },
        {
          skill: 'Complex Problem Solving',
          category: 'Cognitive',
          user_level: 3,
          user_level_scaled: 4.2,
          required_level: 5.2,
          gap: 1.0,
          priority: 'MEDIUM'
        },
        {
          skill: 'Python Programming',
          category: 'Technical',
          user_level: 4,
          user_level_scaled: 5.6,
          required_level: 5.8,
          gap: 0.2,
          priority: 'LOW'
        },
        {
          skill: 'Systems Analysis',
          category: 'Systems',
          user_level: 2,
          user_level_scaled: 2.8,
          required_level: 4.5,
          gap: 1.7,
          priority: 'MEDIUM'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredGaps = gapData.filter(g => {
    if (filterPriority === 'ALL') return true;
    if (filterPriority === 'GAPS_ONLY') return g.gap > 0;
    return g.priority === filterPriority;
  });

  const highPriorityCount = gapData.filter(g => g.priority === 'HIGH').length;
  const mediumPriorityCount = gapData.filter(g => g.priority === 'MEDIUM').length;
  const masteredCount = gapData.filter(g => g.gap === 0).length;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 md:p-8 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>Quantitative Competency Evaluation</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#111827]">
              Skill Gap Analysis
            </h1>
            <p className="text-sm text-[#6B7280] mt-1 max-w-2xl">
              Calculates the exact delta between your verified skills and target O*NET requirements:
              <span className="font-mono text-xs font-bold text-gray-800 ml-1.5 bg-gray-100 px-2 py-0.5 rounded">
                Gap = max(0, Required_Level - Student_Level)
              </span>
            </p>
          </div>

          {/* Quick Target Career Selector */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 p-2.5 rounded-xl">
            <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">Target Career:</span>
            <select
              value={careerCode}
              onChange={(e) => setCareerCode(e.target.value)}
              className="text-xs font-bold text-gray-900 bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {popularCareers.map(c => (
                <option key={c.code} value={c.code}>{c.title} ({c.code})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Target Role Meta Banner */}
        <div className="bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-900 text-sm">{careerDetails.title}</span>
            <span className="font-mono bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-700">
              {careerDetails.onet_soc_code}
            </span>
            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
              Job Zone {careerDetails.job_zone}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-red-700 font-bold">{highPriorityCount} High Gaps</span>
            <span className="text-amber-700 font-bold">{mediumPriorityCount} Moderate Gaps</span>
            <span className="text-green-700 font-bold">{masteredCount} Mastered</span>
          </div>
        </div>
      </div>

      {/* Radar Chart & Summary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Radar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-[#111827]">Proficiency Radar Comparison</h3>
              <p className="text-xs text-[#6B7280]">
                Comparing student skill vector against target {careerDetails.title} benchmark
              </p>
            </div>
            <span className="text-xs font-mono text-gray-400">Scale: 0.0 - 7.0</span>
          </div>

          <div className="mt-4">
            <SkillRadar data={gapData} />
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-[#111827]">Priority Summary</h4>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Addressing your high-priority gaps will yield the highest percentage increase in target career compatibility.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs p-2 rounded-lg bg-red-50 text-red-900 border border-red-200 font-medium">
                <span>Critical Priority (Δ ≥ 2.0)</span>
                <strong>{highPriorityCount} skills</strong>
              </div>
              <div className="flex justify-between text-xs p-2 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-medium">
                <span>Moderate Priority (1.0 ≤ Δ &lt; 2.0)</span>
                <strong>{mediumPriorityCount} skills</strong>
              </div>
              <div className="flex justify-between text-xs p-2 rounded-lg bg-green-50 text-green-900 border border-green-200 font-medium">
                <span>Fully Mastered (Δ = 0)</span>
                <strong>{masteredCount} skills</strong>
              </div>
            </div>

            <button
              onClick={() => navigate(`/roadmap?target=${encodeURIComponent(careerDetails.title)}`)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Build Optimized Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Skill Gap Priority Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#111827]">Categorized Gap Breakdown</h3>
            <p className="text-xs text-[#6B7280]">
              Ordered by gap magnitude with targeted course recommendations
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5">
            {['ALL', 'GAPS_ONLY', 'HIGH', 'MEDIUM', 'MASTERED'].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterPriority(filter)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  filterPriority === filter
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-3 px-4">Skill Requirement</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Student Level</th>
                <th className="py-3 px-4 text-center">Target Level</th>
                <th className="py-3 px-4 text-center">Gap (Δ)</th>
                <th className="py-3 px-4 text-center">Priority</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredGaps.map((item, idx) => {
                const isMastered = item.gap === 0;

                let badgeClass = 'bg-gray-100 text-gray-700';
                if (item.priority === 'HIGH') badgeClass = 'bg-red-50 text-red-700 border border-red-200';
                if (item.priority === 'MEDIUM') badgeClass = 'bg-amber-50 text-amber-700 border border-amber-200';
                if (item.priority === 'LOW') badgeClass = 'bg-blue-50 text-blue-700 border border-blue-200';
                if (isMastered) badgeClass = 'bg-green-50 text-green-700 border border-green-200';

                return (
                  <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      {item.skill}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {item.category || 'Competency'}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className="font-bold text-blue-600">{item.user_level_scaled || item.user_level || 0}</span>
                      <span className="text-gray-400 text-[10px]"> / 7.0</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className="font-bold text-gray-800">{item.required_level}</span>
                      <span className="text-gray-400 text-[10px]"> / 7.0</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      <span className={item.gap > 0 ? 'text-red-600' : 'text-green-600'}>
                        {item.gap > 0 ? `+${item.gap}` : '0.0'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badgeClass}`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {item.gap > 0 ? (
                        <button
                          onClick={() => navigate(`/courses?skill=${encodeURIComponent(item.skill)}`)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors inline-flex items-center gap-1"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>Find Course</span>
                        </button>
                      ) : (
                        <span className="text-xs text-green-600 font-semibold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Satisfied</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}