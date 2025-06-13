import api from './api';

export const adminService = {
  // User management
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  updateUserStatus: async (userId, status) => {
    const response = await api.put(`/admin/users/${userId}/status`, { status });
    return response.data;
  },

  // Course management
  getCourses: async () => {
    const response = await api.get('/admin/courses');
    return response.data;
  },

  updateCourseStatus: async (courseId, status) => {
    const response = await api.put(`/admin/courses/${courseId}/status`, { status });
    return response.data;
  },

  flagCourse: async (courseId) => {
    const response = await api.post(`/admin/courses/${courseId}/flag`);
    return response.data;
  },

  getAllDatabases: async () => {
    const response = await api.get('/admin/dbs');
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },

  moderateCourse: async (courseId, action) => {
    const response = await api.put(`/admin/courses/${courseId}/moderate`, { status: action === 'approve' ? 'approved' : 'rejected' });
    return response.data;
  },
}; 