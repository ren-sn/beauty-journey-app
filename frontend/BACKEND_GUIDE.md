# 21天变美打卡 - 后端实现指南

## 技术架构

### 推荐技术栈
- **后端框架**: Node.js + Express.js 或 Django (Python)
- **数据库**: PostgreSQL 或 MySQL
- **文件存储**: AWS S3 / 阿里云OSS / 本地存储
- **身份认证**: JWT (JSON Web Token)
- **实时通知**: WebSocket / Server-Sent Events
- **API文档**: Swagger / OpenAPI

---

## 数据库设计

### 1. 用户表 (users)
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  nickname VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(500),
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_cycles INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. 打卡项目表 (checkin_items)
```sql
CREATE TABLE checkin_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  text VARCHAR(500) NOT NULL,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. 打卡记录表 (checkin_records)
```sql
CREATE TABLE checkin_records (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  checkin_date DATE NOT NULL,
  text_content TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 打卡项目完成情况
CREATE TABLE checkin_item_completions (
  id SERIAL PRIMARY KEY,
  checkin_record_id INTEGER REFERENCES checkin_records(id),
  checkin_item_id INTEGER REFERENCES checkin_items(id),
  completed BOOLEAN DEFAULT TRUE
);
```

---

## API 接口设计

### 用户相关
- `POST /api/register` - 用户注册/初始化
- `GET /api/user/profile` - 获取用户资料
- `PUT /api/user/profile` - 更新用户资料

### 打卡相关
- `POST /api/checkin` - 提交今日打卡
- `GET /api/checkin/history` - 获取打卡历史
- `GET /api/checkin/:date` - 获取特定日期的打卡
- `GET /api/checkin/progress` - 获取打卡进度统计

### 文件上传
- `POST /api/upload/image` - 上传图片

### 管理员相关
- `GET /api/admin/users` - 获取用户列表
- `GET /api/admin/user/:id` - 获取用户详情
- `GET /api/admin/export/csv` - 导出数据CSV
- `POST /api/admin/send/notification` - 发送群组通知

---

## Node.js + Express 后端实现示例

### 项目结构
```
backend/
├── src/
│   ├── routes/
│   │   ├── user.js
│   │   ├── checkin.js
│   │   ├── admin.js
│   │   └── upload.js
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   └── app.js
├── uploads/
├── package.json
└── README.md
```

### 关键代码示例

#### package.json
```json
{
  "name": "beauty-journey-backend",
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "multer": "^1.4.5",
    "jsonwebtoken": "^9.0.0",
    "pg": "^8.11.0",
    "dotenv": "^16.3.0"
  }
}
```

#### app.js (主入口)
```javascript
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

// 中间件
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 路由
app.use('/api/user', require('./routes/user'));
app.use('/api/checkin', require('./routes/checkin'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/upload', require('./routes/upload'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
```

#### routes/checkin.js (打卡API)
```javascript
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userId, items, text, imageUrl } = req.body;
    
    // 保存打卡记录
    const record = await createCheckinRecord({
      userId,
      date: new Date().toISOString().split('T')[0],
      text,
      imageUrl
    });
    
    // 保存完成的项目
    await Promise.all(items.map(item => 
      createCheckinItemCompletion(record.id, item.id, item.completed)
    ));
    
    res.json({ success: true, record });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/history/:userId', async (req, res) => {
  try {
    const history = await getCheckinHistory(req.params.userId);
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

#### routes/upload.js (文件上传)
```javascript
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, imageUrl });
});

module.exports = router;
```

---

## 前端对接更新

### 更新API调用

#### src/api/index.js
```javascript
const API_BASE = 'http://localhost:3001/api';

export const api = {
  // 用户相关
  async register(data) {
    const response = await fetch(`${API_BASE}/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // 打卡相关
  async submitCheckin(data) {
    const response = await fetch(`${API_BASE}/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async getCheckinHistory(userId) {
    const response = await fetch(`${API_BASE}/checkin/history/${userId}`);
    return response.json();
  },

  // 文件上传
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_BASE}/upload/image`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  }
};
```

### 修改DailyCheckinPage使用真实API
```javascript
import { api } from '../api';

const handleSubmit = async () => {
  try {
    // 先上传图片
    let imageUrl = imagePreview;
    if (todayImage) {
      const uploadResult = await api.uploadImage(todayImage);
      imageUrl = uploadResult.imageUrl;
    }

    // 提交打卡
    await api.submitCheckin({
      userId: userData.id,
      items: selectedItems,
      text: todayText,
      imageUrl
    });

    alert('🎉 今日打卡完成！太棒了！');
    navigate('/result');
  } catch (error) {
    console.error('打卡失败:', error);
    alert('打卡失败，请重试');
  }
};
```

---

## 群组提醒功能

### WebSocket实时通知
```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // 广播消息给所有连接的客户端
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

// 定时提醒
setInterval(() => {
  const now = new Date();
  const hour = now.getHours();
  if (hour === 20) { // 晚上8点提醒
    const reminder = {
      type: 'reminder',
      message: '🌸 姐妹们，今天打卡了吗？快来一起变美吧！'
    };
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(reminder));
      }
    });
  }
}, 3600000); // 每小时检查一次
```

### 前端接收提醒
```javascript
useEffect(() => {
  const ws = new WebSocket('ws://localhost:8080');
  
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === 'reminder') {
      alert(message.message);
    }
  };
  
  return () => ws.close();
}, []);
```

---

## 部署建议

### 后端部署
1. 使用Docker容器化部署
2. 使用PM2管理Node.js进程
3. 配置Nginx反向代理
4. 使用Let's Encrypt配置SSL

### 数据库部署
- 使用云数据库服务（AWS RDS, 阿里云RDS）
- 定期备份（每日自动备份）
- 配置读写分离

### 文件存储
- 生产环境使用云存储服务（S3/OSS）
- 配置CDN加速图片访问
- 定期清理临时文件

---

## 安全考虑

1. **身份认证**: 使用JWT和refresh token
2. **数据加密**: 传输层使用HTTPS，敏感信息加密存储
3. **权限控制**: 管理员功能需要严格的权限验证
4. **文件安全**: 限制上传文件类型和大小，病毒扫描
5. **SQL注入防护**: 使用参数化查询

---

这个后端方案提供了完整的功能实现框架，可以根据实际需求进行调整和扩展！
