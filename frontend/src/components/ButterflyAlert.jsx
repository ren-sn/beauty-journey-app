import React, { useEffect, useState } from 'react';

function ButterflyAlert({ message, isVisible, onClose }) {
  const letterFont = '"KaiTi", "STKaiti", "Ma Shan Zheng", "Ma Shan Zheng Regular", "Noto Sans SC", "ZCOOL QingKe HuangYou", "Hannotate SC", "FangSong", "STFangsong", "Microsoft YaHei", "PingFang SC", "Chalkboard SE", "Comic Sans MS", cursive, sans-serif';

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    isVisible && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="relative">
          {/* 蝴蝶装饰 */}
          <div className="absolute -top-8 -left-8 text-4xl animate-bounce" style={{ animationDuration: '1s', WebkitAnimationDuration: '1s' }}>
            🦋
          </div>
          <div className="absolute -top-6 -right-6 text-3xl animate-bounce" style={{ animationDuration: '1.2s', animationDelay: '0.2s', WebkitAnimationDuration: '1.2s', WebkitAnimationDelay: '0.2s' }}>
            🦋
          </div>
          <div className="absolute bottom-2 left-4 text-2xl animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.4s', WebkitAnimationDuration: '0.8s', WebkitAnimationDelay: '0.4s' }}>
            🦋
          </div>

          {/* 弹窗主体 */}
          <div className="bg-white rounded-3xl p-8 border-4 border-pink-200 shadow-lg relative overflow-hidden">
            {/* 木纳喵背景 */}
            <div className="absolute inset-0 opacity-10"
                 style={{
                   backgroundImage: 'url("/munamia-bg.jpg")',
                   backgroundSize: 'cover',
                   backgroundPosition: 'center'
                 }} />

            {/* 木纳喵头像 */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
              <img
                src="/munamia-1.jpg"
                alt="木纳喵"
                className="w-20 h-20 rounded-full border-4 border-pink-200 shadow-lg"
              />
            </div>

            <div className="relative z-10 text-center">
              {/* 标题 */}
              <h3 className="text-xl font-bold text-pink-600 mb-4 mt-4" style={{ fontFamily: letterFont }}>
                🌸 木纳喵提醒
              </h3>

              {/* 消息内容 */}
              <p className="text-pink-700 mb-6 text-lg" style={{ fontFamily: letterFont }}>
                {message}
              </p>

              {/* 确认按钮 */}
              <button
                onClick={handleClose}
                className="bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                style={{ fontFamily: letterFont }}
              >
                好的 🌸
              </button>
            </div>

            {/* 底部装饰 */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300"></div>
          </div>
        </div>
      </div>
    )
  );
}

export default ButterflyAlert;
