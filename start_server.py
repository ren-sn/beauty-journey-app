#!/usr/bin/env python3
import subprocess
import time
import os
import sys
import threading

def start_server():
    """启动后端服务器"""
    try:
        server_process = subprocess.Popen(
            ['node', 'server.js'],
            cwd=os.path.join(os.path.dirname(__file__), 'backend'),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        # 等待服务器启动
        time.sleep(3)

        return server_process
    except Exception as e:
        print(f"❌ 启动服务器失败: {e}")
        return None

def start_ngrok():
    """尝试使用ngrok（备用方案）"""
    try:
        ngrok_process = subprocess.Popen(
            ['./ngrok', 'http', '3001'],
            cwd=os.path.dirname(__file__),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        time.sleep(3)

        # 检查是否已经认证
        auth_check = subprocess.run(['./ngrok', 'authtoken', '--check'], capture_output=True, text=True)
        if "not configured" in auth_check.stdout:
            print("\n⚠️  Ngrok需要认证。请访问 https://dashboard.ngrok.com/get-started/your-authtoken 获取token")
            return None

        return ngrok_process
    except Exception as e:
        print(f"⚠️ Ngrok启动失败: {e}")
        return None

def check_server():
    """检查服务器是否正常运行"""
    try:
        import urllib.request
        response = urllib.request.urlopen('http://localhost:3001/api/health', timeout=5)
        return True
    except Exception as e:
        return False

def display_info():
    """显示访问信息"""
    print("\n🎉 21天变美打卡应用部署完成！")
    print("=" * 50)
    print()
    print("📱 本地访问地址:")
    print(f"   主页面: http://localhost:3001")
    print(f"   管理员后台: http://localhost:3001/admin")
    print()
    print("🔐 管理员账号:")
    print(f"   用户名: admin")
    print(f"   密码: admin123")
    print()
    print("💡 访问方式说明:")
    print("   1. 在同一台电脑上直接访问 http://localhost:3001")
    print("   2. 在其他设备上访问您的局域网IP:3001")
    print("   3. 如需互联网访问，请参考 DEPLOYMENT.md")
    print()
    print("🌐 快速互联网部署选项（推荐）:")
    print("   - Vercel + Render 完全免费方案")
    print("   - 详细步骤请查看 DEPLOYMENT.md")
    print()
    print("❓ 常见问题:")
    print("   - 无法访问: 检查防火墙设置")
    print("   - 启动失败: 检查端口3001是否被占用")
    print("   - 数据问题: 检查data目录下的数据库文件")
    print()
    print("📖 项目说明:")
    print("   - 这是一个21天变美打卡应用")
    print("   - 支持微信、抖音小程序集成")
    print("   - 包含完整的管理后台功能")
    print()
    print("按Ctrl+C停止服务器")

def main():
    """主函数"""
    print("🚀 启动21天变美打卡应用")
    print("=" * 50)
    print()

    # 检查node是否可用
    try:
        node_version = subprocess.run(['node', '--version'], capture_output=True, text=True, check=True)
        print(f"✅ Node.js版本: {node_version.stdout.strip()}")
    except Exception as e:
        print(f"❌ Node.js未找到: {e}")
        return

    # 启动服务器
    print("\n🔧 正在启动后端服务器...")
    server_process = start_server()
    if not server_process:
        return

    # 检查服务器状态
    print("⏳ 等待服务器启动...")
    for i in range(10):
        if check_server():
            print("✅ 服务器正常运行")
            break
        time.sleep(2)
    else:
        print("❌ 服务器启动超时")
        server_process.terminate()
        return

    # 显示访问信息
    display_info()

    # 保持程序运行
    try:
        while True:
            time.sleep(10)
    except KeyboardInterrupt:
        print("\n🛑 正在停止服务器...")
        server_process.terminate()
        try:
            server_process.wait(timeout=5)
            print("✅ 服务器已停止")
        except Exception as e:
            print(f"❌ 停止服务器失败: {e}")

if __name__ == "__main__":
    main()
