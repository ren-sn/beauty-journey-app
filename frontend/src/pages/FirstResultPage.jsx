import React, { useRef, useState } from 'react';
import { useAlert } from '../contexts/AlertContext';
import { downloadElementAsImage } from '../utils/imageSave';

function FirstResultPage({ userData, onContinue }) {
  const { showAlert } = useAlert();
  const [isSaving, setIsSaving] = useState(false);
  const saveableContentRef = useRef(null);

  const letterFont = '"KaiTi", "STKaiti", "Ma Shan Zheng", "Ma Shan Zheng Regular", "Noto Sans SC", "ZCOOL QingKe HuangYou", "Hannotate SC", "FangSong", "STFangsong", "Microsoft YaHei", "PingFang SC", "Chalkboard SE", "Comic Sans MS", cursive, sans-serif';

  const today = new Date(userData.startDate || Date.now()).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!saveableContentRef.current) {
        throw new Error('无法找到要保存的内容');
      }

      const result = await downloadElementAsImage(saveableContentRef.current, {
        filename: `beauty-journey-first`,
        format: 'png',
        pixelRatio: 2,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      setIsSaving(false);
    } catch (error) {
      console.error('保存失败:', error);
      setIsSaving(false);
      showAlert('保存失败，请重试');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-teal-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden page-transition">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center opacity-15"
             style={{ backgroundImage: 'url("/munamia-bg.jpg")' }} />
        <div className="absolute top-20 left-8 w-24 h-24 bg-pink-100 rounded-full opacity-40 blur-2xl" />
        <div className="absolute bottom-32 right-8 w-32 h-32 bg-teal-100 rounded-full opacity-30 blur-2xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-200 rounded-full opacity-20 blur-2xl" />
        {/* 蝴蝶飞舞装饰 */}
        <div className="absolute top-10 right-10" style={{ animation: 'butterfly-fly 5s ease-in-out infinite', WebkitAnimation: 'butterfly-fly 5s ease-in-out infinite' }}>
          <span className="text-5xl">🦋</span>
        </div>
        <div className="absolute top-40 left-8" style={{ animation: 'butterfly-fly 6s ease-in-out infinite 1s', WebkitAnimation: 'butterfly-fly 6s ease-in-out infinite 1s' }}>
          <span className="text-4xl">🦋</span>
        </div>
        <div className="absolute bottom-40 right-8" style={{ animation: 'butterfly-fly 7s ease-in-out infinite 0.5s', WebkitAnimation: 'butterfly-fly 7s ease-in-out infinite 0.5s' }}>
          <span className="text-4xl">🦋</span>
        </div>
        <div className="absolute bottom-16 left-16" style={{ animation: 'butterfly-fly 5.5s ease-in-out infinite 1.5s', WebkitAnimation: 'butterfly-fly 5.5s ease-in-out infinite 1.5s' }}>
          <span className="text-4xl">🦋</span>
        </div>
        {/* 添加动画CSS */}
        <style dangerouslySetInnerHTML={{__html: `
          @-webkit-keyframes butterfly-fly {
            0%, 100% { -webkit-transform: translate(0, 0) rotate(0deg); }
            25% { -webkit-transform: translate(10px, -15px) rotate(10deg); }
            50% { -webkit-transform: translate(5px, 5px) rotate(-5deg); }
            75% { -webkit-transform: translate(-10px, -10px) rotate(5deg); }
          }
          @keyframes butterfly-fly {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(10px, -15px) rotate(10deg); }
            50% { transform: translate(5px, 5px) rotate(-5deg); }
            75% { transform: translate(-10px, -10px) rotate(5deg); }
          }
        `}} />
      </div>

      <div
        ref={saveableContentRef}
        className="relative z-10 backdrop-blur-xl bg-white/80 border-2 border-pink-200 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(236,72,153,0.2)] max-w-lg w-full p-6 sm:p-8"
      >
        <div className="text-center mb-6">
          {/* 固定不动的木纳喵图片 */}
          <div className="mb-4">
            <img src="/munamia-2.jpg" alt="木纳喵" className="w-32 h-32 object-contain mx-auto" />
          </div>
          <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: letterFont, color: '#FF1493' }}>
            准备完成！
          </h1>
          <p className="text-lg mb-6" style={{ fontFamily: letterFont, color: '#FF69B4' }}>
            今天是 {today} <br />
            是 {userData.nickname} 小可爱的第1天～
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-pink-700 font-medium mb-4 text-center" style={{ fontFamily: letterFont }}>
            你选择的打卡项目：
          </h3>
          <div className="space-y-2">
            {userData.checkinItems.map((item, index) => (
              <div
                key={index}
                className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-3 flex items-center"
              >
                <span className="text-pink-700" style={{ fontFamily: letterFont }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {userData.initialText && (
          <div className="mb-8">
            <h3 className="text-pink-700 font-medium mb-4 text-center" style={{ fontFamily: letterFont }}>
              💭 此刻的我：
            </h3>
            <div className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center opacity-15"
                   style={{ backgroundImage: 'url("/munamia-bg-checkin.jpg")' }} />
              <p className="text-pink-700 relative z-10" style={{ fontFamily: letterFont }}>{userData.initialText}</p>
            </div>
          </div>
        )}

        {userData.initialImage && (
          <div className="mb-8">
            <h3 className="text-pink-700 font-medium mb-4 text-center" style={{ fontFamily: letterFont }}>
              📸 美美的照片：
            </h3>
            <div className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-3">
              <img src={userData.initialImage} alt="初始照片" className="w-full h-48 object-cover rounded-xl" />
            </div>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 border-b-5 border-pink-700 hover:border-pink-800"
            style={{ fontFamily: letterFont }}
          >
            开始第一天打卡 ✨
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 border-b-5 border-purple-600 hover:border-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: letterFont }}
          >
            {isSaving ? '保存中...' : '保存勇气 🌸'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FirstResultPage;
