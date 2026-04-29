# 变美打卡应用 - 部署指南

## 🌐 免费部署方案概述

我们使用以下完全免费的服务进行部署：

- **前端**: Vercel (完全免费，无限流量)
- **后端**: Render (免费套餐，每月750小时运行)
- **数据库**: SQLite (轻量级，适合初期使用)
- **CDN**: Cloudflare (免费版，提供CDN和安全保护)

---

## 📋 部署前准备

### 1. 注册免费账号

请先在以下平台注册账号：

- GitHub: https://github.com
- Vercel: https://vercel.com (使用GitHub账号登录)
- Render: https://render.com (使用GitHub账号登录)

### 2. 创建GitHub仓库

在GitHub上创建一个新仓库，名称比如：`beauty-journey-app`

---

## 🚀 步骤一：准备代码仓库

### 1. 初始化Git仓库（如果还没有）

```bash
cd /Users/bytedance/beauty-journey-app
git init
```

### 2. 添加远程仓库

```bash
git remote add origin https://github.com/你的用户名/beauty-journey-app.git
```

### 3. 提交代码

```bash
git add .
git commit -m "初始化：变美打卡应用"
git push -u origin main
```

---

## 🎨 步骤二：部署前端到Vercel

### 1. 导入项目

1. 访问 https://vercel.com/dashboard
2. 点击 "Add New..." -> "Project"
3. 在 "Import Git Repository" 下选择你的仓库
4. 点击 "Import"

### 2. 配置项目

在 "Configure Project" 页面：

- **Project Name**: 输入项目名称，如 `beauty-journey-app`
- **Framework Preset**: 应该自动检测到 `Vite`
- **Root Directory**: 保持为根目录
- **Build Command**: 保持默认的 `npm run build`
- **Output Directory**: 保持默认的 `dist`

### 3. 添加环境变量

点击 "Environment Variables"，添加：

```
Key: VITE_API_URL
Value: https://你的后端地址.onrender.com
```

注意：先部署后端，获取后端地址后再添加这个变量。

### 4. 部署

点击 "Deploy"，等待2-3分钟，部署完成后会分配一个域名。

---

## 🔧 步骤三：部署后端到Render

### 1. 创建Web Service

1. 访问 https://dashboard.render.com
2. 点击 "New +" -> "Web Service"
3. 选择 "GitHub"，然后选择你的仓库
4. 点击 "Connect"

### 2. 配置Web Service

填写以下信息：

- **Name**: `beauty-journey-backend`
- **Region**: `Oregon (US West)` (或其他)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Free`

### 3. 添加环境变量

点击 "Advanced" -> "Add Environment Variable"

```
NODE_ENV=production
PORT=10000
DB_PATH=./data/beauty_journey.db
JWT_SECRET=随便生成一个很长的字符串
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

### 4. 添加磁盘（重要！）

在 "Advanced" 页面下，点击 "Add Disk"：

- **Name**: `data`
- **Mount Path**: `/opt/render/project/src/backend/data`
- **Size**: `1 GB`

### 5. 部署

点击 "Create Web Service"，等待部署完成。

### 6. 获取后端地址

部署完成后，会显示一个地址，格式类似：
`https://beauty-journey-backend.onrender.com`

---

## 🔄 步骤四：更新前端配置

### 1. 在Vercel中更新环境变量

回到Vercel项目设置：

1. 访问项目 -> Settings -> Environment Variables
2. 添加或更新：

```
VITE_API_URL=https://beauty-journey-backend.onrender.com
```

### 2. 重新部署

在Vercel项目页面点击 "Redeploy"，或推送新代码。

---

## 🎉 完成！

现在您可以通过以下地址访问应用：

- **前端**: `https://你的项目名.vercel.app`
- **后端**: `https://beauty-journey-backend.onrender.com`
- **管理员后台**: `https://你的项目名.vercel.app/admin`

默认管理员账号：
- 用户名: `admin`
- 密码: `admin123`

---

## ⚠️ 注意事项

### 免费套餐限制

**Render:**
- 每月750小时运行时间（约25天）
- 休眠期间启动较慢
- 每月22.5美元的计算信用

**Vercel:**
- 免费套餐无限
- 流量限制：100GB/月
- 带宽限制：100GB/月

### 优化休眠

Render的免费套餐在15分钟无访问后会休眠。可以使用以下服务保持活跃：

- https://cron-job.org
- https://uptimerobot.com

设置每10分钟访问一次后端API。

---

## 📱 自定义域名（可选）

### 1. 获取免费域名

使用 https://www.freenom.com 获取免费域名（如 .tk, .ml, .ga 等）

### 2. 配置DNS

在域名服务商处设置：

```
A 记录: @ -> Vercel提供的IP
CNAME 记录: www -> cname.vercel-dns.com
```

### 3. 在Vercel中添加自定义域名

项目 -> Settings -> Domains -> Add Domain

### 4. 启用HTTPS

Vercel会自动配置SSL证书。

---

## 🔐 安全建议

1. **修改管理员密码**：首次登录后立即修改
2. **使用强JWT密钥**：在生产环境使用随机生成的字符串
3. **启用HTTPS**：Vercel和Render默认提供
4. **定期备份数据**：下载数据库文件备份

---

## 🚀 自动化部署（可选）

### 使用GitHub Actions自动部署

创建文件 `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📞 常见问题

### Q: 部署后前端显示404？
A: 确保 `vercel.json` 文件存在，并且配置了重写规则。

### Q: 后端API请求失败？
A: 检查 `VITE_API_URL` 环境变量是否正确设置。

### Q: 数据丢失？
A: 确保在Render中配置了磁盘，否则重启后数据会清空。

---

## 💡 升级建议

当用户数增长时，可以考虑：

1. **升级Render到付费套餐** ($7/月起)
2. **迁移数据库到Supabase/PlanetScale** (免费版)
3. **添加CDN加速** (Cloudflare免费版)

---

## 🎓 学习资源

- Vercel文档: https://vercel.com/docs
- Render文档: https://render.com/docs
- GitHub Actions: https://docs.github.com/en/actions

---

🎉 恭喜！您的应用现在已经部署在云端，任何人都可以访问了！
