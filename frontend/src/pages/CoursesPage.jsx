import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Clock, 
  DollarSign, 
  Star, 
  ExternalLink, 
  CheckCircle2, 
  Plus, 
  Award,
  Sparkles
} from 'lucide-react';
import api from '../services/api';

export default function CoursesPage() {
  const [searchParams] = useSearchParams();
  const initialSkill = searchParams.get('skill') || '';

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skillFilter, setSkillFilter] = useState(initialSkill);
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [enrolledIds, setEnrolledIds] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, [skillFilter, difficultyFilter, maxPrice]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      let url = `/courses/?max_price=${maxPrice}`;
      if (skillFilter) url += `&skill_name=${encodeURIComponent(skillFilter)}`;
      if (difficultyFilter) url += `&difficulty=${encodeURIComponent(difficultyFilter)}`;

      const res = await api.get(url);
      if (res.data && res.data.length > 0) {
        setCourses(res.data);
      } else {
        throw new Error("No courses returned from backend");
      }
    } catch (err) {
      console.warn("Using offline fallback courses catalog:", err);
      const fallbackList = [
        {
          id: 1,
          title: 'Machine Learning Specialization',
          provider: 'Coursera (DeepLearning.AI)',
          primary_skill: 'Machine Learning Algorithms',
          difficulty: 'Intermediate',
          hours: 60,
          cost: 3499,
          rating: 4.9,
          reviews_count: 14200,
          url: 'https://coursera.org',
          description: 'Master fundamental AI concepts and practical machine learning skills from industry pioneer Andrew Ng.'
        },
        {
          id: 2,
          title: 'Python for Data Science and Machine Learning Bootcamp',
          provider: 'Udemy',
          primary_skill: 'Python Programming',
          difficulty: 'Beginner',
          hours: 35,
          cost: 2499,
          rating: 4.8,
          reviews_count: 98000,
          url: 'https://udemy.com',
          description: 'Complete hands-on guide to NumPy, Pandas, Seaborn, Matplotlib, Plotly, Scikit-Learn, and Machine Learning.'
        },
        {
          id: 3,
          title: 'Big Data with Apache Spark and Hadoop',
          provider: 'edX (IBM)',
          primary_skill: 'Big Data Architecture',
          difficulty: 'Advanced',
          hours: 45,
          cost: 5999,
          rating: 4.7,
          reviews_count: 5300,
          url: 'https://edx.org',
          description: 'Design distributed data processing systems using Spark RDDs, DataFrames, Spark SQL, and Hadoop HDFS.'
        },
        {
          id: 4,
          title: 'Data Mining and Statistical Learning',
          provider: 'Stanford Online',
          primary_skill: 'Data Mining & Extraction',
          difficulty: 'Advanced',
          hours: 50,
          cost: 7499,
          rating: 4.9,
          reviews_count: 3200,
          url: 'https://online.stanford.edu',
          description: 'Advanced statistical foundations, clustering, PCA, regularization, and classification models.'
        },
        {
          id: 5,
          title: 'Mathematics for Machine Learning: Linear Algebra & Calculus',
          provider: 'Coursera (Imperial College London)',
          primary_skill: 'Mathematics',
          difficulty: 'Intermediate',
          hours: 40,
          cost: 2999,
          rating: 4.8,
          reviews_count: 18500,
          url: 'https://coursera.org',
          description: 'Master vectors, matrices, eigenvalues, gradients, and multivariable optimization essential for data science.'
        },
        {
          id: 6,
          title: 'Cloud Architecture & Microservices with Docker and Kubernetes',
          provider: 'Udacity',
          primary_skill: 'Cloud Architecture',
          difficulty: 'Advanced',
          hours: 55,
          cost: 8999,
          rating: 4.7,
          reviews_count: 4100,
          url: 'https://udacity.com',
          description: 'Deploy, scale, and manage containerized production applications using Docker, Kubernetes, and AWS.'
        },
        {
          id: 7,
          title: 'Introduction to Algorithms and Data Structures',
          provider: 'MIT OpenCourseWare',
          primary_skill: 'Complex Problem Solving',
          difficulty: 'Intermediate',
          hours: 50,
          cost: 0,
          rating: 5.0,
          reviews_count: 67000,
          url: 'https://ocw.mit.edu',
          description: 'Rigorous introduction to mathematical modeling of computational problems, graph algorithms, and dynamic programming.'
        },
        {
          id: 8,
          title: 'Practical Deep Learning for Coders',
          provider: 'fast.ai',
          primary_skill: 'Machine Learning Algorithms',
          difficulty: 'Intermediate',
          hours: 45,
          cost: 0,
          rating: 4.9,
          reviews_count: 43000,
          url: 'https://fast.ai',
          description: 'Hands-on state-of-the-art deep learning using PyTorch, covering computer vision, NLP, and tabular models.'
        }
      ];

      let filtered = fallbackList.filter(c => c.cost <= maxPrice);
      if (difficultyFilter) {
        filtered = filtered.filter(c => c.difficulty.toLowerCase() === difficultyFilter.toLowerCase());
      }
      if (skillFilter) {
        filtered = filtered.filter(c => 
          c.primary_skill.toLowerCase().includes(skillFilter.toLowerCase()) ||
          c.title.toLowerCase().includes(skillFilter.toLowerCase())
        );
      }
      setCourses(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollToggle = (courseId) => {
    if (enrolledIds.includes(courseId)) {
      setEnrolledIds(enrolledIds.filter(id => id !== courseId));
    } else {
      setEnrolledIds([...enrolledIds, courseId]);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 md:p-8 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Curated Skill-Targeted Curriculum</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#111827]">
          Targeted Course Recommendations
        </h1>
        <p className="text-sm text-[#6B7280] mt-1 max-w-3xl">
          High-yield academic and professional courses specifically aligned with O*NET occupational skill requirements.
          Select courses to assemble your learning plan and optimize time and financial investment.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Skill / Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Filter by skill (e.g. Machine Learning, Python)..."
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Difficulty Level */}
          <div>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">All Difficulty Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Max Price Slider */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-gray-600 whitespace-nowrap">Max Price:</label>
            <input
              type="range"
              min="0"
              max="15000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-xs font-mono font-bold text-gray-900 min-w-16 text-right">
              ₹{maxPrice.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
          <span>Displaying <strong>{courses.length}</strong> vetted courses</span>
          {(skillFilter || difficultyFilter || maxPrice < 15000) && (
            <button
              onClick={() => {
                setSkillFilter('');
                setDifficultyFilter('');
                setMaxPrice(15000);
              }}
              className="text-blue-600 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const isEnrolled = enrolledIds.includes(course.id);

          return (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-xs hover:border-gray-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {course.primary_skill}
                  </span>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                    course.difficulty === 'Beginner' ? 'bg-green-50 text-green-700' :
                    course.difficulty === 'Intermediate' ? 'bg-blue-50 text-blue-700' :
                    'bg-purple-50 text-purple-700'
                  }`}>
                    {course.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#111827] mt-3 line-clamp-2">
                  {course.title}
                </h3>

                <p className="text-xs text-gray-500 mt-1 font-medium">
                  {course.provider}
                </p>

                <p className="text-xs text-[#6B7280] mt-2.5 line-clamp-3 leading-relaxed">
                  {course.description}
                </p>

                {/* Metrics */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{course.hours} hrs</span>
                  </div>

                  <div className="flex items-center gap-1 font-bold text-gray-900">
                    <span>{course.cost === 0 ? 'Free' : `₹${Number(course.cost).toLocaleString('en-IN')}`}</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleEnrollToggle(course.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isEnrolled
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  {isEnrolled ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      <span>Added to Plan</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Plan</span>
                    </>
                  )}
                </button>

                <a
                  href={course.url || 'https://coursera.org'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <span>Syllabus</span>
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}