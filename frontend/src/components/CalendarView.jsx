import React from 'react';

function CalendarView({ userData, onDateClick }) {
  const startDate = new Date(userData.startDate);
  const checkinHistory = userData.checkinHistory || [];

  const letterFont = '"KaiTi", "STKaiti", "Ma Shan Zheng", "Ma Shan Zheng Regular", "Noto Sans SC", "ZCOOL QingKe HuangYou", "Hannotate SC", "FangSong", "STFangsong", "Microsoft YaHei", "PingFang SC", "Chalkboard SE", "Comic Sans MS", cursive, sans-serif';

  // 日期格式化：YYYY-MM-DD
  const formatDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 获取今天的日期（格式化）
  const getTodayStr = () => {
    const today = new Date();
    return formatDateString(today);
  };

  // 计算某天的状态
  const getCheckinStatus = (dayOffset) => {
    // 计算这一天的日期
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + dayOffset);
    const targetDateStr = formatDateString(targetDate);

    const todayStr = getTodayStr();

    // 判断1：日期 > 今天 → 未来
    if (targetDateStr > todayStr) {
      return 'future';
    }

    // 判断2：是否已打卡
    const hasCheckin = checkinHistory.some(c => c.date === targetDateStr);
    if (hasCheckin) {
      return 'completed';
    }

    // 判断3：未打卡
    return 'missed';
  };

  // 格式化显示日期（如 4/29）
  const formatDisplayDate = (dayOffset) => {
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + dayOffset);
    return `${targetDate.getMonth() + 1}/${targetDate.getDate()}`;
  };

  // 渲染21天
  const renderDays = () => {
    const days = [];
    for (let i = 0; i < 21; i++) {
      const status = getCheckinStatus(i);
      const dayNum = i + 1;

      days.push(
        <div
          key={i}
          onClick={() => status !== 'future' && onDateClick(i)}
          className={`
            aspect-square flex flex-col items-center justify-center rounded-2xl
            text-center cursor-pointer transition-all duration-300
            ${status === 'completed' ? 'bg-green-100 border-2 border-green-300' : ''}
            ${status === 'missed' ? 'bg-gray-100 border-2 border-gray-200' : ''}
            ${status === 'future' ? 'bg-pink-50 border-2 border-pink-100 cursor-not-allowed' : ''}
            hover:scale-105
          `}
        >
          <div className="text-lg font-bold" style={{ fontFamily: letterFont, color: status === 'completed' ? '#10b981' : status === 'missed' ? '#ef4444' : 'transparent' }}>
            {status === 'completed' ? '已打卡' : status === 'missed' ? '未打卡' : ''}
          </div>
          <div className="text-xs text-pink-600 mt-1" style={{ fontFamily: letterFont }}>
            {status === 'future' ? formatDisplayDate(i) : `${dayNum}`}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="bg-white/80 rounded-2xl p-4 border-2 border-pink-200">
      <h3 className="text-center text-pink-700 font-bold mb-4 text-lg" style={{ fontFamily: letterFont }}>21天变美日历</h3>
      <div className="grid grid-cols-7 gap-2">
        {renderDays()}
      </div>
    </div>
  );
}

export default CalendarView;
