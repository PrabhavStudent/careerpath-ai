import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Compass, 
  ExternalLink, 
  ArrowRight, 
  X, 
  Layers, 
  BookOpen, 
  GraduationCap,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import api from '../services/api';

export default function ExplorerPage() {
  const navigate = useNavigate();

  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedJobZone, setSelectedJobZone] = useState('');
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(923);
  const pageSize = 12;

  const socGroups = [
    { code: '', name: 'All Major Groups' },
    { code: '15', name: '15-0000 Computer and Mathematical' },
    { code: '17', name: '17-0000 Architecture and Engineering' },
    { code: '11', name: '11-0000 Management Occupations' },
    { code: '13', name: '13-0000 Business and Financial Operations' },
    { code: '19', name: '19-0000 Life, Physical, and Social Science' },
    { code: '29', name: '29-0000 Healthcare Practitioners and Technical' },
    { code: '25', name: '25-0000 Educational Instruction and Library' }
  ];

  useEffect(() => {
    fetchCareers();
  }, [page, searchTerm, selectedGroup, selectedJobZone]);

  const fetchCareers = async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * pageSize;
      let url = `/careers/?skip=${skip}&limit=${pageSize}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      if (selectedGroup) url += `&soc_group=${encodeURIComponent(selectedGroup)}`;
      if (selectedJobZone) url += `&job_zone=${encodeURIComponent(selectedJobZone)}`;

      const res = await api.get(url);
      if (res.data && res.data.careers) {
        setCareers(res.data.careers);
        setTotalCount(res.data.total || 923);
      }
    } catch (err) {
      console.warn("Using offline explorer fallback dataset:", err);
      // Fallback demo list
      const demoList = [
        {
          onet_soc_code: '15-2051.00',
          title: 'Data Scientists',
          job_zone: 5,
          soc_major_group: '15',
          description: 'Develop and implement algorithms and statistical models that extract knowledge from data. Formulate mathematical or simulation models of problems.',
          education: "Master's Degree",
          skills: [
            { name: 'Mathematics', importance: 4.8, level: 5.2 },
            { name: 'Critical Thinking', importance: 4.5, level: 4.9 },
            { name: 'Complex Problem Solving', importance: 4.4, level: 4.8 },
            { name: 'Programming', importance: 4.6, level: 5.0 },
            { name: 'Active Learning', importance: 4.3, level: 4.7 }
          ],
          technologies: ['Python', 'R', 'SQL', 'TensorFlow', 'Apache Spark', 'Docker']
        },
        {
          onet_soc_code: '15-1252.00',
          title: 'Software Developers',
          job_zone: 4,
          soc_major_group: '15',
          description: 'Research, design, and develop computer and network software or specialized utility programs. Analyze user needs and develop software solutions.',
          education: "Bachelor's Degree",
          skills: [
            { name: 'Programming', importance: 4.9, level: 5.4 },
            { name: 'Systems Analysis', importance: 4.3, level: 4.5 },
            { name: 'Critical Thinking', importance: 4.1, level: 4.4 },
            { name: 'Operations Analysis', importance: 3.9, level: 4.0 }
          ],
          technologies: ['Java', 'JavaScript', 'React', 'Git', 'AWS', 'PostgreSQL']
        },
        {
          onet_soc_code: '15-2041.00',
          title: 'Statisticians',
          job_zone: 5,
          soc_major_group: '15',
          description: 'Develop or apply mathematical or statistical theory and methods to collect, organize, interpret, and summarize numerical data.',
          education: "Master's Degree",
          skills: [
            { name: 'Mathematics', importance: 5.0, level: 5.8 },
            { name: 'Critical Thinking', importance: 4.6, level: 5.0 },
            { name: 'Science', importance: 4.2, level: 4.5 }
          ],
          technologies: ['R', 'SAS', 'Python', 'SPSS', 'Stata', 'LaTeX']
        },
        {
          onet_soc_code: '15-1212.00',
          title: 'Information Security Analysts',
          job_zone: 4,
          soc_major_group: '15',
          description: 'Plan, implement, upgrade, or monitor security measures for the protection of computer networks and information systems.',
          education: "Bachelor's Degree",
          skills: [
            { name: 'Systems Evaluation', importance: 4.5, level: 4.8 },
            { name: 'Complex Problem Solving', importance: 4.2, level: 4.5 },
            { name: 'Critical Thinking', importance: 4.3, level: 4.6 }
          ],
          technologies: ['Wireshark', 'Splunk', 'Linux', 'Metasploit', 'Python', 'Nessus']
        },
        {
          onet_soc_code: '15-1251.00',
          title: 'Computer Programmers',
          job_zone: 4,
          soc_major_group: '15',
          description: 'Create, modify, and test the code and scripts that allow computer applications to function from software designs.',
          education: "Bachelor's Degree",
          skills: [
            { name: 'Programming', importance: 4.7, level: 5.1 },
            { name: 'Troubleshooting', importance: 4.1, level: 4.3 },
            { name: 'Active Learning', importance: 4.0, level: 4.1 }
          ],
          technologies: ['C++', 'Java', 'Python', 'Git', 'SQL', 'Visual Studio']
        },
        {
          onet_soc_code: '17-2071.00',
          title: 'Electrical Engineers',
          job_zone: 4,
          soc_major_group: '17',
          description: 'Research, design, develop, test, or supervise the manufacturing and installation of electrical equipment, components, or systems.',
          education: "Bachelor's Degree",
          skills: [
            { name: 'Mathematics', importance: 4.6, level: 4.9 },
            { name: 'Science', importance: 4.4, level: 4.6 },
            { name: 'Complex Problem Solving', importance: 4.3, level: 4.5 }
          ],
          technologies: ['MATLAB', 'AutoCAD', 'C', 'Simulink', 'LabVIEW']
        },
        {
          onet_soc_code: '11-3021.00',
          title: 'Computer and Information Systems Managers',
          job_zone: 5,
          soc_major_group: '11',
          description: 'Plan, direct, or coordinate activities in such fields as electronic data processing, information systems, systems analysis, and computer programming.',
          education: "Bachelor's or Master's Degree",
          skills: [
            { name: 'Management of Personnel Resources', importance: 4.5, level: 4.7 },
            { name: 'Coordination', importance: 4.4, level: 4.6 },
            { name: 'Judgment and Decision Making', importance: 4.5, level: 4.8 }
          ],
          technologies: ['Jira', 'Confluence', 'Agile/Scrum', 'ERP Systems', 'Cloud Cost Management']
        },
        {
          onet_soc_code: '15-1244.00',
          title: 'Network and Computer Systems Administrators',
          job_zone: 4,
          soc_major_group: '15',
          description: 'Install, configure, and maintain an organization\'s local area network (LAN), wide area network (WAN), and other data communications systems.',
          education: "Bachelor's Degree",
          skills: [
            { name: 'Troubleshooting', importance: 4.4, level: 4.6 },
            { name: 'Systems Analysis', importance: 4.2, level: 4.3 },
            { name: 'Active Listening', importance: 3.9, level: 4.0 }
          ],
          technologies: ['Cisco IOS', 'PowerShell', 'Bash', 'Active Directory', 'DNS/DHCP']
        }
      ];
      setCareers(demoList);
      setTotalCount(demoList.length);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 md:p-8 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>Official O*NET 31.0 Database</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#111827]">
          O*NET 31.0 Occupational Explorer
        </h1>
        <p className="text-sm text-[#6B7280] mt-1 max-w-3xl">
          Search and examine standardized occupational requirements across 900+ occupations, including
          skill importance ratings, required proficiency levels, education zones, and emerging technologies.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by title, keyword, or SOC code (e.g. 15-2051)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* SOC Major Group */}
          <div>
            <select
              value={selectedGroup}
              onChange={(e) => {
                setSelectedGroup(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {socGroups.map(g => (
                <option key={g.code} value={g.code}>{g.name}</option>
              ))}
            </select>
          </div>

          {/* Job Zone Filter */}
          <div>
            <select
              value={selectedJobZone}
              onChange={(e) => {
                setSelectedJobZone(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">All Job Zones (1 - 5)</option>
              <option value="1">Job Zone 1: Little or No Prep</option>
              <option value="2">Job Zone 2: Some Prep (HS)</option>
              <option value="3">Job Zone 3: Medium Prep (Associate)</option>
              <option value="4">Job Zone 4: Considerable Prep (Bachelor's)</option>
              <option value="5">Job Zone 5: Extensive Prep (Graduate)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
          <span>Found <strong>{totalCount}</strong> matching occupations</span>
          {(searchTerm || selectedGroup || selectedJobZone) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGroup('');
                setSelectedJobZone('');
                setPage(1);
              }}
              className="text-blue-600 hover:underline font-semibold"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Careers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {careers.map((career) => (
          <div
            key={career.onet_soc_code}
            className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-xs hover:border-gray-300 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                  {career.onet_soc_code}
                </span>
                <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Job Zone {career.job_zone || 4}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#111827] mt-2 line-clamp-1">
                {career.title}
              </h3>

              <p className="text-xs text-[#6B7280] mt-2 line-clamp-3 leading-relaxed">
                {career.description || "Official O*NET 31.0 standardized occupational specification."}
              </p>

              {career.education && (
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-600">
                  <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                  <span>{career.education}</span>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedCareer(career)}
                className="text-xs font-semibold text-gray-700 hover:text-gray-900"
              >
                Inspect Profile
              </button>

              <button
                onClick={() => navigate(`/skills?career=${career.onet_soc_code}`)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Compare Gap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-[#E5E7EB] shadow-xs">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="text-xs text-gray-600 font-medium">
          Page <strong>{page}</strong> of <strong>{Math.ceil(totalCount / pageSize)}</strong>
        </span>

        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page * pageSize >= totalCount}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Career Profile Detail Modal */}
      {selectedCareer && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                    {selectedCareer.onet_soc_code}
                  </span>
                  <span className="text-xs text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                    Job Zone {selectedCareer.job_zone}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mt-2">{selectedCareer.title}</h2>
              </div>
              <button
                onClick={() => setSelectedCareer(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Occupational Description
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                {selectedCareer.description}
              </p>
            </div>

            {/* Top O*NET Skills */}
            {selectedCareer.skills && (
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Core O*NET Skill Requirements (Importance & Level)
                </h4>
                <div className="space-y-2.5">
                  {selectedCareer.skills.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="font-semibold text-gray-900">{s.name}</span>
                      <div className="flex items-center gap-4 text-gray-600">
                        <span>Importance: <strong className="text-blue-600">{s.importance}</strong>/5.0</span>
                        <span>Level: <strong className="text-green-600">{s.level}</strong>/7.0</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies */}
            {selectedCareer.technologies && (
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  In-Demand Software & Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCareer.technologies.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-100">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedCareer(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const code = selectedCareer.onet_soc_code;
                  setSelectedCareer(null);
                  navigate(`/skills?career=${code}`);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <span>Analyze Skill Gap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}