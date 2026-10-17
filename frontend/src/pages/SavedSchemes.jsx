import { useEffect, useState } from 'react';
import { Bookmark, ExternalLink, Loader2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchSavedSchemes, fetchSchemes, removeSavedScheme } from '../api';

const SavedSchemes = () => {
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSavedSchemes = async () => {
      try {
        const sessionId = localStorage.getItem('session_id') || 'default_user';
        const [saved, schemes] = await Promise.all([
          fetchSavedSchemes(sessionId),
          fetchSchemes()
        ]);
        const schemesById = new Map(schemes.map(scheme => [scheme.id, scheme]));
        setSavedSchemes(
          saved
            .map(record => ({ record, scheme: schemesById.get(record.scheme_id) }))
            .filter(item => item.scheme)
        );
      } catch (loadError) {
        console.error('Failed to load saved schemes:', loadError);
        setError('Saved schemes could not be loaded. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadSavedSchemes();
  }, []);

  const handleRemove = async (savedId) => {
    setRemovingId(savedId);
    setError('');
    try {
      await removeSavedScheme(savedId);
      setSavedSchemes(current => current.filter(item => item.record.id !== savedId));
    } catch (removeError) {
      console.error('Failed to remove saved scheme:', removeError);
      setError('This scheme could not be removed. Please try again.');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Saved Schemes</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Your saved schemes are here whenever you come back.
          </p>
        </div>
        <Link
          to="/profile"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-sm font-semibold transition-colors"
        >
          Update Profile
        </Link>
      </div>

      {error && (
        <p role="alert" className="p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Loader2 className="animate-spin mb-4 text-blue-600" size={36} />
          <p className="font-medium text-slate-600">Loading your saved schemes...</p>
        </div>
      ) : savedSchemes.length ? (
        <div className="space-y-4">
          {savedSchemes.map(({ record, scheme }) => (
            <article key={record.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-2">
                  <span className="inline-flex px-3 py-1 text-xs font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                    {scheme.category || 'General Welfare'}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">{scheme.name}</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{scheme.description}</p>
                  {scheme.benefits && (
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold">Benefits: </span>{scheme.benefits}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(record.id)}
                  disabled={removingId === record.id}
                  className="inline-flex shrink-0 items-center justify-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700 disabled:opacity-50 transition-colors text-sm font-semibold"
                >
                  {removingId === record.id
                    ? <Loader2 className="animate-spin" size={16} />
                    : <Trash2 size={16} />}
                  Remove
                </button>
              </div>
              {scheme.source_url && (
                <a
                  href={scheme.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-blue-700 hover:text-blue-800"
                >
                  Official scheme details <ExternalLink size={14} />
                </a>
              )}
            </article>
          ))}
        </div>
      ) : !error ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <Bookmark className="mx-auto text-slate-400 mb-3" size={28} />
          <h2 className="font-bold text-slate-900">No saved schemes yet</h2>
          <p className="text-sm text-slate-500 mt-2">
            Save a scheme from the schemes list and it will stay here for later.
          </p>
          <Link
            to="/schemes"
            className="inline-flex mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-semibold transition-colors"
          >
            Browse Schemes
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default SavedSchemes;
