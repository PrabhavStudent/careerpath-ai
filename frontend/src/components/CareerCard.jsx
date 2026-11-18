import React from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CareerCard({ career, onSelect, showActions = true }) {
  const navigate = useNavigate();
  const score = career.compatibility_score || 80.0;

  const getScoreColor = (val) => {
    if (val >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (val >= 65) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#E5E7EB] p-5 shadow-xs hover:shadow-sm hover:border-gray-300 transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md">
                {career.onet_soc_code}
              </span>
              <span className="text-xs text-[#6B7280]">Job Zone {career.job_zone || 4}</span>
            </div>
            <h3 className="text-base font-bold text-[#111827] mt-1.5 line-clamp-1">
              {career.title}
            </h3>
          </div>

          <div className={`px-2.5 py-1 rounded-lg border font-bold text-xs flex items-center gap-1 ${getScoreColor(score)}`}>
            <span>{score}%</span>
            <span className="text-[10px] font-normal uppercase">Match</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[#6B7280] mt-2.5 line-clamp-2 leading-relaxed">
          {career.description || "Occupational profile derived from official O*NET 31.0 database requirements."}
        </p>

        {/* Strengths & Gaps Pills */}
        <div className="mt-4 pt-3 border-t border-[#E5E7EB] space-y-2">
          {career.matching_strengths && career.matching_strengths.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-medium text-green-700 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-600" />
                Strengths:
              </span>
              {career.matching_strengths.slice(0, 2).map((s, idx) => (
                <span key={idx} className="text-[11px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
                  {s}
                </span>
              ))}
            </div>
          )}

          {career.critical_skill_gaps && career.critical_skill_gaps.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-medium text-amber-700 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                Gaps:
              </span>
              {career.critical_skill_gaps.slice(0, 2).map((g, idx) => (
                <span key={idx} className="text-[11px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      {showActions && (
        <div className="mt-5 pt-3 border-t border-[#E5E7EB] flex items-center justify-between gap-2">
          <button
            onClick={() => onSelect ? onSelect(career) : navigate(`/skills?career=${career.onet_soc_code}`)}
            className="text-xs font-semibold text-[#2563EB] hover:text-blue-700 flex items-center gap-1"
          >
            <span>Analyze Skill Gap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => navigate(`/roadmap?target=${encodeURIComponent(career.title)}`)}
            className="text-xs font-medium text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-2.5 py-1.5 rounded-lg border border-gray-200 transition-colors"
          >
            Learning Path
          </button>
        </div>
      )}
    </div>
  );
}
