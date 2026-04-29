import React, { useState } from 'react';
import { useAlert } from '../contexts/AlertContext';

function SetupPage({ initialNickname, onComplete }) {
  const { showAlert } = useAlert();
  const [nickname, setNickname] = useState(initialNickname || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customItem, setCustomItem] = useState('');
  const [customItems, setCustomItems] = useState([]);
  const [initialText, setInitialText] = useState('');
  const [initialImage, setInitialImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const letterFont = '"KaiTi", "STKaiti", "Ma Shan Zheng", "Ma Shan Zheng Regular", "Noto Sans SC", "ZCOOL QingKe HuangYou", "Hannotate SC", "FangSong", "STFangsong", "Microsoft YaHei", "PingFang SC", "Chalkboard SE", "Comic Sans MS", cursive, sans-serif';

  const defaultItems = [
    { text: '💧 护肤：白天涂 2 次精华棒', isCustom: false },
    { text: '🌙 作息：11:30 前入睡', isCustom: false },
    { text: '🏃‍♀️ 运动：每周 3 次 + 日步数≥8000', isCustom: false },
    { text: '🥗 饮食：晚 8 点后不进食', isCustom: false },
    { text: '💦 喝水：每天喝够水', isCustom: false },
    { text: '🧘‍♀️ 体态：靠墙站立 5 分钟', isCustom: false },
    { text: '🍭 戒糖：少喝奶茶少甜食', isCustom: false },
  ];

  const handleToggleItem = (item) => {
    setSelectedItems(prev => {
      const index = prev.findIndex(i => i.text === item.text);
      if (index > -1) {
        return prev.filter((_, i) => i !== index);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleAddCustomItem = () => {
    if (customItem.trim()) {
      const newItem = { text: `💭 ${customItem.trim()}`, isCustom: true };
      setCustomItems([...customItems, newItem]);
      setSelectedItems([...selectedItems, newItem]);
      setCustomItem('');
      showAlert('您的专属美丽已加入！🌸');
    }
  };

  const handleRemoveCustomItem = (index) => {
    const item = customItems[index];
    setCustomItems(customItems.filter((_, i) => i !== index));
    setSelectedItems(selectedItems.filter(i => i.text !== item.text));
  };

  const handleSubmit = () => {
    if (selectedItems.length === 0) {
      showAlert('至少选择一个打卡项目呀～');
      return;
    }

    const userData = {
      nickname: initialNickname,
      checkinItems: selectedItems,
      startDate: selectedDate,
      checkinHistory: [],
      completedCycles: 0,
      initialText: initialText,
      initialImage: imagePreview
    };

    onComplete(userData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-teal-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden page-transition">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center opacity-15"
             style={{ backgroundImage: 'url("/munamia-bg.jpg")' }} />
        <div className="absolute top-20 left-8 w-24 h-24 bg-pink-100 rounded-full opacity-40 blur-2xl" />
        <div className="absolute bottom-32 right-8 w-32 h-32 bg-teal-100 rounded-full opacity-30 blur-2xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-200 rounded-full opacity-20 blur-2xl" />
        <div className="absolute top-10 right-10" style={{ animation: 'butterfly-fly 5s ease-in-out infinite' }}>
          <span className="text-5xl">🦋</span>
        </div>
        <div className="absolute top-40 left-8" style={{ animation: 'butterfly-fly 6s ease-in-out infinite 1s' }}>
          <span className="text-4xl">🦋</span>
        </div>
        <div className="absolute bottom-40 right-8" style={{ animation: 'butterfly-fly 7s ease-in-out infinite 0.5s' }}>
          <span className="text-4xl">🦋</span>
        </div>
        <div className="absolute bottom-16 left-16" style={{ animation: 'butterfly-fly 5.5s ease-in-out infinite 1.5s' }}>
          <span className="text-4xl">🦋</span>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
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
          <div className="mb-4">
            <img src="/munamia-1.jpg" alt="木纳喵" className="w-24 h-24 sm:w-32 sm:h-32 object-contain mx-auto" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ fontFamily: letterFont, color: '#FF1493' }}>
            设置你的变美之旅
          </h2>
        </div>

        <div className="space-y-5">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <label className="text-pink-700 font-medium" style={{ fontFamily: letterFont }}>
                🌸 选择变美日
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/60 border-2 border-pink-200 rounded-full text-center text-pink-700 focus:outline-none focus:border-pink-400 focus:bg-white/80 transition-all duration-300 text-sm sm:text-base"
                style={{ fontFamily: letterFont }}
              />
            </div>
          </div>

          <div>
            <label className="block text-pink-700 font-medium mb-2" style={{ fontFamily: letterFont }}>
              🌸 选择打卡之路
            </label>
            <p className="text-pink-500 text-sm mb-3" style={{ fontFamily: letterFont }}>
              不求多但求坚持住～
            </p>

            <div className="space-y-2 max-h-40 sm:max-h-52 overflow-y-auto">
              {defaultItems.map((item, index) => (
                <label
                  key={index}
                  className={`flex items-center p-2 sm:p-3 rounded-full cursor-pointer transition-all ${
                    selectedItems.find(i => i.text === item.text)
                      ? 'bg-pink-100 border-2 border-pink-400'
                      : 'bg-white/60 border-2 border-transparent hover:bg-pink-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.find(i => i.text === item.text)}
                    onChange={() => handleToggleItem(item)}
                    className="w-5 h-5 text-pink-500 rounded focus:ring-pink-400 flex-shrink-0"
                  />
                  <span className="ml-3 text-pink-700 text-sm sm:text-base break-all">{item.text}</span>
                </label>
              ))}

              {customItems.map((item, index) => (
                <label
                  key={`custom-${index}`}
                  className="flex items-center justify-between p-2 sm:p-3 rounded-full bg-purple-50 border-2 border-purple-300"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={selectedItems.find(i => i.text === item.text)}
                      onChange={() => handleToggleItem(item)}
                      className="w-5 h-5 text-purple-500 rounded focus:ring-purple-400 flex-shrink-0"
                    />
                    <span className="ml-3 text-purple-700 text-sm sm:text-base break-all truncate">{item.text}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomItem(index)}
                    className="text-purple-400 hover:text-purple-600 text-sm ml-2 flex-shrink-0"
                  >
                    删除
                  </button>
                </label>
              ))}
            </div>

            <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={handleAddCustomItem}
                className="px-4 sm:px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full hover:from-pink-500 hover:to-purple-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                style={{ fontFamily: letterFont }}
              >
                ➕
              </button>
              <input
                type="text"
                value={customItem}
                onChange={(e) => setCustomItem(e.target.value)}
                placeholder="填写你的专属小目标～"
                className="flex-1 px-4 py-3 bg-white/60 border-2 border-purple-200 rounded-full focus:outline-none focus:border-purple-400 focus:bg-white/80 transition-all duration-300 text-sm sm:text-base"
                style={{ fontFamily: letterFont }}
              />
            </div>
          </div>

          <div>
            <label className="block text-pink-700 font-medium mb-2" style={{ fontFamily: letterFont }}>
              💭 此刻的我
            </label>
            <textarea
              value={initialText}
              onChange={(e) => setInitialText(e.target.value)}
              placeholder="准备好开启变美之旅了嘛～分享一下此刻的心情吧"
              rows={3}
              className="w-full px-4 py-3 bg-white/60 border-2 border-pink-200 rounded-2xl text-pink-700 placeholder-pink-300 focus:outline-none focus:border-pink-400 focus:bg-white/80 resize-none transition-all duration-300 text-sm sm:text-base"
              style={{ fontFamily: letterFont }}
            />

            <div className="mt-3">
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-full h-24 object-cover rounded-2xl" />
                  <button
                    type="button"
                    onClick={() => { setInitialImage(null); setImagePreview(null); }}
                    className="absolute top-2 right-2 bg-pink-500 text-white rounded-full p-1"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-pink-300 rounded-full cursor-pointer bg-white/40 hover:bg-pink-50 transition-all duration-300">
                  <div className="text-center">
                    <span className="text-2xl">📸</span>
                    <span className="block text-pink-600 text-sm mt-1" style={{ fontFamily: letterFont }}>记录此刻</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setInitialImage(file);
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
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 border-b-4 sm:border-b-5 border-pink-700 hover:border-pink-800 text-base sm:text-lg"
            style={{ fontFamily: letterFont }}
          >
            开启变美之旅 ✨
          </button>
        </div>
      </div>
    </div>
  );
}

export default SetupPage;
