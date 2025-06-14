import { useEffect, useState } from 'react';
import axios from 'axios';

export const useProjects = (filters = {}) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const query = new URLSearchParams(filters as any).toString();
    axios.get(`/api/projects?${query}`).then(res => setProjects(res.data));
  }, [JSON.stringify(filters)]);

  return projects;
};

export const useProjectDetail = (id: string) => {
    const [project, setProject] = useState(null);
  
    useEffect(() => {
      axios.get(`/api/projects/${id}`).then(res => setProject(res.data));
    }, [id]);
  
    return project;
  };
  