#!/usr/bin/env python3
import subprocess
import threading
import time
import re

def start_tunnel():
    """启动Serveo隧道"""
    try:
        # 启动ssh连接到serveo.net来暴露本地3001端口
        process = subprocess.Popen(
            ['ssh', '-R', '0:localhost:3001', 'serveo.net'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1
        )

        print("🔗 正在连接到Serveo隧道...")

        public_url = None

        # 捕获输出以获取公共URL
        while True:
            output = process.stdout.readline()
            if output:
                print(output.strip())

                # 查找类似: "Forwarding TCP connections from https://abc123.serveo.net"
                match = re.search(r'Forwarding.*?(https?://[^\s]+)', output)
                if match:
                    public_url = match.group(1)
                    print(f"✅ 服务器已成功暴露！公共地址: {public_url}")
                    break

                # 检查是否有错误信息
                if "Connection closed" in output or "Error" in output:
                    print("❌ 连接失败，正在重试...")
                    time.sleep(5)
                    return start_tunnel()

            if process.poll() is not None:
                break

        return process, public_url

    except Exception as e:
        print(f"❌ 启动隧道失败: {e}")
        return None, None

def main():
    print("🚀 启动21天变美打卡应用部署")
    print("=" * 50)
    print()

    # 启动隧道
    tunnel_process, public_url = start_tunnel()

    if public_url:
        print()
        print("🎉 部署完成！")
        print("=" * 50)
        print()
        print("📱 应用访问地址:")
        print(f"   主页面: {public_url}")
        print(f"   管理员后台: {public_url}/admin")
        print()
        print("🔐 管理员账号:")
        print("   用户名: admin")
        print("   密码: admin123")
        print()
        print("💡 提示:")
        print("   - 此地址有效期至服务器关闭")
        print("   - 可以通过Ctrl+C停止服务器")
        print("   - 为了稳定性，建议部署到Vercel/Render")

        try:
            # 保持脚本运行
            while tunnel_process.poll() is None:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 用户中断，正在停止服务器...")
            tunnel_process.terminate()
            try:
                tunnel_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                tunnel_process.kill()
            print("✅ 服务器已停止")

    else:
        print("❌ 无法启动Serveo隧道")

if __name__ == "__main__":
    main()
