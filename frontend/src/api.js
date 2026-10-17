const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '');

export const getSessionId = () => {
  const storedSessionId = localStorage.getItem('session_id');
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(storedSessionId || '');
  if (isUuid) return storedSessionId;

  const sessionId = crypto.randomUUID();
  localStorage.setItem('session_id', sessionId);
  return sessionId;
};

export const fetchSchemes = async (q = '', category = '') => {
  const params = new URLSearchParams();
  if (q) params.append('q', q);
  if (category && category !== 'All') params.append('category', category);
  const qs = params.toString();
  const url = qs ? `${API_BASE_URL}/schemes/?${qs}` : `${API_BASE_URL}/schemes/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch schemes');
  return res.json();
};

export const fetchScheme = async (id) => {
  const res = await fetch(`${API_BASE_URL}/schemes/${id}`);
  if (!res.ok) throw new Error('Failed to fetch scheme');
  return res.json();
};

export const evaluateScheme = async (id, sessionId = getSessionId()) => {
  const res = await fetch(`${API_BASE_URL}/schemes/${id}/evaluate?session_id=${encodeURIComponent(sessionId)}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to evaluate scheme');
  }
  return res.json();
};

export const askAssistant = async (message, sessionId = getSessionId()) => {
  const res = await fetch(`${API_BASE_URL}/assistant/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, session_id: sessionId })
  });
  if (!res.ok) throw new Error('Failed to ask assistant');
  return res.json();
};

export const saveProfile = async (profile) => {
  const res = await fetch(`${API_BASE_URL}/profiles/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to save profile');
  }
  return res.json();
};

export const fetchProfile = async (sessionId = getSessionId()) => {
  const res = await fetch(`${API_BASE_URL}/profiles/${encodeURIComponent(sessionId)}`);
  if (!res.ok) return null;
  return res.json();
};

export const fetchSavedSchemes = async (sessionId = getSessionId()) => {
  const res = await fetch(`${API_BASE_URL}/checklist/saved/${encodeURIComponent(sessionId)}`);
  if (!res.ok) return [];
  return res.json();
};

export const saveSchemeBookmark = async (schemeId, sessionId = getSessionId()) => {
  const res = await fetch(`${API_BASE_URL}/checklist/saved`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scheme_id: schemeId, session_id: sessionId })
  });
  if (!res.ok) throw new Error('Failed to bookmark scheme');
  return res.json();
};

export const removeSavedScheme = async (savedId, sessionId = getSessionId()) => {
  const params = new URLSearchParams({ session_id: sessionId });
  const res = await fetch(`${API_BASE_URL}/checklist/saved/${savedId}?${params}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to remove saved scheme');
  return res.json();
};
