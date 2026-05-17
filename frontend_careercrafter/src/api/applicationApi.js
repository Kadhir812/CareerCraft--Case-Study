// Application Management API integration
import client from './client';

// 1. Job seeker applies to a job
export const applyToJob = (data) =>
  client.post('/applications', data);

// 2. Job seeker views their applications
export const getMyApplications = (token) =>
  client.get('/applications/me');

// 3. Employer views candidates for a job
export const getApplicationsForJob = (jobId, token) =>
  client.get(`/applications/jobs/${jobId}/applications`);

// 4. Employer views one application for review
export const getApplicationById = (appId) =>
  client.get(`/applications/${appId}`);

// 5. Employer updates applicant status
export const updateApplicationStatus = (appId, status) =>
  client.patch(`/applications/${appId}/status`, { status });