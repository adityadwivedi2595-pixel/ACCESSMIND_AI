const API_BASE_URL = 'http://localhost:8000/api/v1';

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

export const evaluateScheme = async (id, sessionId = 'default_user') => {
  const res = await fetch(`${API_BASE_URL}/schemes/${id}/evaluate?session_id=${sessionId}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to evaluate scheme');
  }
  return res.json();
};

export const askAssistant = async (message, sessionId = 'default_user') => {
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

export const fetchProfile = async (sessionId = 'default_user') => {
  const res = await fetch(`${API_BASE_URL}/profiles/${sessionId}`);
  if (!res.ok) return null;
  return res.json();
};

export const fetchSavedSchemes = async (sessionId = 'default_user') => {
  const res = await fetch(`${API_BASE_URL}/checklist/saved/${sessionId}`);
  if (!res.ok) return [];
  return res.json();
};

export const saveSchemeBookmark = async (schemeId, sessionId = 'default_user') => {
  const res = await fetch(`${API_BASE_URL}/checklist/saved`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scheme_id: schemeId, session_id: sessionId })
  });
  if (!res.ok) throw new Error('Failed to bookmark scheme');
  return res.json();
};

export const removeSavedScheme = async (savedId) => {
  const res = await fetch(`${API_BASE_URL}/checklist/saved/${savedId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to remove saved scheme');
  return res.json();
};
