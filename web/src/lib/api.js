import api from "@/lib/axios";

// ─── Auth ────────────────────────────────────────────
export const authAPI = {
    login: (data) => api.post("/auth/login", data),
    register: (data) => api.post("/auth/register", data),
    logout: () => api.get("/auth/logout"),
};

// ─── User Profile ────────────────────────────────────
export const userAPI = {
    /** Use for initial auth check: returns 200 with { user } or { user: null }. No 401. */
    getMe: () => api.get("/user/me"),
    getProfile: () => api.get("/user/profile"),
    updateProfile: (data) => api.patch("/user/profile", data),
    deleteAccount: () => api.delete("/user/profile"),
};

// ─── Jobs ────────────────────────────────────────────
export const jobsAPI = {
    getAll: (params) => api.get("/job", { params }),
    create: (data) => api.post("/job", data),
    update: (id, data) => api.patch(`/job/${id}`, data),
    delete: (id) => api.delete(`/job/${id}`),
    getStats: () => api.get("/job/stats"),
};

// ─── Admin ───────────────────────────────────────────
export const adminAPI = {
    getProfile: () => api.get("/admin/profile"),
    updateProfile: (data) => api.patch("/admin/profile", data),
    getAllUsers: (params) => api.get("/admin/users", { params }),
    getSingleUser: (id) => api.get(`/admin/users/${id}`),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    getPlatformStats: () => api.get("/admin/stats"),
};
