import React from 'react';

function CheckinDetailPopup({ checkin, dayNum, onClose }) {
  if (!checkin) return null;

  const letterFont = '"KaiTi", "STKaiti", "Ma Shan Zheng", "Ma Shan Zheng Regular", "Noto Sans SC", "ZCOOL QingKe HuangYou", "Hannotate SC", "FangSong", "STFangsong", "Microsoft YaHei", "PingFang SC", "Chalkboard SE", "Comic Sans MS", cursive, sans-serif';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-pink-700 mb-4 text-center" style={{ fontFamily: letterFont }}>
          第{dayNum}天打卡详情
        </h2>

        <div className="space-y-4">
          <div className="bg-pink-50 rounded-2xl p-4">
            <h3 className="text-pink-700 font-medium mb-2" style={{ fontFamily: letterFont }}>完成项目：</h3>
            <div className="space-y-1">
              {checkin.completedItems?.map((item, idx) => (
                <div key={idx} className="text-pink-600 text-sm" style={{ fontFamily: letterFont }}>✅ {item.text}</div>
              ))}
            </div>
          </div>

          {checkin.text && (
            <div className="bg-pink-50 rounded-2xl p-4">
              <h3 className="text-pink-700 font-medium mb-2" style={{ fontFamily: letterFont }}>💭 今日心情：</h3>
              <p className="text-pink-600 text-sm" style={{ fontFamily: letterFont }}>{checkin.text}</p>
            </div>
          )}

          {checkin.image && (
            <div className="bg-pink-50 rounded-2xl p-4">
              <h3 className="text-pink-700 font-medium mb-2" style={{ fontFamily: letterFont }}>📸 今日美照：</h3>
              <img
                src={checkin.image}
                alt="打卡照片"
                className="w-full h-48 object-cover rounded-xl"
              />
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
          style={{ fontFamily: letterFont }}
        >
          关闭
        </button>
      </div>
    </div>
  );
}

export default CheckinDetailPopup;
