import { useState, useEffect } from 'react';
import { fetchProfile, saveProfile } from '../api';
import { Save, Loader2, CheckCircle2, User, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    gender: 'Male',
    category: 'General',
    state: '',
    district: '',
    education_level: 'Undergraduate',
    student_status: 'Yes',
    employment_status: 'Student',
    income: '',
    occupation: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const sessionId = localStorage.getItem('session_id') || 'default_user';
    localStorage.setItem('session_id', sessionId);
    
    fetchProfile(sessionId)
      .then(data => {
        if (data) {
          setProfile({
            name: data.name || '',
            age: data.age !== null && data.age !== undefined ? data.age : '',
            gender: data.gender || 'Male',
            category: data.category || 'General',
            state: data.state || '',
            district: data.district || '',
            education_level: data.education_level || 'Undergraduate',
            student_status: data.student_status || 'Yes',
            employment_status: data.employment_status || 'Student',
            income: data.income !== null && data.income !== undefined ? data.income : '',
            occupation: data.occupation || ''
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'income' ? (value === '' ? '' : Number(value)) : value
    }));
    setSaved(false);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      const sessionId = localStorage.getItem('session_id') || 'default_user';
      const payload = {
        ...profile,
        session_id: sessionId,
        age: profile.age === '' ? null : Number(profile.age),
        income: profile.income === '' ? null : Number(profile.income)
      };
      await saveProfile(payload);
      setSaved(true);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || 'Failed to save profile. Please check your inputs.');
    }
    setSaving(false);
  };

  const isProfileComplete = Boolean(
    profile.name && 
    profile.age && 
    profile.income !== '' && 
    profile.student_status && 
    profile.education_level
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <Loader2 className="animate-spin text-blue-600 mb-3" size={36} />
        <p className="font-medium">Loading your profile data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center text-blue-300">
              <User size={22} />
            </div>
            <span className="text-xs uppercase tracking-wider font-semibold text-blue-300">Citizen Profile Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Your Welfare Profile</h1>
          <p className="text-slate-300 text-sm mt-2 max-w-xl leading-relaxed">
            Provide accurate educational and demographic details to allow our rule-based eligibility engine to find and verify benefits matching your profile.
          </p>

          <div className="mt-5 flex items-center space-x-3">
            <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${
              isProfileComplete ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              <Sparkles size={14} className="mr-1.5" />
              {isProfileComplete ? 'Profile Fully Configured for Matching' : 'Fill details for instant match accuracy'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm">
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center space-x-3 text-red-700">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {saved && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-emerald-800">
            <div className="flex items-center space-x-3">
              <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-bold">Profile saved successfully!</p>
                <p className="text-xs text-emerald-700">Your information is ready for automated scheme eligibility evaluation.</p>
              </div>
            </div>
            <Link 
              to="/schemes" 
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors"
            >
              <span>Check Schemes</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-sm"
                placeholder="e.g. Rahul Sharma"
              />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">Age (Years)</label>
              <input
                type="number"
                name="age"
                value={profile.age}
                onChange={handleChange}
                min="1"
                max="120"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-sm"
                placeholder="e.g. 21"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">Gender</label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-sm"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Annual Income */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">Annual Family Income (₹)</label>
              <input
                type="number"
                name="income"
                value={profile.income}
                onChange={handleChange}
                min="0"
                step="1000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-sm"
                placeholder="e.g. 250000"
              />
              <span className="text-xs text-slate-400">Essential for scholarships and loan subsidies</span>
            </div>

            {/* Social Category */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">Social Category</label>
              <select
                name="category"
                value={profile.category}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-sm"
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>

            {/* State */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">State / UT</label>
              <input
                type="text"
                name="state"
                value={profile.state}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-sm"
                placeholder="e.g. Maharashtra, Delhi, Karnataka"
              />
            </div>

            {/* District */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">District</label>
              <input
                type="text"
                name="district"
                value={profile.district}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-sm"
                placeholder="e.g. Pune, Central Delhi"
              />
            </div>

            {/* Are you an Enrolled Student? */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">Enrolled Student Status</label>
              <select
                name="student_status"
                value={profile.student_status}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-sm font-medium"
              >
                <option value="Yes">Yes (Currently a student)</option>
                <option value="No">No (Not currently enrolled)</option>
              </select>
              <span className="text-xs text-slate-400">Required for PM Vidyalaxmi & Post-Matric scholarships</span>
            </div>

            {/* Education Level */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">Highest / Current Education Level</label>
              <select
                name="education_level"
                value={profile.education_level}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-sm"
              >
                <option value="Undergraduate">Undergraduate (College / Degree)</option>
                <option value="Postgraduate">Postgraduate (Master's / Ph.D)</option>
                <option value="High School">High School (10th / 12th)</option>
                <option value="Primary School">Primary / Middle School</option>
                <option value="Other">Other / Vocational</option>
              </select>
            </div>

            {/* Employment Status */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">Employment Status</label>
              <select
                name="employment_status"
                value={profile.employment_status}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-sm"
              >
                <option value="Student">Student</option>
                <option value="Self-employed">Self-employed / Entrepreneur</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Employed">Employed (Salaried / Private / Govt)</option>
                <option value="Retired">Retired</option>
              </select>
              <span className="text-xs text-slate-400">Self-employed & Unemployed qualify for Mudra loans</span>
            </div>

            {/* Occupation */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-800">Occupation / Sector</label>
              <input
                type="text"
                name="occupation"
                value={profile.occupation}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-sm"
                placeholder="e.g. Farmer, Student, Small Shop Owner, Artisan"
              />
              <span className="text-xs text-slate-400">Enter "Farmer" for PM KISAN Samman Nidhi welfare benefits</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Session ID: <code className="bg-slate-100 px-2 py-1 rounded text-slate-700">{localStorage.getItem('session_id') || 'default_user'}</code>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold rounded-full shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 transition-all text-sm"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Saving Profile...
                </>
              ) : (
                <>
                  <Save className="mr-2" size={18} />
                  Save & Update Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
