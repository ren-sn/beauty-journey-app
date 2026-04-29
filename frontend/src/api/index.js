// 21天变美打卡 API 接口 (正式运营版 v2.0)

const API_BASE = process.env.REACT_APP_API_URL || '/api';

// 获取token
const getToken = () => localStorage.getItem('beauty_journey_token');
// 设置token
const setToken = (token) => {
  if (token) {
    localStorage.setItem('beauty_journey_token', token);
  } else {
    localStorage.removeItem('beauty_journey_token');
  }
};
// 获取当前用户
const getCurrentUser = () => {
  const userData = localStorage.getItem('beauty_journey_user');
  return userData ? JSON.parse(userData) : null;
};
// 设置当前用户
const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem('beauty_journey_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('beauty_journey_user');
  }
};

// 获取管理员token
const getAdminToken = () => localStorage.getItem('beauty_journey_admin_token');
// 设置管理员token
const setAdminToken = (token) => {
  if (token) {
    localStorage.setItem('beauty_journey_admin_token', token);
  } else {
    localStorage.removeItem('beauty_journey_admin_token');
  }
};
// 获取当前管理员
const getCurrentAdmin = () => {
  const adminData = localStorage.getItem('beauty_journey_admin');
  return adminData ? JSON.parse(adminData) : null;
};
// 设置当前管理员
const setCurrentAdmin = (admin) => {
  if (admin) {
    localStorage.setItem('beauty_journey_admin', JSON.stringify(admin));
  } else {
    localStorage.removeItem('beauty_journey_admin');
  }
};

// 工具函数：格式化响应数据
const formatResponse = async (response) => {
  const contentType = response.headers.get('content-type');

  // 处理文件下载
  if (contentType && contentType.includes('text/csv')) {
    const blob = await response.blob();
    return { success: true, blob };
  }

  const data = await response.json();

  if (response.ok) {
    return { success: true, ...data };
  }

  return {
    success: false,
    error: data.error || data.message || `HTTP ${response.status}`
  };
};

