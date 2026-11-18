import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  GitFork, 
  Zap, 
  ShieldCheck, 
  BookOpen, 
  Briefcase,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      {/* Navigation Bar */}
      <header className="h-18 border-b border-[#E5E7EB] sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-[#111827] tracking-tight">
              CareerPath <span className="text-[#2563EB]">AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6B7280]">
            <a href="#how-it-works" className="hover:text-[#111827] transition-colors">How It Works</a>
            <a href="#features" className="hover:text-[#111827] transition-colors">Features</a>
            <a href="#faq" className="hover:text-[#111827] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-[#6B7280] hover:text-[#111827] px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-xs transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 mb-6 shadow-2xs">
          <ShieldCheck className="w-4 h-4" />
          <span>Powered Exclusively by Official O*NET 31.0 Database</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-[#111827] tracking-tight leading-[1.15]">
          Discover Your Career. <br />
          <span className="text-[#2563EB]">Build Your Future.</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
          AI-powered career guidance that helps you understand your strengths, identify critical skill gaps, and create an optimized learning roadmap with traditional Machine Learning.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-7 py-3.5 bg-[#2563EB] hover:bg-blue-700 text-white text-base font-semibold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all hover:gap-3"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/explorer"
            className="w-full sm:w-auto px-7 py-3.5 bg-gray-50 hover:bg-gray-100 text-[#111827] border border-gray-200 text-base font-semibold rounded-xl transition-colors"
          >
            Explore Careers
          </Link>
        </div>

        {/* Product Component Preview Card */}
        <div className="mt-14 p-2 bg-gray-100 border border-gray-200 rounded-2xl shadow-sm">
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Sample Student Analysis</span>
                <h3 className="text-lg font-bold text-gray-900 mt-0.5">Top Match: Software Developer (15-1252.00)</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-green-50 border border-green-200 text-green-700 font-bold text-sm rounded-lg">
                  91.2% Compatibility
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-700 mb-1">Assessed Strengths</p>
                <p className="text-gray-600">Python, SQL, Critical Thinking, Logic</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-700 mb-1">Identified Gaps</p>
                <p className="text-amber-700 font-medium">Cloud Architecture, Distributed Systems, CI/CD</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-700 mb-1">Recommended Pathway</p>
                <p className="text-blue-700 font-medium">Cost-Optimal Course Route (4 Weeks, ₹3,499)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#F7F8FA] border-y border-[#E5E7EB] px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Process</span>
            <h2 className="text-3xl font-bold text-[#111827] mt-1">How CareerPath AI Works</h2>
            <p className="text-sm text-[#6B7280] mt-2">
              A transparent, methodologically rigorous ML and algorithmic workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Self-Assessment</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Rate your programming, technical, framework, and professional competencies on our standardized 0–5 proficiency scale.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Transparent Matching</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Your profile is vector-matched against 910 official O*NET 31.0 occupations across skills, knowledge, and interests.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Optimized Roadmap</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Heuristic graph optimization calculates the shortest, most cost-effective learning sequence with zero prerequisite gaps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Capabilities</span>
          <h2 className="text-3xl font-bold text-[#111827] mt-1">Complete Student Career System</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
            <Compass className="w-6 h-6 text-blue-600 mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-1.5">Career Explorer</h3>
            <p className="text-xs text-gray-600">Search 900+ occupations with SOC codes, job zones, and exact skill importance ratings.</p>
          </div>
          <div className="p-5 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
            <GitFork className="w-6 h-6 text-blue-600 mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-1.5">Interactive Roadmaps</h3>
            <p className="text-xs text-gray-600">Visual dependency DAG powered by React Flow showing prerequisite sequences.</p>
          </div>
          <div className="p-5 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
            <Zap className="w-6 h-6 text-blue-600 mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-1.5">Cost-Optimal Pathway</h3>
            <p className="text-xs text-gray-600">Guaranteed lowest-cost and prerequisite-respecting curriculum paths generated with sub-millisecond latency.</p>
          </div>
          <div className="p-5 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
            <BookOpen className="w-6 h-6 text-blue-600 mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-1.5">Course Recommendations</h3>
            <p className="text-xs text-gray-600">Verified courses mapped directly to your calculated skill gaps with cost & duration.</p>
          </div>
          <div className="p-5 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
            <Briefcase className="w-6 h-6 text-blue-600 mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-1.5">Job Matching</h3>
            <p className="text-xs text-gray-600">Structured competency overlap scoring matched against real opportunities.</p>
          </div>
          <div className="p-5 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
            <ShieldCheck className="w-6 h-6 text-blue-600 mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-1.5">Verified Occupational Data</h3>
            <p className="text-xs text-gray-600">Standardized across all 22 SOC major groups and 910 official occupations directly from O*NET 31.0.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-[#F7F8FA] border-t border-[#E5E7EB] px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4 text-xs md:text-sm">
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-1">Is this model trained on real student preferences?</h4>
              <p className="text-gray-600">
                No. O*NET provides occupational requirements, not student preference data. Our system strictly predicts SOC classifications via ML, while student career guidance uses transparent, weighted similarity matching.
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-1">How is the learning pathway optimized?</h4>
              <p className="text-gray-600">
                Our heuristic graph pathfinder evaluates skill prerequisites and course tuition dynamically to guarantee the most cost-effective sequence with zero redundant learning hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-gray-200 px-6 text-center text-xs text-gray-500">
        <p>© 2026 CareerPath AI. Occupational data sourced from official O*NET 31.0 Database (USDOL/ETA).</p>
      </footer>
    </div>
  );
}
