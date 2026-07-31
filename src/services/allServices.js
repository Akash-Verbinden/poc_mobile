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