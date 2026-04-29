# 🚀 快速部署指南 - 30分钟搞定！

## 📋 准备工作（5分钟）

### 1. 注册账号
- ✅ GitHub账号（如果已有跳过）https://github.com
- ✅ Vercel账号（用GitHub登录）https://vercel.com
- ✅ Render账号（用GitHub登录）https://render.com

### 2. 在GitHub创建仓库
1. 访问 https://github.com/new
2. 仓库名输入：`beauty-journey-app`
3. 选择 Public（或 Private）
4. **不要**勾选 "Initialize this repository"
5. 点击 "Create repository"

### 3. 推送代码到GitHub
```bash
cd /Users/bytedance/beauty-journey-app

# 复制您GitHub仓库的地址，执行：
git remote add origin https://github.com/您的用户名/beauty-journey-app.git
git branch -M main
git push -u origin main
```

---

## 🎨 部署前端到Vercel（10分钟）

### 步骤：
1. 访问 https://vercel.com/new
2. 选择 "Import Git Repository"
3. 选择您刚创建的 `beauty-journey-app` 仓库
4. 点击 "Import"
5. **配置项目**：
   - Project Name: `beauty-journey-app`
   - Framework Preset: Vite（应该自动检测到）
   - Root Directory:（保持默认，即根目录）
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. 点击 "Deploy"
7. 等待1-2分钟，您会看到一个类似 `https://beauty-journey-app.vercel.app` 的地址！

📌 **记录下这个地址，稍后需要用到。**

---

## 🔧 部署后端到Render（15分钟）

### 步骤：
1. 访问 https://dashboard.render.com/new/web
2. 选择 "GitHub" -> 选择您的 `beauty-journey-app` 仓库
3. 点击 "Connect"

4. **配置服务**：
   - Name: `beauty-journey-backend`
   - Region: Oregon (US West)（选离您最近的）
   - Branch: main
   - Root Directory: `backend`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free

5. **添加环境变量**（点击 "Advanced"）：
   - Key: `NODE_ENV`, Value: `production`
   - Key: `PORT`, Value: `10000`
   - Key: `DB_PATH`, Value: `./data/beauty_journey.db`
   - Key: `JWT_SECRET`, Value:（点击 "Generate" 或输入随机字符串）
   - Key: `UPLOAD_DIR`, Value: `./uploads`
   - Key: `MAX_FILE_SIZE`, Value: `5242880`

6. **添加磁盘**（重要！防止数据丢失）：
   - 点击 "Add Disk"
   - Name: `data`
   - Mount Path: `/opt/render/project/src/backend/data`
   - Size: `1 GB`

7. 点击 "Create Web Service"，等待部署完成！

📌 **记录下后端地址，类似：`https://beauty-journey-backend.onrender.com`**

---

## 🔗 连接前后端（5分钟）

### 更新Vercel环境变量：
1. 回到Vercel项目页面：https://vercel.com/dashboard
2. 点击您的项目
3. 点击顶部导航 "Settings"
4. 选择左侧 "Environment Variables"
5. 添加新变量：
   - Name: `VITE_API_URL`
   - Value:（您的Render后端地址，如：https://beauty-journey-backend.onrender.com）
6. 点击 "Save"

### 重新部署前端：
1. 回到项目首页
2. 点击顶部 "Deployments"
3. 找到最新的部署，点击右侧的 "..." 菜单
4. 选择 "Redeploy"
5. 等待1分钟

---

## 🎉 完成！

现在您可以访问：
- **应用主页**: https://您的项目名.vercel.app
- **管理员后台**: https://您的项目名.vercel.app/admin

默认管理员账号：
- 用户名: `admin`
- 密码: `admin123`

---

## 💡 后续优化

### 防止Render休眠
免费的Render服务会在15分钟无访问后休眠。可以使用：
- https://cron-job.org（免费）
- 每10分钟访问一次您的后端API

### 添加自定义域名
1. 访问 https://www.freenom.com 获取免费域名
2. 在Vercel的 "Settings" -> "Domains" 中添加
3. 按照提示配置DNS

---

## ❓ 常见问题

### 前端显示404？
检查 vercel.json 是否存在，并且配置正确。

### 后端请求失败？
检查 VITE_API_URL 环境变量是否正确设置。

### 数据丢失？
确保在Render中添加了磁盘！

---

## 📞 需要帮助？

查看详细文档：[DEPLOYMENT.md](./DEPLOYMENT.md)
