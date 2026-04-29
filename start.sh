#!/bin/bash

echo "🌸 21天变美打卡应用启动脚本"
echo "============================="

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 16 或更高版本"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装"
    exit 1
fi

echo "✅ npm 版本: $(npm --version)"

# 函数：检查并安装依赖
check_dependencies() {
    local dir="$1"
    local name="$2"

    echo -e "\n📦 检查 $name 依赖..."

    cd "$dir"

    if [ ! -d "node_modules" ]; then
        echo "📦 安装 $name 依赖..."
        npm install
        if [ $? -ne 0 ]; then
            echo "❌ $name 依赖安装失败"
            exit 1
        fi
        echo "✅ $name 依赖安装完成"
    fi
}

# 启动服务器函数
start_server() {
    local dir="$1"
    local name="$2"
    local command="$3"

    cd "$dir"

    echo -e "\n🚀 启动 $name..."
    if command -v screen &> /dev/null; then
        screen -S "$name" -d -m $command
        echo "✅ $name 已在后台启动 (screen 会话: $name)"
    else
        # 如果没有 screen，使用 nohup
        nohup $command > ../logs/"$name".log 2>&1 &
        echo "✅ $name 已在后台启动 (PID: $!)"
    fi
}

# 创建日志目录
mkdir -p logs

# 启动后端
cd "$(dirname "$0")"

check_dependencies "backend" "后端"

# 检查是否需要初始化数据库
if [ ! -f "backend/data/beauty_journey.db" ]; then
    echo -e "\n🗄️  初始化数据库..."
    cd backend
    npm run init-db
    cd ..
fi

start_server "backend" "后端服务" "npm start"

# 等待后端启动
echo -e "\n⏳ 等待后端服务启动..."
sleep 3

# 启动前端
check_dependencies "frontend" "前端"
start_server "frontend" "前端服务" "npm run dev"

echo -e "\n🎉 启动完成！"
echo -e "\n📱 访问地址："
echo -e "🌐 前端: http://localhost:3000"
echo -e "🔧 后端: http://localhost:3001"
echo -e "🔐 管理员后台: http://localhost:3000/admin (默认账号: admin / admin123)"
echo -e "\n📖 更多信息请查看 README.md"