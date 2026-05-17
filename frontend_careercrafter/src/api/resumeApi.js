
import api from "./client";


export const addSkillApi = (payload) =>
  api.post("/resume/skills", payload);

export const getSkillsApi = () =>
  api.get("/resume/skills");

export const deleteSkillApi = (id) =>
  api.delete(`/resume/skills/${id}`);



export const addEducationApi = (payload) =>
  api.post("/resume/education", payload);

export const getEducationApi = () =>
  api.get("/resume/education");

export const updateEducationApi = (id, payload) =>
  api.put(`/resume/education/${id}`, payload);

export const deleteEducationApi = (id) =>
  api.delete(`/resume/education/${id}`);




export const addWorkExperienceApi = (payload) =>
  api.post("/resume/experience", payload);

export const getExperienceApi = () =>
  api.get("/resume/experience");

export const updateWorkExperienceApi = (id, payload) =>
  api.put(`/resume/experience/${id}`, payload);

export const deleteWorkExperienceApi = (id) =>
  api.delete(`/resume/experience/${id}`);


export const uploadResumeApi = (formData) =>
  api.post("/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  export const getResumesApi = () =>
    api.get("/resume/list");
  
  export const deleteResumeApi = (id) =>
    api.delete(`/resume/${id}`);
  
  export const setDefaultResumeApi = (id) =>
    api.post(`/resume/${id}/set-default`);
  
  export const updateResumeVisibilityApi = (id, visibility) =>
    api.put(`/resume/${id}/visibility`, { visibility });
