#!/bin/bash

echo "🌸 21天变美打卡应用 - 快速启动"
echo "=================================="
echo ""

# 进入项目目录
cd "$(dirname "$0")"

# 创建必要目录
mkdir -p backend/data
mkdir -p backend/uploads

# 检查并安装后端依赖
echo "📦 检查后端依赖..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装后端依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 后端依赖安装失败"
        exit 1
    fi
fi

# 初始化数据库
if [ ! -f "data/beauty_journey.db" ]; then
    echo "🗄️  正在初始化数据库..."
    npm run init-db
fi

echo "✅ 后端准备完成！"
cd ..

# 检查并安装前端依赖
echo ""
echo "📦 检查前端依赖..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装前端依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 前端依赖安装失败"
        exit 1
    fi
fi
echo "✅ 前端准备完成！"
cd ..

echo ""
echo "🎉 准备工作完成！"
echo ""
echo "📖 启动说明："
echo ""
echo "方式一（推荐）：使用两个终端窗口"
echo "  终端 1（后端）："
echo "    cd backend && npm start"
echo ""
echo "  终端 2（前端）："
echo "    cd frontend && npm run dev"
echo ""
echo "方式二：使用 quick-start-demo.sh（自动启动）"
echo ""
echo "📱 访问地址："
echo "  - 前端应用：http://localhost:3000"
echo "  - 后端API：http://localhost:3001"
echo "  - 管理员后台：http://localhost:3000/admin"
echo ""
echo "🔐 默认管理员账号：admin / admin123"
echo ""
echo "💖 祝你变美之旅愉快！"