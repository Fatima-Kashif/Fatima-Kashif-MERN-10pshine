import BASE_URL from '../../config'

const handleUnauthorized = () => {
  localStorage.removeItem('user');
  document.cookie = 'token=; Max-Age=0; path=/;';
  window.location.href = '/signin?message=session_expired';
};


const fetchWithAuth = async (url, options = {}) => {
  const token = document.cookie
  const match = token.match(/token=([^;]+)/);
  const parsedToken = match ? match[1] : null;
  
  if (!token) {
    handleUnauthorized();
    throw new Error('No authentication token found');
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${parsedToken}`
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      },
      credentials: 'include'
    });

    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Session expired');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const getAllNotes = async () => {
  return await fetchWithAuth(`${BASE_URL}/notes/getnotes`, {
    method: 'GET'
  });
};

export const createNote = async (note) => {
  return await fetchWithAuth(`${BASE_URL}/notes/createnote`, {
    method: 'POST',
    body: JSON.stringify(note)
  });
};

export const updateNoteApi = async (id, updates) => {
  return await fetchWithAuth(`${BASE_URL}/notes/updatenote/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
};

export const deleteNoteApi = async (id) => {
  return await fetchWithAuth(`${BASE_URL}/notes/deletenote/${id}`, {
    method: 'DELETE'
  });
};