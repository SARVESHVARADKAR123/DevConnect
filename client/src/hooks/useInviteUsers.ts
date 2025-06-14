import axios from 'axios';

export const useInviteUsers = () => {
  const invite = async (emails: string[], projectId: string) => {
    return axios.post('/api/invite', { emails, projectId }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  };

  return { invite };
};
