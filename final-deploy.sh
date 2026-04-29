#!/bin/bash
# 最终部署脚本 - 一键完成所有操作

set -e

# 用户信息（需要根据实际情况修改）
USERNAME="ren-sn"
REPO_NAME="beauty-journey-app"
EMAIL="979944170@qq.com"

echo "🌸 开始21天变美打卡应用永久部署"
echo "================================="
echo "📋 目标仓库: ${USERNAME}/${REPO_NAME}"
echo "📧 关联邮箱: ${EMAIL}"
echo ""

# 检查是否已设置Git配置
echo "🔧 检查Git配置..."
if git config user.name >/dev/null 2>&1; then
    echo "✅ Git配置已设置: $(git config user.name)"
else
    git config --global user.name "${USERNAME}"
    git config --global user.email "${EMAIL}"
    echo "✅ Git配置已创建: ${USERNAME}"
fi

# 检查是否已有远程仓库
if git remote -v >/dev/null 2>&1; then
    echo "✅ 远程仓库已配置"
else
    remote_url="https://github.com/${USERNAME}/${REPO_NAME}.git"
    git remote add origin $remote_url
    echo "✅ 远程仓库已添加: $remote_url"
fi

# 检查是否需要创建仓库（在GitHub上）
if curl -s "https://github.com/${USERNAME}/${REPO_NAME}" | grep -q "404"; then
    echo "⚠️  仓库尚未在GitHub上创建"
    echo ""
    echo "📋 请先在GitHub上创建仓库："
    echo "1. 访问：https://github.com/new"
    echo "2. 仓库名：${REPO_NAME}"
    echo "3. 保持其他选项默认，点击创建"
    echo ""
    read -p "仓库创建完成后按回车继续..."
    if curl -s "https://github.com/${USERNAME}/${REPO_NAME}" | grep -q "404"; then
        echo "❌ 仓库创建失败，请重新检查"
        exit 1
    fi
fi

echo "✅ 仓库检查完成"

# 创建部署分支
BRANCH="main"
if ! git rev-parse --verify $BRANCH >/dev/null 2>&1; then
    git branch $BRANCH
fi
git checkout $BRANCH

# 确保所有文件已提交
echo "📦 检查未提交的更改..."
if [ -n "$(git status --porcelain)" ]; then
    git add .
    git commit -m "最终部署版本：21天变美打卡应用" || true
    echo "✅ 代码已提交"
fi

# 尝试推送代码
echo "🚀 推送到GitHub..."
if git push -u origin $BRANCH 2>&1; then
    echo "✅ 代码成功推送到GitHub！"
else
    echo "❌ 推送失败，请检查："
    echo "   1. 本地是否有未提交的更改"
    echo "   2. GitHub仓库是否已创建"
    echo "   3. 网络连接是否正常"
    echo "   4. 您的账户是否有推送权限"
    exit 1
fi

# 显示完成信息
echo ""
echo "🎉 代码推送完成！"
echo "================================="
echo ""
echo "🌐 下一步部署："
echo "1. 访问：https://vercel.com"
echo "2. 使用GitHub账号登录"
echo "3. 导入仓库：${USERNAME}/${REPO_NAME}"
echo "4. 配置并部署前端"
echo ""
echo "5. 访问：https://render.com"
echo "6. 使用GitHub账号登录"
echo "7. 部署后端：${USERNAME}/${REPO_NAME}"
echo ""
echo "📖 详细部署说明："
echo "   - QUICK-START.md （30分钟部署指南）"
echo "   - DEPLOYMENT.md （完整部署文档）"
echo ""
echo "💡 部署期间遇到问题？"
echo "   - 检查网络连接"
echo "   - 确认GitHub仓库已公开"
echo "   - 验证账户信息"
