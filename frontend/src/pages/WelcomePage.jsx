import React, { useState, useEffect } from 'react';
import { useAlert } from '../contexts/AlertContext';
import VideoPlayer from '../components/VideoPlayer';

function WelcomePage({ onStart, onAdmin, onGroups, onLoginUser }) {
  const letterFont = '"KaiTi", "STKaiti", "Ma Shan Zheng", "Ma Shan Zheng Regular", "Noto Sans SC", "ZCOOL QingKe HuangYou", "Hannotate SC", "FangSong", "STFangsong", "Microsoft YaHei", "PingFang SC", "Chalkboard SE", "Comic Sans MS", cursive, sans-serif';
  const [nickname, setNickname] = useState('');
  const [showDanceVideo, setShowDanceVideo] = useState(false);
  const [pendingNickname, setPendingNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nicknameHistory, setNicknameHistory] = useState([]);
  const { showAlert } = useAlert();

  // 组件初始化
  useEffect(() => {
    console.log('=== WelcomePage 初始化 ===');
    console.log('当前localStorage:', {
      history: localStorage.getItem('beauty_journey_nickname_history'),
      userData: localStorage.getItem('beauty_journey_user_data'),
      users: localStorage.getItem('beauty_journey_users')
    });

    // 获取历史记录
    const loadHistory = () => {
      let history = [];

      // 1. 从历史记录获取
      const savedHistory = localStorage.getItem('beauty_journey_nickname_history');
      if (savedHistory) {
        try {
          history = JSON.parse(savedHistory);
          console.log('从 history 读取:', history);
        } catch (e) {
          console.error('解析 history 失败:', e);
        }
      }

      // 2. 从当前用户获取
      const currentUser = localStorage.getItem('beauty_journey_user_data');
      if (currentUser) {
        try {
          const userData = JSON.parse(currentUser);
          if (userData.nickname && !history.includes(userData.nickname)) {
            history.unshift(userData.nickname);
            history = history.slice(0, 5);
            console.log('添加当前用户:', userData.nickname, history);
          }
        } catch (e) {
          console.error('解析用户数据失败:', e);
        }
      }

      // 3. 从用户列表获取
      const usersData = localStorage.getItem('beauty_journey_users');
      if (usersData) {
        try {
          const users = JSON.parse(usersData);
          users.forEach(user => {
            if (user.nickname && !history.includes(user.nickname)) {
              history.push(user.nickname);
              console.log('添加用户列表中的用户:', user.nickname, history);
            }
          });
          history = history.slice(0, 5);
        } catch (e) {
          console.error('解析用户列表失败:', e);
        }
      }

      console.log('最终历史记录:', history);

      if (history.length > 0) {
        setNicknameHistory(history);
        // 自动填充第一个
        setNickname(history[0]);
        console.log('自动填充昵称:', history[0]);
      } else {
        console.log('未找到昵称，使用默认值');
        // 测试数据
        const testHistory = ['小美', '小丽', '小红'];
        setNicknameHistory(testHistory);
        setNickname(testHistory[0]);
        localStorage.setItem('beauty_journey_nickname_history', JSON.stringify(testHistory));
      }
    };

    loadHistory();
  }, []);

  const handleCheckUser = async () => {
    if (!nickname.trim()) {
      showAlert('请填写您的昵称哦～');
      return;
    }

    saveNicknameToHistory(nickname.trim());

    setIsLoading(true);
    try {
      const response = await fetch('/api/users/find', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname: nickname.trim() }),
      });

      const result = await response.json();

      if (result.success && result.user) {
        onLoginUser(result.user, result.checkinItems || [], result.checkinRecords || []);
      } else {
        setPendingNickname(nickname.trim());
        setShowDanceVideo(true);
      }
    } catch (error) {
      console.error('检查用户失败:', error);
      setPendingNickname(nickname.trim());
      setShowDanceVideo(true);
    } finally {
      setIsLoading(false);
    }
  };

  const saveNicknameToHistory = (newNickname) => {
    if (newNickname.trim()) {
      const updatedHistory = [
        newNickname.trim(),
        ...nicknameHistory.filter(n => n !== newNickname.trim())
      ].slice(0, 5);
      setNicknameHistory(updatedHistory);
      localStorage.setItem('beauty_journey_nickname_history', JSON.stringify(updatedHistory));
    }
  };

  const selectNicknameFromHistory = (selectedNickname) => {
    setNickname(selectedNickname);
  };

  const handleVideoEnd = () => {
    setShowDanceVideo(false);
    onStart(pendingNickname);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-teal-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden page-transition">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center opacity-15"
             style={{ backgroundImage: 'url("/munamia-bg.jpg")' }} />
        <div className="absolute top-20 left-8 w-24 h-24 bg-pink-100 rounded-full opacity-40 blur-2xl" />
        <div className="absolute bottom-32 right-8 w-32 h-32 bg-teal-100 rounded-full opacity-30 blur-2xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-200 rounded-full opacity-20 blur-2xl" />
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

      <div className="relative z-10 max-w-md w-full">
        <div className="backdrop-blur-xl bg-white/80 border-2 border-pink-200 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(236,72,153,0.2)] p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-pink-600 mb-4" style={{ fontFamily: letterFont }}>
              Hi 最可爱的你🌱，<br />
              要来一起美到不可方物么？
            </h1>
            <p className="text-pink-500 text-base sm:text-lg" style={{ fontFamily: letterFont }}>
              来到这里 ❌内卷 ❌内耗<br />
              只会一起变美➕变美好
            </p>
          </div>

          {/* 昵称输入框 */}
          <div className="mb-6">
            <div className="mb-2 text-pink-600 text-sm" style={{ fontFamily: letterFont }}>
              🌸 输入你的昵称继续旅程
            </div>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={nicknameHistory.length > 0 ? `例如：${nicknameHistory[0]}` : "例如：spring"}
              className="w-full px-4 py-3 bg-white/60 border-2 border-pink-200 rounded-full text-center text-pink-700 placeholder-pink-300 focus:outline-none focus:border-pink-400 focus:bg-white/80 transition-all duration-300 text-sm sm:text-base"
              style={{ fontFamily: letterFont }}
            />

            {/* 昵称历史记录 */}
            {nicknameHistory.length > 0 && (
              <div className="mt-3">
                <div className="text-pink-400 text-xs mb-2 text-center" style={{ fontFamily: letterFont }}>
                  💭 最近使用的昵称：
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {nicknameHistory.slice(0, 3).map((historyNickname, index) => (
                    <button
                      key={index}
                      onClick={() => selectNicknameFromHistory(historyNickname)}
                      className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs hover:bg-pink-200 transition-colors"
                      style={{ fontFamily: letterFont }}
                    >
                      {historyNickname}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleCheckUser}
            disabled={isLoading}
            className="w-full font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-xl text-base sm:text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 border-b-4 sm:border-b-5 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600 text-white border-pink-700 hover:border-pink-800 disabled:opacity-50"
            style={{ fontFamily: letterFont }}
          >
            {isLoading ? '查找中...' : '继续/加入21天美丽之旅 🎀'}
          </button>

          <div className="mt-4 text-center text-pink-400 text-xs sm:text-sm" style={{ fontFamily: letterFont }}>
            <p>如果之前输入过昵称，系统会自动识别哦～</p>
          </div>
        </div>

        {/* 隐藏的管理员入口 */}
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={onAdmin}
            className="text-xs text-pink-200 hover:text-pink-400 transition-colors p-2"
            title="管理员入口"
          >
            🌸
          </button>
        </div>
      </div>

      {showDanceVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-md w-full">
            <button
              onClick={handleVideoEnd}
              className="absolute -top-12 right-0 text-white text-3xl hover:text-pink-300 transition-colors z-10"
            >
              ✕
            </button>
            <div className="rounded-3xl overflow-hidden">
              <VideoPlayer
                src="/5094a6d807c0c715f8dad2e85db9d75d.mp4"
                onEnded={handleVideoEnd}
                poster="/munamia-bg.jpg"
              />
            </div>
            <div className="text-center mt-4">
              <p className="text-white text-lg" style={{ fontFamily: letterFont }}>
                木纳喵邀请你开启美丽之旅！🎉
              </p>
              <button
                onClick={handleVideoEnd}
                className="mt-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold py-2 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                开始旅程 ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WelcomePage;
