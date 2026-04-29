#!/bin/bash

echo "🌸 测试生产环境部署"
echo "==================="

# 检查项目目录
cd "$(dirname "$0")"

echo "📋 步骤1: 检查依赖..."
echo "- 检查前端 node_modules..."
if [ ! -d "frontend/node_modules" ]; then
    echo "  安装前端依赖..."
    cd frontend && npm install && cd ..
fi

echo "- 检查后端 node_modules..."
if [ ! -d "backend/node_modules" ]; then
    echo "  安装后端依赖..."
    cd backend && npm install && cd ..
fi

echo "✅ 依赖检查完成"
echo ""
echo "📋 步骤2: 构建前端..."
cd frontend
npm run build
if [ $? -eq 0 ]; then
    echo "✅ 前端构建成功"
else
    echo "❌ 前端构建失败"
    exit 1
fi
cd ..
echo ""

echo "📋 步骤3: 检查构建文件..."
if [ -d "frontend/dist" ]; then
    echo "✅ 前端构建目录存在"
    echo "  文件数量: $(ls -1 frontend/dist | wc -l)"
else
    echo "❌ 前端构建目录不存在"
    exit 1
fi

echo ""
echo "📋 步骤4: 检查后端配置..."
if [ -f "backend/server.js" ]; then
    echo "✅ 后端服务器文件存在"
else
    echo "❌ 后端服务器文件不存在"
    exit 1
fi

if [ -f "backend/package.json" ]; then
    echo "✅ 后端package.json存在"
else
    echo "❌ 后端package.json不存在"
    exit 1
fi

echo ""
echo "📋 步骤5: 检查部署配置文件..."
for file in vercel.json render.yaml DEPLOYMENT.md; do
    if [ -f "$file" ]; then
        echo "✅ $file 存在"
    else
        echo "❌ $file 不存在"
        exit 1
    fi
done

echo ""
echo "🎉 测试完成！"
echo ""
echo "📖 下一步："
echo "1. 阅读 DEPLOYMENT.md 文件"
echo "2. 将代码推送到 GitHub"
echo "3. 在 Vercel 上部署前端"
echo "4. 在 Render 上部署后端"
