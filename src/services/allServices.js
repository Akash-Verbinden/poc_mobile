import { apiService } from "./axios";

// Login
export const loginUser = async (payload) => {
  const response = await apiService.post("/auth/login", payload);
  return response.data;
};


// dashboard api
// Dashboard Metrics

export const getSuperAdminMetrics = async () => {
  const res = await apiService.get("/superadmin/dashboard/metrics");
  return res.data;
};

// Dashboard Universities
export const getDashboardUniversities = async (payload) => {
  const res = await apiService.post("/superadmin/dashboard-universities", payload);
  return res.data.data;
};



// Programs
// Programs Metrics
export const getProgramMetrics = async () => {
  const res = await apiService.get("/superadmin/programs-metrics");
  return res.data;
};

// Programs List
export const getPrograms = async (payload) => {
  const res = await apiService.post("/superadmin/programs/list", payload);

  return res.data;
};

// Update Program Status
export const updateProgramStatus = async (program_id, status) => {
  const response = await apiService.put(`/superadmin/programs/${program_id}`, { status });
  return response.data;
};

// Delete Program
export const deleteProgram = async (program_id) => {
  const response = await apiService.delete(`/superadmin/programs/${program_id}`);

  return response.data;
};

// Program Details
export const getProgramDetails = async (programId) => {
  const response = await apiService.get(`/superadmin/programs/${programId}`);
  return response.data;
};

// update program
export const updateProgram = async (program_id, payload) => {
  const response = await apiService.put(`/superadmin/programs/${program_id}`, payload);

  return response.data;
};

// Universities
export const getProgramUniversities = async (programId) => {
  const res = await apiService.get(`/superadmin/programs/${programId}/universities`);

  return res.data;
};

// Add University
export const shareProgram = async (payload) => {
  const response = await apiService.post("/superadmin/programs/share", payload);

  return response.data;
};