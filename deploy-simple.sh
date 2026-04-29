#!/bin/bash

echo "🌸 开始部署变美打卡应用"
echo "=========================="

# 设置变量
REPO_URL="https://github.com/yourusername/beauty-journey-app"
BRANCH="main"

echo "📋 部署步骤："
echo "1. 检查本地更改..."
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  发现未提交的更改"
    read -p "是否提交这些更改？(y/n): " choice
    if [ "$choice" = "y" ]; then
        git add .
        read -p "请输入提交信息: " commit_msg
        git commit -m "$commit_msg"
        git push origin $BRANCH
    else
        echo "❌ 未提交更改，部署停止"
        exit 1
    fi
else
    echo "✅ 无未提交的更改"
fi

echo -e "\n🚀 部署到Vercel（前端）"
echo "1. 访问 https://vercel.com"
echo "2. 点击 'New Project'"
echo "3. 选择 'Import Git Repository'"
echo "4. 粘贴: $REPO_URL"
echo "5. 点击 'Import'"
echo "6. 配置环境变量：VITE_API_URL = https://your-render-backend-url.com"
echo "7. 点击 'Deploy'"

echo -e "\n🚀 部署到Render（后端）"
echo "1. 访问 https://render.com"
echo "2. 点击 'New +' -> 'Web Service'"
echo "3. 选择 'GitHub'"
echo "4. 搜索并选择: $REPO_URL"
echo "5. 点击 'Connect'"
echo "6. 配置："
echo "   - Name: beauty-journey-backend"
echo "   - Root Directory: backend"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "7. 点击 'Advanced'"
echo "8. 添加环境变量："
echo "   - NODE_ENV: production"
echo "   - PORT: 10000"
echo "9. 点击 'Deploy'"

echo -e "\n🎉 部署流程已说明！"
echo "📱 预计访问地址："
echo "   前端: https://yourusername-beauty-journey.vercel.app"
echo "   后端: https://beauty-journey-backend.onrender.com"
echo -e "\n💡 注意："
echo "   - 第一次部署可能需要几分钟"
echo "   - 免费套餐有访问次数限制"
echo "   - 可以自定义域名"
