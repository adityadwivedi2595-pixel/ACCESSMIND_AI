import { useState, useEffect } from 'react';
import { fetchSchemes, evaluateScheme, saveSchemeBookmark, fetchSavedSchemes, removeSavedScheme } from '../api';
import { 
  Search, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Bookmark, 
  FileText, 
  Gift, 
  ClipboardList, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = ['All', 'Education', 'Agriculture', 'Entrepreneurship', 'Women & Family'];

const Schemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(null);
  const [results, setResults] = useState({});
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedScheme, setExpandedScheme] = useState(null);
  const [savedSchemeIds, setSavedSchemeIds] = useState(new Set());
  const [savedRecords, setSavedRecords] = useState({});

  useEffect(() => {
    loadSchemes();
    loadSavedSchemes();
  }, []);

  const loadSchemes = async () => {
    setLoading(true);
    try {
      const data = await fetchSchemes();
      setSchemes(data);
    } catch (err) {
      console.error('Failed to load schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedSchemes = async () => {
    try {
      const sessionId = localStorage.getItem('session_id') || 'default_user';
      const saved = await fetchSavedSchemes(sessionId);
      const idSet = new Set(saved.map(item => item.scheme_id));
      const recordMap = {};
      saved.forEach(item => {
        recordMap[item.scheme_id] = item.id;
      });
      setSavedSchemeIds(idSet);
      setSavedRecords(recordMap);
    } catch (e) {
      console.error('Error fetching saved schemes:', e);
    }
  };

  const handleEvaluate = async (id) => {
    setEvaluating(id);
    try {
      const sessionId = localStorage.getItem('session_id') || 'default_user';
      const res = await evaluateScheme(id, sessionId);
      setResults(prev => ({ ...prev, [id]: res }));
    } catch (e) {
      console.error('Evaluation failed:', e);
      setResults(prev => ({
        ...prev,
        [id]: {
          status: 'error',
          explanation: e.message || 'Unable to evaluate scheme at this time.'
        }
      }));
    } finally {
      setEvaluating(null);
    }
  };

  const toggleBookmark = async (schemeId) => {
    const sessionId = localStorage.getItem('session_id') || 'default_user';
    try {
      if (savedSchemeIds.has(schemeId)) {
        const savedRecordId = savedRecords[schemeId];
        if (savedRecordId) {
          await removeSavedScheme(savedRecordId);
          setSavedSchemeIds(prev => {
            const next = new Set(prev);
            next.delete(schemeId);
            return next;
          });
        }
      } else {
        const saved = await saveSchemeBookmark(schemeId, sessionId);
        setSavedSchemeIds(prev => new Set([...prev, schemeId]));
        setSavedRecords(prev => ({ ...prev, [schemeId]: saved.id }));
      }
    } catch (e) {
      console.error('Error toggling bookmark:', e);
    }
  };

  const toggleExpand = (id) => {
    setExpandedScheme(prev => (prev === id ? null : id));
  };

  const filteredSchemes = schemes.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(search.toLowerCase())) ||
      (s.category && s.category.toLowerCase().includes(search.toLowerCase())) ||
      (s.benefits && s.benefits.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Government Schemes</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Discover verified public welfare initiatives, check instant eligibility, and apply with ease.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <Link
            to="/saved"
            className="inline-flex shrink-0 items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Bookmark size={16} />
            Saved Schemes
          </Link>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by keyword, benefit, role..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm text-sm"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Loader2 className="animate-spin mb-4 text-blue-600" size={36} />
          <p className="font-medium text-slate-600">Loading government schemes database...</p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
            <span>Showing {filteredSchemes.length} schemes</span>
            <span>Live Sync with Official Rules</span>
          </div>

          {filteredSchemes.map(scheme => {
            const evalResult = results[scheme.id];
            const isExpanded = expandedScheme === scheme.id;
            const isBookmarked = savedSchemeIds.has(scheme.id);

            // Determine eligibility status display
            const isMatch = evalResult && (evalResult.status === 'potential_match' || evalResult.is_eligible === true);
            const isNotMatch = evalResult && (evalResult.status === 'does_not_match' || evalResult.is_eligible === false);
            const isUnknown = evalResult && (evalResult.status === 'insufficient_information' || evalResult.is_eligible === null);

            return (
              <div 
                key={scheme.id} 
                className="bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {/* Main Card Header */}
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2.5">
                        <span className="px-3 py-1 text-xs font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                          {scheme.category || 'General Welfare'}
                        </span>
                        {scheme.last_verified && (
                          <span className="text-[11px] text-slate-400">
                            Verified {scheme.last_verified}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug">
                        {scheme.name}
                      </h3>
                      
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        {scheme.description}
                      </p>

                      {/* Benefits preview snippet */}
                      {scheme.benefits && (
                        <div className="flex items-start space-x-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-4">
                          <Gift size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-slate-900">Key Benefits: </span>
                            <span>{scheme.benefits}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons Column */}
                    <div className="flex items-center md:flex-col gap-2 shrink-0">
                      <button 
                        onClick={() => handleEvaluate(scheme.id)}
                        disabled={evaluating === scheme.id}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-full text-xs font-semibold transition-all flex items-center justify-center space-x-2 shadow-sm"
                      >
                        {evaluating === scheme.id ? (
                          <>
                            <Loader2 className="animate-spin" size={15} />
                            <span>Evaluating...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={15} />
                            <span>{evalResult ? 'Re-check Match' : 'Check Eligibility'}</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleBookmark(scheme.id)}
                          className={`p-2.5 rounded-full border transition-colors ${
                            isBookmarked 
                              ? 'bg-amber-50 border-amber-200 text-amber-600' 
                              : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                          }`}
                          title={isBookmarked ? 'Saved to bookmarks' : 'Bookmark this scheme'}
                        >
                          <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                        </button>

                        <button
                          onClick={() => toggleExpand(scheme.id)}
                          className="px-3.5 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-1 transition-colors"
                        >
                          <span>{isExpanded ? 'Less' : 'Details'}</span>
                          {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Eligibility Evaluation Result Box */}
                  {evalResult && (
                    <div className={`mt-6 p-5 rounded-2xl border transition-all ${
                      isMatch ? 'bg-emerald-50/80 border-emerald-200' : 
                      isNotMatch ? 'bg-red-50/80 border-red-200' : 
                      'bg-amber-50/80 border-amber-200'
                    }`}>
                      <div className="flex items-start space-x-3 mb-2">
                        <div className="mt-0.5">
                          {isMatch ? <CheckCircle2 className="text-emerald-600" size={20} /> :
                           isNotMatch ? <XCircle className="text-red-600" size={20} /> :
                           <HelpCircle className="text-amber-600" size={20} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`font-bold text-sm ${
                              isMatch ? 'text-emerald-900' : 
                              isNotMatch ? 'text-red-900' : 'text-amber-900'
                            }`}>
                              {isMatch ? 'Eligible / Potential Match' :
                               isNotMatch ? 'Criteria Not Satisfied' : 'Insufficient Profile Details'}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500">
                              Instant Rules Verification
                            </span>
                          </div>

                          <p className={`text-xs mt-1 leading-relaxed ${
                            isMatch ? 'text-emerald-800' : 
                            isNotMatch ? 'text-red-800' : 'text-amber-800'
                          }`}>
                            {evalResult.explanation || evalResult.reason}
                          </p>

                          {/* Satisfied Criteria List */}
                          {evalResult.satisfied_criteria && evalResult.satisfied_criteria.length > 0 && (
                            <div className="mt-3">
                              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-1">
                                Satisfied Criteria:
                              </p>
                              <ul className="space-y-1">
                                {evalResult.satisfied_criteria.map((c, i) => (
                                  <li key={i} className="text-xs text-emerald-900 flex items-center space-x-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    <span>{c}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Unsatisfied Criteria List */}
                          {evalResult.unsatisfied_criteria && evalResult.unsatisfied_criteria.length > 0 && (
                            <div className="mt-3">
                              <p className="text-[11px] font-bold uppercase tracking-wider text-red-800 mb-1">
                                Unmet Criteria:
                              </p>
                              <ul className="space-y-1">
                                {evalResult.unsatisfied_criteria.map((c, i) => (
                                  <li key={i} className="text-xs text-red-900 flex items-center space-x-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                    <span>{c}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Missing Fields & Shortcut */}
                          {evalResult.missing_fields && evalResult.missing_fields.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-amber-200/60">
                              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-2">
                                Missing Profile Information:
                              </p>
                              <div className="flex flex-wrap items-center gap-2">
                                {evalResult.missing_fields.map(field => (
                                  <span key={field} className="px-2.5 py-1 bg-white rounded-lg text-xs font-semibold text-amber-900 border border-amber-200 shadow-sm capitalize">
                                    {field.replace('_', ' ')}
                                  </span>
                                ))}
                                
                                <Link 
                                  to="/profile" 
                                  className="inline-flex items-center text-xs font-bold text-amber-900 hover:text-amber-950 underline ml-2"
                                >
                                  Update Profile Now <ArrowRight size={13} className="ml-1" />
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="bg-slate-50 border-t border-slate-200 p-6 md:p-8 space-y-6">
                    {/* Documents Required */}
                    {scheme.documents_required && (
                      <div>
                        <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-2">
                          <FileText size={18} className="text-blue-600" />
                          <h4>Required Documents</h4>
                        </div>
                        <p className="text-xs text-slate-700 bg-white p-4 rounded-2xl border border-slate-200 leading-relaxed">
                          {scheme.documents_required}
                        </p>
                      </div>
                    )}

                    {/* Application Procedure */}
                    {scheme.application_procedure && (
                      <div>
                        <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-2">
                          <ClipboardList size={18} className="text-emerald-600" />
                          <h4>Application Procedure</h4>
                        </div>
                        <p className="text-xs text-slate-700 bg-white p-4 rounded-2xl border border-slate-200 leading-relaxed">
                          {scheme.application_procedure}
                        </p>
                      </div>
                    )}

                    {/* Official Portal Link */}
                    {scheme.source_url && (
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-slate-500 font-medium">Official Government Source:</span>
                        <a 
                          href={scheme.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold shadow-sm transition-colors"
                        >
                          <span>Apply on Official Portal</span>
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {filteredSchemes.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <p className="text-slate-600 font-medium">No government schemes found matching your search.</p>
              <button 
                onClick={() => { setSearch(''); setSelectedCategory('All'); }}
                className="mt-3 text-xs text-blue-600 hover:underline font-semibold"
              >
                Clear filters and show all schemes
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Schemes;
