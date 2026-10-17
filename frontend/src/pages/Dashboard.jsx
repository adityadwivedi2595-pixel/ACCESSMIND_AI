import { useState, useEffect } from 'react';
import { fetchSchemes, fetchProfile, getSessionId } from '../api';
import { 
  ArrowRight, 
  BookOpen, 
  ShieldCheck, 
  Zap, 
  GraduationCap, 
  Tractor, 
  Briefcase, 
  UserCheck, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalSchemes: 0, categories: {} });
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    fetchSchemes()
      .then(data => {
        const catMap = {};
        data.forEach(s => {
          const cat = s.category || 'General';
          catMap[cat] = (catMap[cat] || 0) + 1;
        });
        setStats({ totalSchemes: data.length, categories: catMap });
      })
      .catch(console.error);

    const sessionId = getSessionId();
    fetchProfile(sessionId)
      .then(p => {
        if (p && (p.name || p.age || p.student_status)) {
          setHasProfile(true);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto pt-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-6 shadow-2xs">
          <Sparkles size={14} className="text-blue-600" />
          <span>Automated Citizen Welfare Discovery</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
          Find government schemes <br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            made for you.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          AccessMind AI bridges the gap between citizens and public welfare. Complete your profile, run automated eligibility checks with clear explanations, and get instant guidance.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link 
            to="/schemes" 
            className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-full shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 transition-all flex items-center space-x-2 text-sm"
          >
            <span>Explore All Schemes</span>
            <ArrowRight size={18} />
          </Link>

          <Link 
            to="/profile" 
            className="px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-full shadow-sm border border-slate-200 hover:border-slate-300 transition-all text-sm flex items-center space-x-2"
          >
            <UserCheck size={18} className="text-blue-600" />
            <span>{hasProfile ? 'Manage Profile' : 'Set Up Profile'}</span>
          </Link>

          <Link 
            to="/assistant" 
            className="px-6 py-3.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-full transition-all text-sm flex items-center space-x-1.5"
          >
            <Zap size={16} />
            <span>Ask AI Assistant</span>
          </Link>
        </div>
      </div>

      {/* Featured Sectors Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link 
          to="/schemes" 
          className="group bg-white p-6 rounded-3xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex items-start space-x-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <GraduationCap size={24} />
          </div>
          <div>
            <div className="flex items-center space-x-1 font-bold text-slate-900 text-base mb-1">
              <span>Education & Students</span>
              <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              PM Vidyalaxmi collateral-free loans & national post-matric fee scholarships.
            </p>
          </div>
        </Link>

        <Link 
          to="/schemes" 
          className="group bg-white p-6 rounded-3xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex items-start space-x-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Tractor size={24} />
          </div>
          <div>
            <div className="flex items-center space-x-1 font-bold text-slate-900 text-base mb-1">
              <span>Agriculture & Farmers</span>
              <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              PM KISAN Samman Nidhi direct cash assistance and farmer landholder support.
            </p>
          </div>
        </Link>

        <Link 
          to="/schemes" 
          className="group bg-white p-6 rounded-3xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all flex items-start space-x-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Briefcase size={24} />
          </div>
          <div>
            <div className="flex items-center space-x-1 font-bold text-slate-900 text-base mb-1">
              <span>Business & Mudra</span>
              <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Shishu, Kishore, and Tarun collateral-free loans for micro-enterprises.
            </p>
          </div>
        </Link>
      </div>

      {/* Feature Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-200">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-900">
            {stats.totalSchemes > 0 ? `${stats.totalSchemes} Verified Schemes` : 'Central & State Schemes'}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Synchronized directly with official databases with required documentation and procedure breakdowns.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-900">Instant Rule Matching</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Fill your profile once. Our deterministic engine compares your age, student status, and income with clear explanations.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
            <Zap size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-900">AI Assistance 24/7</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Have questions about application steps or required documents? Ask our assistant for contextual answers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
