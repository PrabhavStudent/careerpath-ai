import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle, ArrowRight, Layers, DollarSign, Clock } from 'lucide-react';

export default function AlgorithmTracer({ result, onRunAnother }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!result) return null;

  const traces = result.step_traces || [];
  const maxSteps = traces.length;
  const currentTrace = traces[currentStep] || traces[0];

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-xs space-y-6">
      {/* Algorithm Result Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
            Academic Search Algorithm
          </span>
          <h2 className="text-xl font-bold text-[#111827] mt-1">{result.algorithm_name}</h2>
          <p className="text-xs text-[#6B7280] mt-1">{result.optimality_guarantee}</p>
        </div>

        {/* Metrics Badges */}
        <div className="flex items-center gap-3">
          <div className="bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-center">
            <p className="text-[10px] text-gray-500 font-medium">Nodes Expanded</p>
            <p className="text-sm font-bold text-gray-900">{result.nodes_expanded}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-center">
            <p className="text-[10px] text-gray-500 font-medium">Total Cost</p>
            <p className="text-sm font-bold text-green-700">₹{result.total_cost}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-center">
            <p className="text-[10px] text-gray-500 font-medium">Exec Time</p>
            <p className="text-sm font-bold text-blue-600">{result.execution_time_ms} ms</p>
          </div>
        </div>
      </div>

      {/* Discovered Path Sequence */}
      <div>
        <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
          Discovered Learning Path ({result.path_length} steps)
        </h4>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {result.discovered_path.map((node, idx) => (
            <React.Fragment key={idx}>
              <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold text-blue-900 whitespace-nowrap shadow-2xs">
                {node.replace('_', ' ').toUpperCase()}
              </div>
              {idx < result.discovered_path.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Interactive Step-by-Step State Tracer */}
      {traces.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Execution State Tracer (Step {currentStep + 1} of {maxSteps})</span>
            </h4>

            {/* Stepper Buttons */}
            <div className="flex items-center gap-2">
              <button
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                className="px-2.5 py-1 text-xs font-medium bg-white border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={currentStep >= maxSteps - 1}
                onClick={() => setCurrentStep(prev => Math.min(maxSteps - 1, prev + 1))}
                className="px-2.5 py-1 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-40"
              >
                Next Step
              </button>
              <button
                onClick={() => setCurrentStep(0)}
                title="Reset to Step 1"
                className="p-1 text-gray-500 hover:text-gray-900 bg-white border border-gray-200 rounded-md"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {currentTrace && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <span className="font-semibold text-gray-600 block mb-1">Active / Visited Node</span>
                <span className="font-mono font-bold text-blue-700 text-sm">
                  {currentTrace.current_node}
                </span>
                <p className="text-[11px] text-gray-500 mt-1">{currentTrace.action_note}</p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-gray-200 md:col-span-2">
                <span className="font-semibold text-gray-600 block mb-1">Queue / Frontier / Neighbors</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentTrace.queue_or_stack && currentTrace.queue_or_stack.length > 0 ? (
                    currentTrace.queue_or_stack.map((item, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded font-mono text-[11px] text-gray-800">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 italic">Empty frontier (goal reached or dead end)</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
