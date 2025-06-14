import { useState } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/signup', { name, email, password });
      localStorage.setItem('token', res.data.token);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
  };

  return {
    signup,
    logout,
    loading,
    error,
  };
};
