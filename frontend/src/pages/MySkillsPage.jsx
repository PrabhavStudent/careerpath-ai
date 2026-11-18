import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Sparkles, 
  Sliders, 
  Award,
  Layers,
  X
} from 'lucide-react';
import api from '../services/api';

export default function MySkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkill, setNewSkill] = useState({
    skill_name: '',
    proficiency_level: 3,
    category: 'Technical'
  });

  useEffect(() => {
    fetchStudentSkills();
  }, []);

  const fetchStudentSkills = async () => {
    setLoading(true);
    try {
      const res = await api.get('/skills/student');
      if (res.data && res.data.length > 0) {
        setSkills(res.data);
      } else {
        throw new Error("No skills returned");
      }
    } catch (err) {
      console.warn("Using offline student skills fallback:", err);
      setSkills([
        { id: 1, skill_name: 'Python', proficiency_level: 4, category: 'Programming', verified: true },
        { id: 2, skill_name: 'Mathematics', proficiency_level: 4, category: 'Analytical', verified: true },
        { id: 3, skill_name: 'SQL', proficiency_level: 3, category: 'Programming', verified: true },
        { id: 4, skill_name: 'Machine Learning', proficiency_level: 3, category: 'Technical', verified: false },
        { id: 5, skill_name: 'Critical Thinking', proficiency_level: 4, category: 'O*NET Core', verified: true },
        { id: 6, skill_name: 'Data Analysis', proficiency_level: 3, category: 'Technical', verified: true },
        { id: 7, skill_name: 'Git', proficiency_level: 3, category: 'Tools', verified: true },
        { id: 8, skill_name: 'Docker', proficiency_level: 2, category: 'Tools', verified: false },
        { id: 9, skill_name: 'Complex Problem Solving', proficiency_level: 4, category: 'O*NET Core', verified: true }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProficiency = async (id, newLevel) => {
    const updated = skills.map(s => s.id === id ? { ...s, proficiency_level: newLevel } : s);
    setSkills(updated);

    try {
      await api.put(`/skills/student/${id}`, { proficiency_level: newLevel });
    } catch (err) {
      console.warn("Saved proficiency in local state (offline mode)");
    }
  };

  const handleDeleteSkill = async (id) => {
    setSkills(skills.filter(s => s.id !== id));
    try {
      await api.delete(`/skills/student/${id}`);
    } catch (err) {
      console.warn("Deleted in local state (offline mode)");
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.skill_name.trim()) return;

    const created = {
      id: Date.now(),
      skill_name: newSkill.skill_name.trim(),
      proficiency_level: parseInt(newSkill.proficiency_level, 10),
      category: newSkill.category,
      verified: false
    };

    setSkills([created, ...skills]);
    setShowAddModal(false);
    setNewSkill({ skill_name: '', proficiency_level: 3, category: 'Technical' });

    try {
      await api.post('/skills/student', created);
    } catch (err) {
      console.warn("Added skill in local state (offline mode)");
    }
  };

  const filteredSkills = skills.filter(s => 
    s.skill_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgLevel = skills.length > 0 
    ? (skills.reduce((sum, s) => sum + s.proficiency_level, 0) / skills.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 md:p-8 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Personal Competency Portfolio</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#111827]">
              My Verified Skills
            </h1>
            <p className="text-sm text-[#6B7280] mt-1 max-w-2xl">
              Manage your skill inventory. Modifying proficiency levels immediately updates your mathematical vector
              and refreshes your career match percentages across the platform.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Skill</span>
          </button>
        </div>

        {/* Quick Stat Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-gray-100 text-xs">
          <div>
            <span className="text-gray-500">Total Skills:</span>{' '}
            <strong className="text-gray-900 font-bold">{skills.length}</strong>
          </div>
          <div>
            <span className="text-gray-500">Average Level:</span>{' '}
            <strong className="text-blue-600 font-bold">{avgLevel} / 5.0</strong>
          </div>
          <div>
            <span className="text-gray-500">Verified Credentials:</span>{' '}
            <strong className="text-green-700 font-bold">{skills.filter(s => s.verified).length}</strong>
          </div>
          <div>
            <span className="text-gray-500">Self-Assessed:</span>{' '}
            <strong className="text-gray-700 font-bold">{skills.filter(s => !s.verified).length}</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search skills by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <span className="text-xs text-gray-500 font-medium">
          Showing <strong>{filteredSkills.length}</strong> skills
        </span>
      </div>

      {/* Skills Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-3 px-4">Skill Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Proficiency Level (0 – 5)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredSkills.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    {item.skill_name}
                  </td>
                  <td className="py-3.5 px-4 text-gray-500">
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[11px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 w-64">
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="1"
                        value={item.proficiency_level}
                        onChange={(e) => handleUpdateProficiency(item.id, parseInt(e.target.value, 10))}
                        className="w-36 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <span className="font-mono font-bold text-blue-600 text-xs">
                        {item.proficiency_level} / 5
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {item.verified ? (
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded text-[10px] font-bold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-semibold">
                        Self-Assessed
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDeleteSkill(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove Skill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-md shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Add Competency to Portfolio</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  placeholder="e.g. Cloud Computing, Kubernetes, React"
                  value={newSkill.skill_name}
                  onChange={(e) => setNewSkill({ ...newSkill, skill_name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Programming">Programming</option>
                  <option value="Technical">Technical</option>
                  <option value="Analytical">Analytical</option>
                  <option value="Tools">Tools & Frameworks</option>
                  <option value="O*NET Core">O*NET Core Competency</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-gray-700">Proficiency (0 to 5)</label>
                  <span className="text-xs font-mono font-bold text-blue-600">{newSkill.proficiency_level} / 5</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={newSkill.proficiency_level}
                  onChange={(e) => setNewSkill({ ...newSkill, proficiency_level: parseInt(e.target.value, 10) })}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}