import { useEffect, useState } from 'react';
import axios from 'axios';

export const useProjectDetail = (id: string) => {
  const [project, setProject] = useState(null);

  useEffect(() => {
    axios.get(`/api/projects/${id}`).then(res => setProject(res.data));
  }, [id]);

  return project;
};