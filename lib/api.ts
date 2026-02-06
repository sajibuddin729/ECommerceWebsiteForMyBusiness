// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');

    if (!response.ok) {
      if (isJson) {
        const error = await response.json();
        throw new Error(error.message || 'API Error');
      } else {
        const text = await response.text();
        throw new Error(`API Error (${response.status}): ${text.substring(0, 100)}...`);
      }
    }

    if (isJson) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};
