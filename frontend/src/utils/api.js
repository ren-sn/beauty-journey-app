import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

export const DEFAULT_CHECKIN_ITEMS = [
  { text: '💧 护肤：白天涂 2 次精华棒', isCustom: false },
  { text: '🌙 作息：11:30 前入睡', isCustom: false },
  { text: '🏃‍♀️ 运动：每周 3 次 + 日步数≥8000', isCustom: false },
  { text: '🥗 饮食：晚 8 点后不进食', isCustom: false },
  { text: '💦 喝水：每日 1500ml 温水', isCustom: false },
  { text: '🧘‍♀️ 体态：靠墙站立 5 分钟', isCustom: false },
  { text: '🍭 戒糖：少奶茶甜食', isCustom: false },
];

export const usersApi = {
  register: (data) => api.post('/users/register', data),
  getUser: (userId) => api.get(`/users/${userId}`),
};

export const checkinApi = {
  submit: (userId, formData) => api.post(`/checkin/${userId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getToday: (userId) => api.get(`/checkin/${userId}/today`),
  getCalendar: (userId) => api.get(`/checkin/${userId}/calendar`),
  getRecord: (userId, date) => api.get(`/checkin/${userId}/${date}`),
  restart: (userId) => api.post(`/checkin/${userId}/restart`),
};

export const adminApi = {
  login: (data) => api.post('/admin/login', data),
  getUsers: () => api.get('/admin/users'),
  getUserCheckins: (userId) => api.get(`/admin/users/${userId}/checkin`),
  downloadData: () => api.get('/admin/download', { responseType: 'blob' }),
};

export const shareApi = {
  getQRCode: (userId) => api.get(`/share/qrcode/${userId}`),
  getShareImage: (recordId) => api.get(`/share/image/${recordId}`),
};

export default api;