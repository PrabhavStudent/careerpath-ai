import React from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap 
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CheckCircle2, Clock, Circle, Award } from 'lucide-react';

const customNodeStyles = {
  completed: 'bg-green-50 border-2 border-green-500 text-green-900',
  in_progress: 'bg-blue-50 border-2 border-blue-500 text-blue-900',
  not_started: 'bg-white border-2 border-gray-300 text-gray-700',
  target_career: 'bg-purple-50 border-2 border-purple-600 text-purple-950 font-bold shadow-sm'
};

export default function RoadmapFlow({ nodes = [], edges = [] }) {
  // Format nodes with custom styling and badges
  const formattedNodes = nodes.map(n => {
    const status = n.data?.status || n.type || 'not_started';
    const styleClass = customNodeStyles[status] || customNodeStyles.not_started;

    let Icon = Circle;
    if (status === 'completed') Icon = CheckCircle2;
    if (status === 'in_progress') Icon = Clock;
    if (status === 'target_career') Icon = Award;

    return {
      ...n,
      data: {
        label: (
          <div className="p-2 min-w-[180px]">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
                {status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs font-bold leading-tight">{n.data?.label || n.label}</p>
            {n.data?.hours > 0 && (
              <p className="text-[10px] opacity-75 mt-1">
                ⏱ {n.data.hours} hrs • ₹{n.data.cost || 0}
              </p>
            )}
          </div>
        )
      },
      className: `${styleClass} rounded-xl shadow-xs transition-transform hover:scale-105`
    };
  });

  return (
    <div className="w-full h-[520px] bg-white rounded-xl border border-[#E5E7EB] overflow-hidden relative shadow-xs">
      <ReactFlow
        nodes={formattedNodes}
        edges={edges}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#E5E7EB" gap={16} />
        <Controls />
        <MiniMap 
          nodeColor={(n) => {
            if (n.className?.includes('green')) return '#10B981';
            if (n.className?.includes('blue')) return '#3B82F6';
            if (n.className?.includes('purple')) return '#8B5CF6';
            return '#D1D5DB';
          }}
          className="border border-[#E5E7EB] rounded-lg shadow-xs"
        />
      </ReactFlow>

      {/* Legend Overlay */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs border border-gray-200 p-3 rounded-lg shadow-xs text-xs space-y-1.5 z-10">
        <p className="font-semibold text-gray-800 text-[11px] mb-1">Node Status</p>
        <div className="flex items-center gap-2 text-green-700">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span>Competency Mastered</span>
        </div>
        <div className="flex items-center gap-2 text-blue-700">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
          <span>Prerequisite to Learn</span>
        </div>
        <div className="flex items-center gap-2 text-purple-700">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
          <span>Target Career Goal</span>
        </div>
      </div>
    </div>
  );
}
