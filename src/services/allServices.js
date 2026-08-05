import { apiService } from './axios';

// Login
export const loginUser = async payload => {
  const response = await apiService.post('/auth/login', payload);
  return response.data;
};

// dashboard api
// Dashboard Metrics

export const getSuperAdminMetrics = async () => {
  const res = await apiService.get('/superadmin/dashboard/metrics');
  return res.data;
};

// Dashboard Universities
export const getDashboardUniversities = async payload => {
  const res = await apiService.post(
    '/superadmin/dashboard-universities',
    payload,
  );
  return res.data.data;
};

// Programs
// Programs Metrics
export const getProgramMetrics = async () => {
  const res = await apiService.get('/superadmin/programs-metrics');
  return res.data;
};

// Programs List
export const getPrograms = async payload => {
  const res = await apiService.post('/superadmin/programs/list', payload);

  return res.data;
};

// Update Program Status
export const updateProgramStatus = async (program_id, status) => {
  const response = await apiService.put(`/superadmin/programs/${program_id}`, {
    status,
  });
  return response.data;
};

// Delete Program
export const deleteProgram = async program_id => {
  const response = await apiService.delete(
    `/superadmin/programs/${program_id}`,
  );

  return response.data;
};

// Program Details
export const getProgramDetails = async programId => {
  const response = await apiService.get(`/superadmin/programs/${programId}`);
  return response.data;
};

// update program
export const updateProgram = async (program_id, payload) => {
  const response = await apiService.put(
    `/superadmin/programs/${program_id}`,
    payload,
  );

  return response.data;
};

// Universities
export const getProgramUniversities = async programId => {
  const res = await apiService.get(
    `/superadmin/programs/${programId}/universities`,
  );

  return res.data;
};

// Share Program
export const shareProgram = async payload => {
  const response = await apiService.post('/superadmin/programs/share', payload);

  return response.data;
};

// Create Program
export const createProgram = async payload => {
  const response = await apiService.post('/superadmin/programs', payload);

  return response.data;
};

// Program Tree
export const getProgramTree = async programId => {
  const response = await apiService.get(
    `/superadmin/programs/tree/${programId}`,
  );
  return response.data;
};

// Chapter Contents
export const getChapterContents = async chapterId => {
  const response = await apiService.get(
    `/superadmin/programs/chapters/${chapterId}`,
  );

  return response.data;
};

// Topic Contents
export const getTopicContents = async topicId => {
  const response = await apiService.get(
    `/superadmin/programs/chapters/topics/${topicId}`,
  );

  return response.data;
};

// Delete Chapter
export const deleteChapter = async chapterId => {
  const response = await apiService.delete(
    `/superadmin/programs/chapters/${chapterId}`,
  );

  return response.data;
};

// Delete Topic
export const deleteTopic = async topicId => {
  const response = await apiService.delete(
    `/superadmin/programs/chapters/topics/${topicId}`,
  );

  return response.data;
};

// Create Chapter
export const createChapter = async payload => {
  const response = await apiService.post(
    '/superadmin/programs/chapters',
    payload,
  );

  return response.data;
};

// update chapter
export const updateChapter = async (chapterId, payload) => {
  const response = await apiService.put(
    `/superadmin/programs/chapters/${chapterId}`,
    payload,
  );

  return response.data;
};

// publish program
export const publishProgram = async program_id => {
  const response = await apiService.put(
    `/superadmin/programs/${program_id}/publish`,
  );

  return response.data;
};

// Create Topic
export const createTopic = async payload => {
  const response = await apiService.post(
    '/superadmin/programs/chapters/topics',
    payload,
  );

  return response.data;
};

// update topic
export const updateTopic = async (topicId, payload) => {
  const response = await apiService.put(
    `/superadmin/programs/chapters/topics/${topicId}`,
    payload,
  );

  return response.data;
};

// Email Templates

// Create Email Template
export const createEmailTemplate = async (
  payload,
) => {
  const res = await api.post("/superadmin/email-template", payload);
  return res.data;
};

// Get Email Templates
export const getEmailTemplates = async () => {
  const payload = {
    search: '',
    page: 1,
    page_size: 10,
    sort_order: -1,
    filter: {},
    sort_by: 'created_at',
  };

  const res = await apiService.post(
    '/superadmin/email-templates/list',
    payload,
  );

  return res.data;
};

// Create Email Template
export const deleteEmailTemplate = async (template_id) => {
  const res = await apiService.delete(`/superadmin/email-templates/${template_id}`);
  return res.data;
};

// Get Email Template Details
export const getUniversityUsers = async (payload) => {
  const res = await apiService.post(
    "/superadmin/communication/university-users",
    payload,
  );

  return res.data;
};


// Share bulk email
export const bulkShareEmail = async (payload) => {
  const res = await apiService.post("/superadmin/communication/bulk-share", payload);
  return res.data;
};

// Get Email Template
export const getEmailTemplate = async (template_id) => {
  const res = await apiService.get(`/superadmin/email-templates/${template_id}`);
  return res.data;
};
