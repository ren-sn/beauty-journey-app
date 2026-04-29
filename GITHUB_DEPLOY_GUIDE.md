# 🚀 GitHub部署快速指南

## 方法1：直接在GitHub上上传（最简单）

1. 访问：https://github.com/ren-sn/beauty-journey-app
2. 点击 "uploading an existing file"
3. 上传所有文件和文件夹
4. 点击 "Commit changes"

## 方法2：使用GitHub Desktop（推荐新手）

1. 下载 GitHub Desktop：https://desktop.github.com/
2. 克隆仓库到本地
3. 将所有文件复制到克隆的文件夹
4. 在 GitHub Desktop 中点击 "Commit to main"
5. 点击 "Push origin"

## 部署完成后

### 1. 部署前端到 Vercel：

访问：https://vercel.com/new

- 使用 GitHub 登录
- 选择 `beauty-journey-app` 仓库
- 点击 "Import"
- 点击 "Deploy"

### 2. 部署后端到 Render：

访问：https://render.com

- 使用 GitHub 登录
- 点击 "New" → "Web Service"
- 选择 `beauty-journey-app` 仓库
- 配置：
  - **Name**: `beauty-journey-backend`
  - **Root Directory**: `backend`
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`
  - **Plan**: Free
- 添加环境变量：
  - `PORT`: `10000`
  - `NODE_ENV`: `production`
  - `DB_PATH`: `./data/beauty-journey.db`
  - `JWT_SECRET`: （生成一个随机字符串）
- 点击 "Create Web Service"

## 详细说明

查看完整部署文档：
- `QUICK-START.md`（30分钟快速指南）
- `DEPLOYMENT.md`（完整部署说明）

---

🎉 祝您部署顺利！
