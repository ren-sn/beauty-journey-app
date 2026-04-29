#!/bin/bash

echo "🌸 初始化Git仓库"
echo "================"

# 检查是否已经是git仓库
if [ -d ".git" ]; then
    echo "⚠️  已经是Git仓库"
else
    git init
    echo "✅ Git仓库初始化完成"
fi

echo ""
echo "📋 当前状态:"
git status

echo ""
echo "💡 下一步操作:"
echo "1. git add ."
echo "2. git commit -m \"初始化项目\""
echo "3. git remote add origin https://github.com/你的用户名/beauty-journey-app.git"
echo "4. git push -u origin main"
echo ""
echo "📖 详细说明请查看 DEPLOYMENT.md 文件"
