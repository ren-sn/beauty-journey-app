import React, { useState } from 'react';
import { useAlert } from '../contexts/AlertContext';
import { formatDateString } from '../utils/dateUtils';
import VideoPlayer from '../components/VideoPlayer';
import OptimizedImage from '../components/OptimizedImage';

function DailyCheckinPage({ userData, onCheckinComplete, onRestart }) {
  const { showAlert } = useAlert();
  const [todayText, setTodayText] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [todayImage, setTodayImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDanceVideo, setShowDanceVideo] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState(null);

  const letterFont = '"KaiTi", "STKaiti", "Ma Shan Zheng", "Ma Shan Zheng Regular", "Noto Sans SC", "ZCOOL QingKe HuangYou", "Hannotate SC", "FangSong", "STFangsong", "Microsoft YaHei", "PingFang SC", "Chalkboard SE", "Comic Sans MS", cursive, sans-serif';

  // 计算打卡信息 - 修复日期计算和格式化一致性问题
  const calculateDayInfo = () => {
    // 确保 startDate 格式化一致
    const startDate = new Date(userData.startDate);
    startDate.setHours(0, 0, 0, 0); // 确保时间一致
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 确保时间一致

    // 计算从开始日期到今天的天数差
    const timeDiff = today.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const currentDay = Math.max(1, daysDiff);

    // 计算第N天对应的日期（直接计算，这样避免时区问题
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + currentDay - 1);
    targetDate.setHours(0, 0, 0, 0);
    const currentDayDateStr = formatDateString(targetDate);

    const completedDays = userData.checkinHistory?.length || 0;

    // 验证是否已经过了截止日期（21天）
    if (currentDay > 21) {
      console.log('打卡周期已结束！');
      return {
        currentDay: 21, // 显示第21天
        completedDays,
        currentDayDateStr: formatDateString(new Date(startDate.getTime() + 20 * 24 * 60 * 60 * 1000)),
        isCycleCompleted: true
      };
    }

    console.log('计算打卡信息:', {
      startDate: formatDateString(startDate),
      today: formatDateString(today),
      currentDay,
      currentDayDateStr,
      completedDays
    });

    return {
      currentDay,
      completedDays,
      currentDayDateStr,
      isCycleCompleted: false
    };
  };

  const dayInfo = calculateDayInfo();

  // 回显今日已打卡的内容
  React.useEffect(() => {
    const existingCheckin = userData.checkinHistory.find(c => c.date === dayInfo.currentDayDateStr);
    if (existingCheckin) {
      setSelectedItems(existingCheckin.completedItems || []);
      setTodayText(existingCheckin.text || '');
      setImagePreview(existingCheckin.image || null);
    }
  }, [userData.checkinHistory, dayInfo.currentDayDateStr]);

  const handleToggleItem = (item) => {
    setSelectedItems(prev => {
      // 使用更精确的匹配方式
      const targetText = item.text || item.item_text;
      const isSelected = prev.some(i => {
        const selectedText = i.text || i.item_text;
        return selectedText === targetText;
      });

      if (isSelected) {
        return prev.filter(i => {
          const selectedText = i.text || i.item_text;
          return selectedText !== targetText;
        });
      } else {
        // 确保添加的item有正确的格式
        const normalizedItem = {
          text: targetText,
          isCustom: item.isCustom !== undefined ? item.isCustom : (item.is_custom === 1)
        };
        return [...prev, normalizedItem];
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      showAlert('至少要完成一个打卡项目哦～');
      return;
    }

    setIsSubmitting(true);

    try {
      const dateStr = dayInfo.currentDayDateStr;

      console.log('handleSubmit 调用:', {
        dateStr,
        checkinHistory: userData.checkinHistory
      });

      // 检查当天是否已经打卡过
      const existingCheckin = userData.checkinHistory.find(c => c.date === dateStr);

      let updatedCheckinHistory;
      if (existingCheckin) {
        // 今天已经打过卡，更新当天的记录
        updatedCheckinHistory = userData.checkinHistory.map(c =>
          c.date === dateStr
            ? { ...c, completedItems: selectedItems, text: todayText, image: imagePreview }
            : c
        );
        console.log('已更新今日打卡记录');
      } else {
        // 今天第一次打卡
        const checkinData = {
          date: dateStr,
          completedItems: selectedItems,
          text: todayText,
          image: imagePreview
        };
        updatedCheckinHistory = [...userData.checkinHistory, checkinData];
        console.log('新增今日打卡记录');
      }

      const newUpdatedUserData = {
        ...userData,
        checkinHistory: updatedCheckinHistory
      };

      // 确保 localStorage 中的数据是最新的
      localStorage.setItem('beauty_journey_user_data', JSON.stringify(newUpdatedUserData));
      setUpdatedUserData(newUpdatedUserData);

      // 同时更新用户列表中的数据，以便管理后台可以看到
      const usersData = JSON.parse(localStorage.getItem('beauty_journey_users') || '[]');
      console.log('准备更新用户列表:', {
        currentUserNickname: userData.nickname,
        usersDataBeforeUpdate: usersData,
        usersCountBeforeUpdate: usersData.length
      });

      const existingUserIndex = usersData.findIndex(u => u.nickname === userData.nickname);
      if (existingUserIndex >= 0) {
        console.log('找到现有用户，索引:', existingUserIndex);
        usersData[existingUserIndex] = newUpdatedUserData;
        localStorage.setItem('beauty_journey_users', JSON.stringify(usersData));
        console.log('已更新用户列表中的数据');
      } else {
        // 如果用户是第一次打卡，将用户数据添加到用户列表中
        console.log('用户第一次打卡，添加到用户列表');
        usersData.push(newUpdatedUserData);
        localStorage.setItem('beauty_journey_users', JSON.stringify(usersData));
        console.log('已添加新用户到用户列表');
      }

      // 调用后端API保存打卡数据
      try {
        const formData = new FormData();
        formData.append('contentText', todayText);
        formData.append('completedItems', JSON.stringify(selectedItems));
        formData.append('checkinDate', dateStr);

        if (todayImage) {
          formData.append('image', todayImage);
        }

        // 调用后端API
        const response = await fetch(`/api/checkin/${userData.id}`, {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || '打卡失败');
        }
      } catch (apiError) {
        console.error('后端API保存失败:', apiError);
        // 继续使用localStorage作为备用方案
      }

      // 显示跳舞视频
      setShowDanceVideo(true);
    } catch (error) {
      console.error('提交失败:', error);
      showAlert('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVideoEnd = () => {
    setShowDanceVideo(false);
    // 直接从localStorage获取最新数据
    const savedData = localStorage.getItem('beauty_journey_user_data');
    if (savedData) {
      onCheckinComplete(JSON.parse(savedData));
    } else {
      onCheckinComplete(userData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-teal-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden page-transition">
      <div className="absolute inset-0">
        {/* 木纳喵背景图 */}
        <div className="absolute inset-0 bg-cover bg-center opacity-25"
             style={{ backgroundImage: 'url("/munamia-bg-checkin.jpg")' }} />
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

      <div className="relative z-10 backdrop-blur-xl bg-white/80 border-2 border-pink-200 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(236,72,153,0.2)] max-w-lg w-full p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-pink-600 mb-4" style={{ fontFamily: letterFont }}>
            📝 第 {dayInfo.currentDay} 天打卡 📝
          </h1>
          <p className="text-pink-500 text-lg mb-6" style={{ fontFamily: letterFont }}>
            今天的打卡还顺利嘛～
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-pink-700 font-medium mb-4 text-center" style={{ fontFamily: letterFont }}>
            打卡项目：
          </h3>
          <div className="space-y-2">
            {userData.checkinItems.map((item, index) => {
              // 规范化item的text字段
              const itemText = item.text || item.item_text;
              // 使用更稳定的key
              const itemKey = itemText || `item-${index}`;
              // 检查是否已选中 - 使用更精确的匹配
              const isChecked = selectedItems.some(i => {
                const selectedText = i.text || i.item_text || '';
                return selectedText === itemText;
              });

              return (
                <label
                  key={itemKey}
                  className={`flex items-center p-3 rounded-2xl cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-pink-100 border-2 border-pink-400'
                      : 'bg-white/60 border-2 border-transparent hover:bg-pink-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleItem(item)}
                    className="w-5 h-5 text-pink-500 rounded focus:ring-pink-400"
                  />
                  <span className="ml-3 text-pink-700">{itemText}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-pink-700 font-medium mb-2 text-center" style={{ fontFamily: letterFont }}>
            💭 今天的心情/感想：
          </label>
          <div className="relative overflow-hidden rounded-2xl border-2 border-pink-200">
            <div className="absolute inset-0 bg-cover bg-center opacity-15"
                 style={{ backgroundImage: 'url("/munamia-bg-checkin.jpg")' }} />
            <textarea
              value={todayText}
              onChange={(e) => setTodayText(e.target.value)}
              placeholder="今天的美丽之路还顺利吗，来分享快乐或小困难～"
              rows={3}
              className="w-full px-4 py-3 bg-white/40 text-pink-700 placeholder-pink-300 focus:outline-none focus:bg-white/60 resize-none transition-all duration-300 relative z-10"
              style={{ fontFamily: letterFont }}
            />
          </div>
        </div>

        <div className="mb-8">
          {imagePreview ? (
            <div className="relative w-full h-40">
              <OptimizedImage src={imagePreview} alt="打卡照片" className="w-full h-40 rounded-2xl" />
              <button
                type="button"
                onClick={() => { setTodayImage(null); setImagePreview(null); }}
                className="absolute top-2 right-2 bg-pink-500 text-white rounded-full p-1 z-20"
              >
                ✕
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-pink-300 rounded-2xl cursor-pointer bg-white/40 hover:bg-pink-50 transition-colors">
              <div className="text-center">
                <span className="text-4xl">📸</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setTodayImage(file);
                    const reader = new FileReader();
                    reader.onload = (e) => setImagePreview(e.target.result);
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 border-b-5 border-pink-700 hover:border-pink-800 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: letterFont }}
          >
            {isSubmitting ? '提交中...' : '✨ 完成今日打卡 ✨'}
          </button>


          <button
            onClick={onRestart}
            className="w-full bg-gray-200 text-gray-600 font-medium py-3 px-10 rounded-xl hover:bg-gray-300 transition-colors"
          >
            重新开始
          </button>
        </div>

        {/* 木纳喵跳舞视频弹窗 */}
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
                  src="/2c1092030e282323385c75f6161ff278.mp4"
                  onEnded={handleVideoEnd}
                  poster="/munamia-bg-checkin.jpg"
                  startTime={0}
                  endTime={10} // 截取前10秒的视频片段
                />
              </div>
              <div className="text-center mt-4">
                <p className="text-white text-lg" style={{ fontFamily: letterFont }}>
                  木纳喵为你庆祝！🎉
                </p>
                <button
                  onClick={handleVideoEnd}
                  className="mt-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold py-2 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  查看结果 ✨
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DailyCheckinPage;
