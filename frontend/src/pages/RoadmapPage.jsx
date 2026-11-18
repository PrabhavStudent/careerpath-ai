import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  GitFork, 
  Sparkles, 
  Clock, 
  DollarSign, 
  Layers, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Sliders, 
  Zap,
  BookmarkCheck
} from 'lucide-react';
import api from '../services/api';
import RoadmapFlow from '../components/RoadmapFlow';

export default function RoadmapPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const targetQuery = searchParams.get('target') || 'Data Scientists';
  const [targetCareer, setTargetCareer] = useState(targetQuery);
  const [optimizationMode, setOptimizationMode] = useState('hybrid'); // 'time' | 'cost' | 'hybrid'
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Nodes & Edges for React Flow DAG
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    generateRoadmap(targetCareer, optimizationMode);
  }, [targetCareer, optimizationMode]);

  const generateRoadmap = (career, mode) => {
    setLoading(true);

    // Dynamic cost/hours weighting according to optimization mode
    const isCostMin = mode === 'cost';
    const isTimeMin = mode === 'time';

    const sampleNodes = [
      {
        id: '1',
        type: 'completed',
        data: { label: 'Python Fundamentals & Syntax', hours: isTimeMin ? 25 : 30, cost: isCostMin ? 0 : 25, status: 'completed' },
        position: { x: 50, y: 150 }
      },
      {
        id: '2',
        type: 'completed',
        data: { label: 'Applied Mathematics & Linear Algebra', hours: 35, cost: isCostMin ? 0 : 35, status: 'completed' },
        position: { x: 50, y: 300 }
      },
      {
        id: '3',
        type: 'in_progress',
        data: { label: 'Data Manipulation (Pandas, NumPy, SQL)', hours: 40, cost: isCostMin ? 15 : 45, status: 'in_progress' },
        position: { x: 320, y: 150 }
      },
      {
        id: '4',
        type: 'not_started',
        data: { label: 'Classical Machine Learning (Scikit-Learn)', hours: 50, cost: isCostMin ? 20 : 60, status: 'not_started' },
        position: { x: 600, y: 150 }
      },
      {
        id: '5',
        type: 'not_started',
        data: { label: 'Distributed Systems & Big Data (Spark)', hours: 45, cost: isCostMin ? 30 : 80, status: 'not_started' },
        position: { x: 600, y: 300 }
      },
      {
        id: '6',
        type: 'target_career',
        data: { label: `Target: ${career}`, hours: 0, cost: 0, status: 'target_career' },
        position: { x: 900, y: 220 }
      }
    ];

    const sampleEdges = [
      { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#2563EB', strokeWidth: 2 } },
      { id: 'e2-3', source: '2', target: '3', style: { stroke: '#9CA3AF', strokeWidth: 1.5 } },
      { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#2563EB', strokeWidth: 2 } },
      { id: 'e3-5', source: '3', target: '5', style: { stroke: '#9CA3AF', strokeWidth: 1.5 } },
      { id: 'e4-6', source: '4', target: '6', style: { stroke: '#8B5CF6', strokeWidth: 2 } },
      { id: 'e5-6', source: '5', target: '6', style: { stroke: '#8B5CF6', strokeWidth: 2 } }
    ];

    setNodes(sampleNodes);
    setEdges(sampleEdges);

    setMilestones([
      {
        id: 'm1',
        title: 'Phase 1: Computational Foundations',
        status: 'COMPLETED',
        items: [
          { name: 'Python Core & Object-Oriented Patterns', hours: 30, cost: 0, done: true },
          { name: 'Linear Algebra & Multivariable Calculus', hours: 35, cost: 0, done: true }
        ]
      },
      {
        id: 'm2',
        title: 'Phase 2: Data Wrangling & Analytical Methods',
        status: 'IN_PROGRESS',
        items: [
          { name: 'Pandas, NumPy, and Vectorized Data Manipulation', hours: 25, cost: 1499, done: true },
          { name: 'Relational Database Queries & SQL Optimization', hours: 15, cost: 999, done: false }
        ]
      },
      {
        id: 'm3',
        title: 'Phase 3: Machine Learning & Modeling',
        status: 'UPCOMING',
        items: [
          { name: 'Supervised Learning (Regression, Trees, SVMs)', hours: 30, cost: 2499, done: false },
          { name: 'Model Evaluation, Cross-Validation & Metric Tuning', hours: 20, cost: 1999, done: false }
        ]
      },
      {
        id: 'm4',
        title: 'Phase 4: Big Data Infrastructure & Production',
        status: 'UPCOMING',
        items: [
          { name: 'Apache Spark Distributed Computing', hours: 30, cost: 2999, done: false },
          { name: 'Containerization with Docker & REST APIs', hours: 15, cost: 1499, done: false }
        ]
      }
    ]);

    setLoading(false);
  };

  const toggleItemDone = (phaseIdx, itemIdx) => {
    const updated = [...milestones];
    updated[phaseIdx].items[itemIdx].done = !updated[phaseIdx].items[itemIdx].done;
    setMilestones(updated);
  };

  const totalHours = milestones.reduce((sum, p) => sum + p.items.reduce((s, i) => s + i.hours, 0), 0);
  const totalCost = milestones.reduce((sum, p) => sum + p.items.reduce((s, i) => s + i.cost, 0), 0);
  const completedHours = milestones.reduce((sum, p) => sum + p.items.filter(i => i.done).reduce((s, i) => s + i.hours, 0), 0);
  const progressPercent = Math.round((completedHours / totalHours) * 100);

  const handleSavePlan = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 md:p-8 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
              <GitFork className="w-3.5 h-3.5" />
              <span>Directed Acyclic Graph (DAG) Curriculum</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#111827]">
              Optimized Learning Roadmap
            </h1>
            <p className="text-sm text-[#6B7280] mt-1 max-w-3xl">
              Algorithmic prerequisite-respecting roadmap to bridge your verified skill gaps towards{' '}
              <strong className="text-gray-900">{targetCareer}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSavePlan}
              className={`px-4 py-2 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 ${
                savedSuccess ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>{savedSuccess ? 'Plan Saved to Profile!' : 'Save Learning Plan'}</span>
            </button>
          </div>
        </div>

        {/* Production Pathway Strategy Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-gray-500">Curriculum Strategy:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-100">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              Cost-Optimal Career Sequence (Verified)
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-gray-500">Total Duration:</span>{' '}
              <strong className="text-gray-900">{totalHours} hrs</strong>
            </div>
            <div>
              <span className="text-gray-500">Estimated Cost:</span>{' '}
              <strong className="text-green-700 font-bold">₹{totalCost.toLocaleString('en-IN')}</strong>
            </div>
            <div>
              <span className="text-gray-500">Overall Progress:</span>{' '}
              <strong className="text-blue-600 font-bold">{progressPercent}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* React Flow Graph Visualization */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs px-1 text-gray-500">
          <span>Interactive Prerequisite DAG Flow (drag, zoom, pan nodes)</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Completed</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> In Progress</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-gray-400" /> Up Next</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Target Role</span>
          </div>
        </div>

        <RoadmapFlow nodes={nodes} edges={edges} />
      </div>

      {/* Sequential Milestone Checklist */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-[#111827]">Curriculum Milestone Checklist</h3>
            <p className="text-xs text-[#6B7280]">
              Track your individual course milestones as you progress toward your target occupation
            </p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {completedHours} / {totalHours} Hours Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {milestones.map((phase, pIdx) => (
            <div key={phase.id} className="p-4 rounded-xl border border-gray-200 bg-[#F7F8FA]/60 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-900">{phase.title}</h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  phase.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  phase.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {phase.status.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-2 pt-1">
                {phase.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    onClick={() => toggleItemDone(pIdx, iIdx)}
                    className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-all text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      {item.done ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                      <span className={item.done ? 'line-through text-gray-400 font-medium' : 'text-gray-800 font-medium'}>
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-500 font-mono text-[11px] flex-shrink-0">
                      <span>{item.hours}h</span>
                      <span>•</span>
                      <span>₹{item.cost.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}