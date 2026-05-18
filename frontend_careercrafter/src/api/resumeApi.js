import api from "./client";

const toPositivePathId = (id, resourceName) => {
  if (typeof id === "string" && !/^[1-9]\d*$/.test(id)) {
    throw new Error(`Invalid ${resourceName} id`);
  }

  const numericId = Number(id);

  if (!Number.isSafeInteger(numericId) || numericId <= 0) {
    throw new Error(`Invalid ${resourceName} id`);
  }

  return String(numericId);
};

export const addSkillApi = (payload) =>
  api.post("/resume/skills", payload);

export const getSkillsApi = () =>
  api.get("/resume/skills");

export const deleteSkillApi = (id) => {
  const skillId = toPositivePathId(id, "skill");

  return api.delete(`/resume/skills/${skillId}`);
};

export const addEducationApi = (payload) =>
  api.post("/resume/education", payload);

export const getEducationApi = () =>
  api.get("/resume/education");

export const updateEducationApi = (id, payload) => {
  const educationId = toPositivePathId(id, "education");

  return api.put(`/resume/education/${educationId}`, payload);
};

export const deleteEducationApi = (id) => {
  const educationId = toPositivePathId(id, "education");

  return api.delete(`/resume/education/${educationId}`);
};

export const addWorkExperienceApi = (payload) =>
  api.post("/resume/experience", payload);

export const getExperienceApi = () =>
  api.get("/resume/experience");

export const updateWorkExperienceApi = (id, payload) => {
  const experienceId = toPositivePathId(id, "work experience");

  return api.put(`/resume/experience/${experienceId}`, payload);
};

export const deleteWorkExperienceApi = (id) => {
  const experienceId = toPositivePathId(id, "work experience");

  return api.delete(`/resume/experience/${experienceId}`);
};

export const uploadResumeApi = (formData) =>
  api.post("/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getResumesApi = () =>
  api.get("/resume/list");

export const deleteResumeApi = (id) => {
  const resumeId = toPositivePathId(id, "resume");

  return api.delete(`/resume/${resumeId}`);
};

export const setDefaultResumeApi = (id) => {
  const resumeId = toPositivePathId(id, "resume");

  return api.post(`/resume/${resumeId}/set-default`);
};

export const updateResumeVisibilityApi = (id, visibility) => {
  const resumeId = toPositivePathId(id, "resume");

  return api.put(`/resume/${resumeId}/visibility`, { visibility });
};
