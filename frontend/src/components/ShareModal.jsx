import React, { useState } from 'react';
import { copyShareLink, shareWithSystem } from '../utils/shareUtils';

function ShareModal({ isVisible, onClose }) {
  const [isCopying, setIsCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const letterFont = '"KaiTi", "STKaiti", "Ma Shan Zheng", "Ma Shan Zheng Regular", "Noto Sans SC", "ZCOOL QingKe HuangYou", "Hannotate SC", "FangSong", "STFangsong", "Microsoft YaHei", "PingFang SC", "Chalkboard SE", "Comic Sans MS", cursive, sans-serif';

  const handleCopyShareLink = async () => {
    setIsCopying(true);
    const result = await copyShareLink();

    if (result.success) {
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
        onClose();
      }, 2000);
    } else {
      alert('复制链接失败，请手动复制页面地址');
    }

    setIsCopying(false);
  };

  const handleSystemShare = async () => {
    const result = await shareWithSystem();

    if (result.success) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-8 relative">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-pink-400 text-3xl hover:text-pink-600 transition-colors"
        >
          ✕
        </button>

        <div className="text-center">
          {/* 标题 */}
          <h3 className="text-2xl font-bold text-pink-700 mb-6" style={{ fontFamily: letterFont }}>
            邀请好友一起变美！
          </h3>

          {/* 分享二维码提示 */}
          <div className="bg-pink-50 rounded-2xl p-4 mb-6">
            <p className="text-pink-600 mb-3" style={{ fontFamily: letterFont }}>
              👬 邀请好友一起打卡
            </p>
            <div className="bg-white rounded-xl p-3">
              <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: letterFont }}>
                👇 点击复制链接分享 👇
              </p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="space-y-4">
            <button
              onClick={handleCopyShareLink}
              disabled={isCopying}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              style={{ fontFamily: letterFont }}
            >
              {isCopying ? '复制中...' : copySuccess ? '✓ 已复制！' : '复制链接'}
            </button>

            <button
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-300 transition-colors"
              style={{ fontFamily: letterFont }}
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;
