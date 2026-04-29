# 后端 Dockerfile
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 安装依赖
COPY backend/package*.json ./
RUN npm ci --only=production

# 复制项目文件
COPY backend/ .

# 创建必要的目录
RUN mkdir -p data uploads

# 暴露端口
EXPOSE 3001

# 启动应用
CMD ["npm", "start"]
