import React, { useState, useRef, useEffect } from 'react';
import { useAlert } from '../contexts/AlertContext';
import { downloadElementAsImage } from '../utils/imageSave';
import CalendarView from '../components/CalendarView';
import CheckinDetailPopup from '../components/CheckinDetailPopup';
import ShareModal from '../components/ShareModal';
import VideoPlayer from '../components/VideoPlayer';
import OptimizedImage from '../components/OptimizedImage';
import { formatDateString } from '../utils/dateUtils';

function DailyResultPage({ userData, onBackToDaily, onRestart }) {
  const { showAlert } = useAlert();
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedCheckin, setSelectedCheckin] = useState(null);
  const [showQuitPrompt, setShowQuitPrompt] = useState(false);
  const [showDanceVideo, setShowDanceVideo] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [selectedNewItems, setSelectedNewItems] = useState([]);
  const [customNewItem, setCustomNewItem] = useState('');
  const [customNewItems, setCustomNewItems] = useState([]);
  const saveableContentRef = useRef(null);

  // 在页面加载时显示打卡成功提醒
  useEffect(() => {
    // 检查今天是否有打卡记录
    const today = new Date();
    const todayStr = formatDateString(today);
    const hasTodayCheckin = userData.checkinHistory.some(c => c.date === todayStr);

    if (hasTodayCheckin) {
      // 延迟一点显示，让页面先加载完成
      setTimeout(() => {
        showAlert('已更新今日打卡记录！✨');
      }, 500);
    }
  }, [showAlert, userData.checkinHistory]);

  // 默认打卡项目列表（与 SetupPage 相同）
  const defaultItems = [
    { text: '💧 护肤：白天涂 2 次精华棒', isCustom: false },
    { text: '🌙 作息：11:30 前入睡', isCustom: false },
    { text: '🏃‍♀️ 运动：每周 3 次 + 日步数≥8000', isCustom: false },
    { text: '🥗 饮食：晚 8 点后不进食', isCustom: false },
    { text: '💦 喝水：每天喝够水', isCustom: false },
    { text: '🧘‍♀️ 体态：靠墙站立 5 分钟', isCustom: false },
    { text: '🍭 戒糖：少喝奶茶少甜食', isCustom: false },
  ];

  // 计算已存在的打卡项目，用于在添加新项时避免重复
  const existingCheckinItems = userData.checkinItems || [];
  const availableItems = defaultItems.filter(item =>
    !existingCheckinItems.find(existing => existing.text === item.text)
  );

  const handleToggleNewItem = (item) => {
    setSelectedNewItems(prev => {
      const index = prev.findIndex(i => i.text === item.text);
      if (index > -1) {
        return prev.filter((_, i) => i !== index);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleAddCustomNewItem = () => {
    if (customNewItem.trim()) {
      const newItem = { text: `💭 ${customNewItem.trim()}`, isCustom: true };
      setCustomNewItems([...customNewItems, newItem]);
      setSelectedNewItems([...selectedNewItems, newItem]);
      setCustomNewItem('');
    }
  };

  const handleRemoveCustomNewItem = (index) => {
    const item = customNewItems[index];
    setCustomNewItems(customNewItems.filter((_, i) => i !== index));
    setSelectedNewItems(selectedNewItems.filter(i => i.text !== item.text));
  };

  const handleConfirmAddItems = () => {
    if (selectedNewItems.length > 0) {
      // 合并新添加的打卡项目到用户数据中
      const updatedUserData = {
        ...userData,
        checkinItems: [...userData.checkinItems, ...selectedNewItems]
      };

      // 保存到本地存储
      localStorage.setItem('beauty_journey_user_data', JSON.stringify(updatedUserData));

      // 显示提示信息
      showAlert('成功添加打卡项目！这些项目将在明天及以后的打卡中出现哦～');

      // 关闭弹窗
      setShowAddItemModal(false);
      setSelectedNewItems([]);
      setCustomNewItems([]);
      setCustomNewItem('');
    }
  };

  const letterFont = '"KaiTi", "STKaiti", "Ma Shan Zheng", "Ma Shan Zheng Regular", "Noto Sans SC", "ZCOOL QingKe HuangYou", "Hannotate SC", "FangSong", "STFangsong", "Microsoft YaHei", "PingFang SC", "Chalkboard SE", "Comic Sans MS", cursive, sans-serif';

  const calculateDayInfo = () => {
    const startDate = new Date(userData.startDate);
    const today = new Date();
    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const timeDiff = today.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const completedDays = userData.checkinHistory?.length || 0;
    const progress = Math.min((completedDays / 21) * 100, 100);
    return {
      currentDay: Math.max(1, daysDiff),
      completedDays,
      progress,
      hasCompletedCycle: completedDays >= 21
    };
  };

  const dayInfo = calculateDayInfo();

  const handleDateClick = (dayOffset) => {
    const startDate = new Date(userData.startDate);
    startDate.setHours(0, 0, 0, 0);
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + dayOffset);
    targetDate.setHours(0, 0, 0, 0);
    const dateStr = formatDateString(targetDate);

    const checkin = userData.checkinHistory.find(c => c.date === dateStr);
    if (checkin) {
      setSelectedCheckin(checkin);
      setSelectedDay(dayOffset + 1);
    }
  };

  const handleClosePopup = () => {
    setSelectedCheckin(null);
    setSelectedDay(null);
  };

  const handleQuitClick = () => {
    setShowQuitPrompt(true);
  };

  const handleConfirmQuit = () => {
    setShowQuitPrompt(false);
    onRestart();
  };

  const handleCancelQuit = () => {
    setShowQuitPrompt(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!saveableContentRef.current) {
        throw new Error('无法找到要保存的内容');
      }

      const result = await downloadElementAsImage(saveableContentRef.current, {
        filename: `beauty-journey-${dayInfo.currentDay}`,
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

      <div ref={saveableContentRef} className="relative z-10 backdrop-blur-xl bg-white/80 border-2 border-pink-200 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(236,72,153,0.2)] max-w-lg w-full p-6 sm:p-8">
        <div className="text-center mb-6">
          {/* 木纳喵庆祝标题 */}
          <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: letterFont, color: '#FF1493' }}>
            {userData.nickname}，恭喜你完成今日打卡！
          </h1>
        </div>

        <div className="bg-gradient-to-r from-white to-pink-50 rounded-3xl p-6 mb-6 border-2 border-pink-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url("/507ed9e8e2e61cfcc78f94e77a80aa39.jpg")' }}></div>
          <div className="relative z-10">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-pink-700 font-medium" style={{ fontFamily: letterFont }}>
                美丽之路进程
              </span>
              <span className="text-pink-600" style={{ fontFamily: letterFont }}>{dayInfo.completedDays}/21</span>
            </div>
            <div className="w-full bg-pink-100 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full transition-all duration-500"
                style={{ width: `${dayInfo.progress}%` }}
              />
            </div>
          </div>

          {/* 21天变美日历 */}
          <div className="mb-6">
            {/* 调试：打印传递给 CalendarView 的数据 */}
            {console.log('=== DailyResultPage 传递给 CalendarView 的 userData ===', userData)}
            <CalendarView
              userData={userData}
              onDateClick={handleDateClick}
            />
            <p className="text-pink-500 text-xs text-center mt-2" style={{ fontFamily: letterFont }}>
              点击日期，查看历史打卡详情
            </p>
          </div>

          {/* 显示最近打卡记录 */}
          {userData.checkinHistory.length > 0 && (
            <div className="mb-6">
              <h3 className="text-pink-700 font-medium mb-3" style={{ fontFamily: letterFont }}>
                最近打卡记录：
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {userData.checkinHistory.slice(-3).reverse().map((checkin, index) => (
                  <div key={index} className="bg-white/60 border border-pink-200 rounded-xl p-3">
                    <div className="text-sm text-pink-600 mb-1" style={{ fontFamily: letterFont }}>
                      {new Date(checkin.date).toLocaleDateString('zh-CN')}
                    </div>
                    {checkin.text && (
                      <p className="text-pink-700 text-sm" style={{ fontFamily: letterFont }}>💭 {checkin.text}</p>
                    )}
                    {checkin.image && (
                      <div className="w-full h-32 mt-2">
                        <OptimizedImage src={checkin.image} alt="打卡照片" className="w-full h-32 rounded-lg" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {userData.checkinHistory.length > 3 && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-pink-400 hover:text-pink-600 text-sm mt-2"
                  style={{ fontFamily: letterFont }}
                >
                  {showHistory ? '收起' : '查看全部记录'}
                </button>
              )}
            </div>
          )}

          {dayInfo.hasCompletedCycle && (
            <div className="text-center mt-6 p-4 bg-gradient-to-r from-yellow-100 to-pink-100 rounded-2xl">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-xl font-bold text-pink-700" style={{ fontFamily: letterFont }}>
                恭喜你完成21天的变美之路！
              </h3>
              <p className="text-pink-600 mt-2" style={{ fontFamily: letterFont }}>
                你简直是宇宙无敌超级棒的第一美好的女子！✨
              </p>
            </div>
          )}
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 border-b-5 border-pink-700 hover:border-pink-800"
            style={{ fontFamily: letterFont }}
          >
            {isSaving ? '保存中...' : '保存图片 🌸'}
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-pink-600 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 border-b-5 border-purple-700 hover:border-purple-800"
            style={{ fontFamily: letterFont }}
          >
            邀请好友一起变美 ✨
          </button>

          {dayInfo.hasCompletedCycle && (
            <>
              <button
                onClick={onRestart}
                className="w-full bg-gradient-to-r from-purple-400 to-purple-500 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 border-b-5 border-purple-700 hover:border-purple-800"
                style={{ fontFamily: letterFont }}
              >
                开启新一轮21天打卡 ✨
              </button>

              <button
                onClick={handleQuitClick}
                className="w-full bg-gray-200 text-gray-600 font-medium py-3 px-10 rounded-xl hover:bg-gray-300 transition-colors"
                style={{ fontFamily: letterFont }}
              >
                我不想继续美了
              </button>
            </>
          )}

          {!dayInfo.hasCompletedCycle && (
            <button
              onClick={() => setShowAddItemModal(true)}
              className="w-full bg-pink-200 text-pink-700 font-medium py-4 px-10 rounded-xl hover:bg-pink-300 transition-colors"
              style={{ fontFamily: letterFont }}
            >
              再来一个打卡项 ✨
            </button>
          )}
        </div>
      </div>

      {/* 木纳喵跳舞视频弹窗 */}
      {showDanceVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-md w-full">
            <button
              onClick={() => setShowDanceVideo(false)}
              className="absolute -top-12 right-0 text-white text-3xl hover:text-pink-300 transition-colors z-10"
            >
              ✕
            </button>
            <div className="rounded-3xl overflow-hidden">
              <VideoPlayer
                src="/5094a6d807c0c715f8dad2e85db9d75d.mp4"
                onEnded={() => setShowDanceVideo(false)}
                poster="/munamia-bg.jpg"
              />
            </div>
            <div className="text-center mt-4">
              <p className="text-white text-lg" style={{ fontFamily: letterFont }}>
                木纳喵为你庆祝！🎉
              </p>
              <button
                onClick={() => setShowDanceVideo(false)}
                className="mt-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold py-2 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                继续打卡之旅 ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 打卡详情弹窗 */}
      {selectedCheckin && selectedDay && (
        <CheckinDetailPopup
          checkin={selectedCheckin}
          dayNum={selectedDay}
          onClose={handleClosePopup}
        />
      )}

      {/* 退出提示弹窗 */}
      {showQuitPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center">
            <div className="text-6xl mb-4">🥺</div>
            <h2 className="text-2xl font-bold text-pink-700 mb-4">
              我们一直在等你回来哦！
            </h2>
            <p className="text-pink-600 mb-6 text-lg">
              真的要放弃变美之旅吗？我们相信你会回来的！💕
            </p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={handleConfirmQuit}
                className="bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                是的，我要退出
              </button>
              <button
                onClick={handleCancelQuit}
                className="bg-pink-200 text-pink-700 font-bold py-3 px-6 rounded-xl hover:bg-pink-300 transition-all duration-300"
              >
                再想想
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 添加打卡项弹窗 */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative backdrop-blur-xl bg-white/95 border-2 border-pink-200 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(236,72,153,0.2)] max-w-lg w-full p-6">
            <button
              onClick={() => {
                setShowAddItemModal(false);
                setSelectedNewItems([]);
                setCustomNewItems([]);
                setCustomNewItem('');
              }}
              className="absolute top-4 right-4 text-pink-400 text-3xl hover:text-pink-600 transition-colors"
            >
              ✕
            </button>

            <div className="text-center mb-4">
              <div className="mb-4">
                <img src="/munamia-2.jpg" alt="木纳喵" className="w-24 h-24 object-contain mx-auto" />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ fontFamily: letterFont, color: '#FF1493' }}>
                添加打卡项 🌸
              </h2>
              <p className="text-pink-600 text-sm" style={{ fontFamily: letterFont }}>
                选择新的打卡项，明天开始新的挑战哦～
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-pink-700 font-medium mb-2" style={{ fontFamily: letterFont }}>
                  选择打卡之路 🌸
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {availableItems.length > 0 ? (
                    availableItems.map((item, index) => (
                      <label
                        key={index}
                        className={`flex items-center p-3 rounded-full cursor-pointer transition-all ${
                          selectedNewItems.find(i => i.text === item.text)
                            ? 'bg-pink-100 border-2 border-pink-400'
                            : 'bg-white/60 border-2 border-transparent hover:bg-pink-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedNewItems.find(i => i.text === item.text)}
                          onChange={() => handleToggleNewItem(item)}
                          className="w-5 h-5 text-pink-500 rounded focus:ring-pink-400"
                        />
                        <span className="ml-3 text-pink-700">{item.text}</span>
                      </label>
                    ))
                  ) : (
                    <div className="text-center text-pink-400 py-4" style={{ fontFamily: letterFont }}>
                      所有默认打卡项都已添加过了哦～
                    </div>
                  )}

                  {customNewItems.map((item, index) => (
                    <label
                      key={`custom-${index}`}
                      className="flex items-center justify-between p-3 rounded-full bg-purple-50 border-2 border-purple-300"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedNewItems.find(i => i.text === item.text)}
                          onChange={() => handleToggleNewItem(item)}
                          className="w-5 h-5 text-purple-500 rounded focus:ring-purple-400"
                        />
                        <span className="ml-3 text-purple-700">{item.text}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomNewItem(index)}
                        className="text-purple-400 hover:text-purple-600"
                      >
                        删除
                      </button>
                    </label>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <input
                    type="text"
                    value={customNewItem}
                    onChange={(e) => setCustomNewItem(e.target.value)}
                    placeholder="填写你的专属小目标～"
                    className="flex-1 px-4 py-3 bg-white/60 border-2 border-purple-200 rounded-full focus:outline-none focus:border-purple-400 focus:bg-white/80 transition-all duration-300"
                    style={{ fontFamily: letterFont }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomNewItem}
                    className="px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full hover:from-pink-500 hover:to-purple-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    style={{ fontFamily: letterFont }}
                  >
                    ➕
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <button
                  onClick={handleConfirmAddItems}
                  className="w-full bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 border-b-5 border-pink-700 hover:border-pink-800"
                  style={{ fontFamily: letterFont }}
                >
                  确定添加打卡项 ✨
                </button>

                <button
                  onClick={onBackToDaily}
                  className="w-full bg-pink-200 text-pink-700 font-medium py-3 px-10 rounded-xl hover:bg-pink-300 transition-colors"
                  style={{ fontFamily: letterFont }}
                >
                  跳过，继续打卡
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 分享弹窗 */}
      <ShareModal
        isVisible={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
}

export default DailyResultPage;
