#!/bin/bash

echo "🌸 21天变美打卡应用部署脚本"
echo "============================="

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 检查是否有 .env 文件
if [ ! -f "backend/.env" ]; then
    echo "⚠️  未找到 .env 文件，将使用 .env.example 作为模板"
    cp backend/.env.example backend/.env
fi

# 构建前端
echo "📦 构建前端应用..."
cd frontend
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 前端构建失败"
    exit 1
fi

cd ..

# 准备生产环境
echo "🔧 准备生产环境..."
mkdir -p backend/public
rm -rf backend/public/*
cp -r frontend/dist/* backend/public/

echo "✅ 前端静态文件已复制到 backend/public"

# 检查后端依赖
echo "📦 检查后端依赖..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 安装后端依赖..."
    npm install --production
    if [ $? -ne 0 ]; then
        echo "❌ 后端依赖安装失败"
        exit 1
    fi
fi

# 初始化数据库
echo "🗄️  检查数据库..."
if [ ! -f "data/beauty_journey.db" ]; then
    echo "📦 初始化数据库..."
    npm run init-db
    if [ $? -ne 0 ]; then
        echo "❌ 数据库初始化失败"
        exit 1
    fi
fi

cd ..

echo "🎉 部署完成！"
echo -e "\n📖 生产环境启动说明:"
echo -e "cd backend"
echo -e "npm start"
echo -e "\n📱 访问地址: http://localhost:3001"
echo -e "🔐 管理员后台: http://localhost:3001/admin"