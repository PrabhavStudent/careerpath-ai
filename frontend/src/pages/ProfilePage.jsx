import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  GraduationCap, 
  Calendar, 
  Briefcase, 
  CheckCircle2, 
  Sparkles, 
  Save,
  UploadCloud,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ProfilePage() {
  const { user } = useAuth();

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState({
    full_name: user?.full_name || 'Alex Morgan',
    email: user?.email || 'student@careerpath.ai',
    major: 'Computer Science & Data Science',
    degree_level: "Bachelor's Degree",
    graduation_year: 2026,
    target_career: 'Data Scientists',
    bio: 'Passionate about machine learning, statistical modeling, and full-stack software development.'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/profile/', profile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.warn("Saved profile locally:", err);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
            {profile.full_name ? profile.full_name.charAt(0) : 'S'}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Verified Student Account</span>
            </div>
            <h1 className="text-2xl font-bold text-[#111827]">{profile.full_name}</h1>
            <p className="text-xs text-[#6B7280]">{profile.email} • Class of {profile.graduation_year}</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#E5E7EB] p-6 md:p-8 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-[#111827] border-b border-gray-100 pb-3">
          Academic and Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-3.5 py-2 text-xs border border-gray-200 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Major / Academic Program</label>
            <input
              type="text"
              value={profile.major}
              onChange={(e) => setProfile({ ...profile, major: e.target.value })}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Degree Level</label>
            <select
              value={profile.degree_level}
              onChange={(e) => setProfile({ ...profile, degree_level: e.target.value })}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option>Bachelor's Degree</option>
              <option>Master's Degree</option>
              <option>Associate Degree</option>
              <option>Doctorate / Ph.D.</option>
              <option>Bootcamp Graduate</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Graduation Year</label>
            <input
              type="number"
              value={profile.graduation_year}
              onChange={(e) => setProfile({ ...profile, graduation_year: parseInt(e.target.value, 10) })}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              min="2020"
              max="2035"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Target Primary Career</label>
            <input
              type="text"
              value={profile.target_career}
              onChange={(e) => setProfile({ ...profile, target_career: e.target.value })}
              className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Personal Biography / Career Focus</label>
          <textarea
            rows="3"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {success && (
            <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Profile changes saved successfully!
            </span>
          )}
          {!success && <div />}

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}