// 创建请求头
const createHeaders = (isAdmin = false, includeContentType = true) => {
  const headers = {};
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }

  const token = isAdmin ? getAdminToken() : getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export const api = {
  // 获取当前登录状态
  isAuthenticated() {
    return !!getToken() && !!getCurrentUser();
  },

  isAdminAuthenticated() {
    return !!getAdminToken() && !!getCurrentAdmin();
  },

  // 获取默认打卡项目（无需登录）
  async getDefaultCheckinItems() {
    try {
      const response = await fetch(`${API_BASE}/admin/default-items/public`);
      return await formatResponse(response);
    } catch (error) {
      console.error('获取默认项目失败:', error);
      return { success: false, error: '获取失败' };
    }
  },

  getCurrentUser,

  // 默认打卡项目管理
  async getDefaultCheckinItems() {
    try {
      const response = await fetch(`${API_BASE}/admin/default-items`, {
        headers: createHeaders(true)
      });
      return await formatResponse(response);
    } catch (error) {
      console.error('获取默认项目失败:', error);
      const defaultItems = [
        '💧 护肤：白天涂 2 次精华棒',
        '🌙 作息：11:30 前入睡',
        '🏃‍♀️ 运动：每周 3 次 + 日步数≥8000',
        '🥗 饮食：晚 8 点后不进食',
        '💦 喝水：每日 1500ml 温水',
        '🧘‍♀️ 体态：靠墙站立 5 分钟',
        '🍭 戒糖：少奶茶甜食'
      ];
      return { items: defaultItems };
    }
  },

  async addDefaultCheckinItem(item) {
    try {
      const response = await fetch(`${API_BASE}/admin/default-items`, {
        method: 'POST',
        headers: createHeaders(true),
        body: JSON.stringify(item)
      });
      return await formatResponse(response);
    } catch (error) {
      console.error('新增项目失败:', error);
      return { success: false, error: '新增失败' };
    }
  },

  async updateDefaultCheckinItem(id, updates) {
    try {
      const response = await fetch(`${API_BASE}/admin/default-items/${id}`, {
        method: 'PUT',
        headers: createHeaders(true),
        body: JSON.stringify(updates)
      });
      return await formatResponse(response);
    } catch (error) {
      console.error('更新项目失败:', error);
      return { success: false, error: '更新失败' };
    }
  },

  async deleteDefaultCheckinItem(id) {
    try {
      const response = await fetch(`${API_BASE}/admin/default-items/${id}`, {
        method: 'DELETE',
        headers: createHeaders(true)
      });
      return await formatResponse(response);
    } catch (error) {
      console.error('删除项目失败:', error);
      return { success: false, error: '删除失败' };
    }
  },
  getCurrentAdmin,

  // 微信群相关
  async getWechatGroups() {
    try {
      const response = await fetch(`${API_BASE}/wechat/groups`, {
        headers: createHeaders(false)
      });
      return formatResponse(response);
    } catch (error) {
      console.error('获取微信群失败:', error);
      return { success: true, groups: [] };
    }
  },

  async bindWechatGroup(groupData) {
    try {
      const response = await fetch(`${API_BASE}/wechat/groups/bind`, {
        method: 'POST',
        headers: createHeaders(false),
        body: JSON.stringify(groupData)
      });
      return formatResponse(response);
    } catch (error) {
      console.error('绑定微信群失败:', error);
      return { success: false, error: '绑定失败' };
    }
  },

  async unbindWechatGroup(groupId) {
    try {
      const response = await fetch(`${API_BASE}/wechat/groups/${groupId}`, {
        method: 'DELETE',
        headers: createHeaders(false)
      });
      return formatResponse(response);
    } catch (error) {
      console.error('解绑微信群失败:', error);
      return { success: false, error: '解绑失败' };
    }
  },

  async toggleWechatGroup(groupId, enabled) {
    try {
      const response = await fetch(`${API_BASE}/wechat/groups/${groupId}/toggle`, {
        method: 'PUT',
        headers: createHeaders(false),
        body: JSON.stringify({ enabled })
      });
      return formatResponse(response);
    } catch (error) {
      console.error('更新群提醒状态失败:', error);
      return { success: false, error: '更新失败' };
    }
  },

  async shareToWechat(data) {
    try {
      const response = await fetch(`${API_BASE}/wechat/share/checkin`, {
        method: 'POST',
        headers: createHeaders(false),
        body: JSON.stringify(data)
      });
      return formatResponse(response);
    } catch (error) {
      console.error('分享到微信群失败:', error);
      return { success: false, error: '分享失败' };
    }
  },

  async getWechatQrcode(userId) {
    try {
      const response = await fetch(`${API_BASE}/wechat/qrcode/${userId}`);
      return formatResponse(response);
    } catch (error) {
      console.error('获取二维码失败:', error);
      return { success: false, error: '获取二维码失败' };
    }
  },

  // 抖音群相关
  async getDouyinGroups() {
    try {
      const response = await fetch(`${API_BASE}/douyin/groups`, {
        headers: createHeaders(false)
      });
      return formatResponse(response);
    } catch (error) {
      console.error('获取抖音群失败:', error);
      return { success: true, groups: [] };
    }
  },

  async bindDouyinGroup(groupData) {
    try {
      const response = await fetch(`${API_BASE}/douyin/groups/bind`, {
        method: 'POST',
        headers: createHeaders(false),
        body: JSON.stringify(groupData)
      });
      return formatResponse(response);
    } catch (error) {
      console.error('绑定抖音群失败:', error);
      return { success: false, error: '绑定失败' };
    }
  },

  async unbindDouyinGroup(groupId) {
    try {
      const response = await fetch(`${API_BASE}/douyin/groups/${groupId}`, {
        method: 'DELETE',
        headers: createHeaders(false)
      });
      return formatResponse(response);
    } catch (error) {
      console.error('解绑抖音群失败:', error);
      return { success: false, error: '解绑失败' };
    }
  },

  async toggleDouyinGroup(groupId, enabled) {
    try {
      const response = await fetch(`${API_BASE}/douyin/groups/${groupId}/toggle`, {
        method: 'PUT',
        headers: createHeaders(false),
        body: JSON.stringify({ enabled })
      });
      return formatResponse(response);
    } catch (error) {
      console.error('更新群提醒状态失败:', error);
      return { success: false, error: '更新失败' };
    }
  },

  async shareToDouyin(data) {
    try {
      const response = await fetch(`${API_BASE}/douyin/share/checkin`, {
        method: 'POST',
        headers: createHeaders(false),
        body: JSON.stringify(data)
      });
      return formatResponse(response);
    } catch (error) {
      console.error('分享到抖音群失败:', error);
      return { success: false, error: '分享失败' };
    }
  },

  async getDouyinQrcode(userId) {
    try {
      const response = await fetch(`${API_BASE}/douyin/qrcode/${userId}`);
      return formatResponse(response);
    } catch (error) {
      console.error('获取二维码失败:', error);
      return { success: false, error: '获取二维码失败' };
    }
  },

  // 用户相关 - 认证
  async register(data) {
    try {
      const response = await fetch(`${API_BASE}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: data.nickname,
          startDate: data.startDate || new Date().toISOString().split('T')[0],
          checkinItems: data.checkinItems || [],
          email: data.email,
          phone: data.phone,
          password: data.password
        })
      });

      const result = await formatResponse(response);
      if (result.success && result.token) {
        setToken(result.token);
        setCurrentUser(result.user);
      }
      return result;
    } catch (error) {
      console.error('注册失败:', error);
      // 使用localStorage作为后备
      const userData = {
        id: Date.now(),
        nickname: data.nickname,
        startDate: data.startDate || new Date().toISOString().split('T')[0],
        checkinItems: data.checkinItems || [],
        checkinHistory: [],
        completedCycles: 0
      };
      localStorage.setItem('beauty_journey_user_data', JSON.stringify(userData));
      return { success: true, user: userData };
    }
  },

  async login(login, password) {
    try {
      const response = await fetch(`${API_BASE}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
      });

      const result = await formatResponse(response);
      if (result.success && result.token) {
        setToken(result.token);
        setCurrentUser(result.user);
      }
      return result;
    } catch (error) {
      console.error('登录失败:', error);
      return { success: false, error: '登录失败，请稍后重试' };
    }
  },

  async logout() {
    try {
      const response = await fetch(`${API_BASE}/users/logout`, {
        method: 'POST',
        headers: createHeaders(false)
      });
      await formatResponse(response);
    } catch (error) {
      console.error('登出请求失败:', error);
    }
    setToken(null);
    setCurrentUser(null);
    return { success: true };
  },

  async getUserProfile() {
    try {
      const response = await fetch(`${API_BASE}/users/profile`, {
        headers: createHeaders(false)
      });
      return formatResponse(response);
    } catch (error) {
      console.error('获取用户信息失败:', error);
      const userData = JSON.parse(localStorage.getItem('beauty_journey_user_data'));
      return { success: true, user: userData };
    }
  },

  async getUser(userId) {
    try {
      const response = await fetch(`${API_BASE}/users/${userId}`);
      return formatResponse(response);
    } catch (error) {
      console.error('获取用户信息失败:', error);
      const userData = JSON.parse(localStorage.getItem('beauty_journey_user_data'));
      return { success: true, user: userData };
    }
  },

  async updateProfile(data) {
    try {
      const response = await fetch(`${API_BASE}/users/profile`, {
        method: 'PUT',
        headers: createHeaders(false),
        body: JSON.stringify(data)
      });
      const result = await formatResponse(response);
      if (result.success) {
        // 更新本地用户数据
        const currentUser = getCurrentUser();
        if (currentUser) {
          setCurrentUser({ ...currentUser, ...data });
        }
      }
      return result;
    } catch (error) {
      console.error('更新用户信息失败:', error);
      return { success: false, error: '更新失败' };
    }
  },

  async updatePassword(oldPassword, newPassword) {
    try {
      const response = await fetch(`${API_BASE}/users/password`, {
        method: 'PUT',
        headers: createHeaders(false),
        body: JSON.stringify({ oldPassword, newPassword })
      });
      return formatResponse(response);
    } catch (error) {
      console.error('更新密码失败:', error);
      return { success: false, error: '更新密码失败' };
    }
  },

  async uploadAvatar(file) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${API_BASE}/users/avatar`, {
        method: 'POST',
        headers: createHeaders(false, false),
        body: formData
      });
      const result = await formatResponse(response);
      if (result.success && result.avatarUrl) {
        const currentUser = getCurrentUser();
        if (currentUser) {
          setCurrentUser({ ...currentUser, avatar: result.avatarUrl });
        }
      }
      return result;
    } catch (error) {
      console.error('上传头像失败:', error);
      return { success: false, error: '上传失败' };
    }
  },

  // 打卡相关
  async submitCheckin(userId, data) {
    try {
      const formData = new FormData();
      formData.append('contentText', data.text || '');
      formData.append('completedItems', JSON.stringify(data.items || []));
      formData.append('checkinDate', data.date || new Date().toISOString().split('T')[0]);
      if (data.image) {
        formData.append('image', data.image);
      }

      const response = await fetch(`${API_BASE}/checkin/${userId}`, {
        method: 'POST',
        body: formData
      });

      return formatResponse(response);
    } catch (error) {
      console.error('打卡失败:', error);
      const userData = JSON.parse(localStorage.getItem('beauty_journey_user_data'));
      const checkinRecord = {
        id: Date.now(),
        date: data.date || new Date().toISOString().split('T')[0],
        completedItems: data.items || [],
        contentText: data.text || '',
        contentImage: data.image ? data.image.name : null
      };
      const checkinHistory = userData.checkinHistory || [];
      checkinHistory.push(checkinRecord);
      userData.checkinHistory = checkinHistory;
      localStorage.setItem('beauty_journey_user_data', JSON.stringify(userData));
      return { success: true, checkin: checkinRecord };
    }
  },

  async getCheckinHistory(userId) {
    try {
      const response = await fetch(`${API_BASE}/checkin/${userId}/calendar`);
      return formatResponse(response);
    } catch (error) {
      console.error('获取打卡历史失败:', error);
      const userData = JSON.parse(localStorage.getItem('beauty_journey_user_data'));
      return { success: true, history: userData?.checkinHistory || [] };
    }
  },

  async getCheckinProgress(userId) {
    try {
      const response = await fetch(`${API_BASE}/users/${userId}`);
      const result = await formatResponse(response);
      if (result.success && result.user) {
        const user = result.user;
        return {
          success: true,
          progress: {
            completedDays: user.totalCheckins || 0,
            totalDays: 21,
            percentage: Math.min(Math.round(((user.totalCheckins || 0) / 21) * 100), 100),
            completedCycles: user.totalCycles || 0
          }
        };
      }
      return { success: false, error: '获取进度失败' };
    } catch (error) {
      console.error('获取进度失败:', error);
      const userData = JSON.parse(localStorage.getItem('beauty_journey_user_data'));
      const history = userData?.checkinHistory || [];
      return {
        success: true,
        progress: {
          completedDays: history.length,
          totalDays: 21,
          percentage: Math.min(Math.round((history.length / 21) * 100), 100),
          completedCycles: userData?.completedCycles || 0
        }
      };
    }
  },

  async restartCycle(userId) {
    try {
      const response = await fetch(`${API_BASE}/checkin/${userId}/restart`, {
        method: 'POST'
      });
      return formatResponse(response);
    } catch (error) {
      console.error('重启周期失败:', error);
      const userData = JSON.parse(localStorage.getItem('beauty_journey_user_data'));
      const newUserData = {
        ...userData,
        startDate: new Date().toISOString().split('T')[0],
        checkinHistory: [],
        completedCycles: (userData.completedCycles || 0) + 1
      };
      localStorage.setItem('beauty_journey_user_data', JSON.stringify(newUserData));
      return { success: true, newCycle: (userData.completedCycles || 0) + 1 };
    }
  },

  // 文件上传
  async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE}/upload/image`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.imageUrl) {
        return { success: true, imageUrl: data.imageUrl };
      }

      if (data.filename) {
        return { success: true, imageUrl: `/uploads/${data.filename}` };
      }

      throw new Error('无法解析响应');

    } catch (error) {
      console.error('上传图片失败:', error);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({ success: true, imageUrl: e.target.result });
        };
        reader.readAsDataURL(file);
      });
    }
  },

  // 管理员相关 - 认证
  async adminLogin(username, password) {
    try {
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const result = await formatResponse(response);
      if (result.success && result.token) {
        setAdminToken(result.token);
        setCurrentAdmin(result.admin);
      }
      return result;
    } catch (error) {
      console.error('管理员登录失败:', error);
      return { success: false, error: '登录失败，请稍后重试' };
    }
  },

  async adminLogout() {
    try {
      const response = await fetch(`${API_BASE}/admin/logout`, {
        method: 'POST',
        headers: createHeaders(true)
      });
      await formatResponse(response);
    } catch (error) {
      console.error('登出请求失败:', error);
    }
    setAdminToken(null);
    setCurrentAdmin(null);
    return { success: true };
  },

  // 管理员相关 - 用户管理
  async getUsers(page = 1, limit = 20, search = '') {
    try {
      const params = new URLSearchParams({ page, limit, search });
      const response = await fetch(`${API_BASE}/admin/users?${params}`, {
        headers: createHeaders(true)
      });
      return formatResponse(response);
    } catch (error) {
      console.error('获取用户列表失败:', error);
      const mockUsers = [
        { id: 1, nickname: '小花', joinDate: '2024-04-01', totalDays: 10, completedCycles: 0 },
        { id: 2, nickname: '小美', joinDate: '2024-03-20', totalDays: 21, completedCycles: 1 },
        { id: 3, nickname: '小婷', joinDate: '2024-04-10', totalDays: 8, completedCycles: 0 }
      ];
      return { success: true, data: mockUsers };
    }
  },

  async getUserDetail(userId) {
    try {
      const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
        headers: createHeaders(true)
      });
      return formatResponse(response);
    } catch (error) {
      console.error('获取用户详情失败:', error);
      return {
        success: false,
        error: '获取用户详情失败'
      };
    }
  },

  async getDashboard() {
    try {
      const response = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: createHeaders(true)
      });
      return formatResponse(response);
    } catch (error) {
      console.error('获取仪表盘数据失败:', error);
      return { success: false, error: '获取数据失败' };
    }
  },

  async exportUsersCSV() {
    try {
      const response = await fetch(`${API_BASE}/admin/download/users`, {
        headers: createHeaders(true)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `变美打卡用户数据_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出功能暂时不可用');
      return { success: false, error: '导出失败' };
    }
  },

  async exportUserCSV(userId, nickname) {
    try {
      const response = await fetch(`${API_BASE}/admin/download/users/${userId}`, {
        headers: createHeaders(true)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${nickname || '用户'}_打卡记录_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出功能暂时不可用');
      return { success: false, error: '导出失败' };
    }
  },

  async deleteUser(userId) {
    try {
      const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: createHeaders(true)
      });
      return formatResponse(response);
    } catch (error) {
      console.error('删除用户失败:', error);
      return { success: false, error: '删除失败' };
    }
  }
};

export default api;
