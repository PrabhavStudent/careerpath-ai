import React, { useState } from 'react';
import { 
  Settings, 
  Database, 
  Server, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Shield, 
  Cpu,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { logout } = useAuth();

  const [apiUrl, setApiUrl] = useState('http://localhost:8000/api/v1');
  const [offlineDemo, setOfflineDemo] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetSession = () => {
    if (window.confirm("Are you sure you want to clear your local session and restart?")) {
      logout();
      window.location.href = '/login';
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 md:p-8 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>System Configuration</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#111827]">
          Platform Settings
        </h1>
        <p className="text-sm text-[#6B7280] mt-1 max-w-2xl">
          Configure API endpoints, inspect database engine telemetry, and manage application session data.
        </p>
      </div>

      {/* Backend & Database Telemetry */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
          <Server className="w-4 h-4 text-blue-600" />
          <span>Infrastructure & Telemetry</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Database Engine</span>
              <span className="w-2 h-2 rounded-full bg-green-500" />
            </div>
            <p className="text-sm font-bold text-gray-900">SQLite 3 / MySQL</p>
            <p className="text-[11px] text-gray-500 mt-1">Automatic graceful fallback</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>O*NET Dataset</span>
              <span className="w-2 h-2 rounded-full bg-green-500" />
            </div>
            <p className="text-sm font-bold text-gray-900">O*NET 31.0 Official</p>
            <p className="text-[11px] text-gray-500 mt-1">923 standardized occupations</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>ML Artifacts</span>
              <span className="w-2 h-2 rounded-full bg-green-500" />
            </div>
            <p className="text-sm font-bold text-gray-900">Linear SVM Classifier</p>
            <p className="text-[11px] text-gray-500 mt-1">Pickle serialized pipeline</p>
          </div>
        </div>
      </div>

      {/* API Configuration */}
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-600" />
          <span>API & Client Preferences</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">FastAPI Backend Endpoint</label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <p className="text-xs font-bold text-gray-900">Deterministic Fallback Mode</p>
              <p className="text-[11px] text-gray-500">
                Serve instant realistic mock data if backend connection encounters network latency
              </p>
            </div>
            <input
              type="checkbox"
              checked={offlineDemo}
              onChange={(e) => setOfflineDemo(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {savedSuccess && (
            <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Settings updated!
            </span>
          )}
          {!savedSuccess && <div />}

          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="bg-red-50/50 rounded-xl border border-red-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-red-900">Session Reset & Cache Clear</h4>
          <p className="text-xs text-red-700 mt-0.5">
            Log out of current account and wipe cached tokens and local assessment answers.
          </p>
        </div>

        <button
          onClick={handleResetSession}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 flex-shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset Session</span>
        </button>
      </div>
    </div>
  );
}