import { useEffect, useState } from 'react';
import axios from 'axios';

export const useCurrentUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('/api/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  return user;
};
