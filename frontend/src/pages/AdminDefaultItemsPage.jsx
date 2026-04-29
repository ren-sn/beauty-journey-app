import React, { useState, useEffect } from 'react';

function AdminDefaultItemsPage({ onBack }) {
  const [defaultItems, setDefaultItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editValue, setEditValue] = useState('');

  const letterFont = '"KaiTi", "STKaiti", "Ma Shan Zheng", "Ma Shan Zheng Regular", "Noto Sans SC", "ZCOOL QingKe HuangYou", "Hannotate SC", "FangSong", "STFangsong", "Microsoft YaHei", "PingFang SC", "Chalkboard SE", "Comic Sans MS", cursive, sans-serif';

  // 从 localStorage 加载默认项目
  useEffect(() => {
    const savedItems = localStorage.getItem('beauty_journey_default_items');
    if (savedItems) {
      setDefaultItems(JSON.parse(savedItems));
    } else {
      // 初始默认项目
      const initialItems = [
        { id: 1, text: '💧 护肤：白天涂 2 次精华棒', isCustom: false },
        { id: 2, text: '🌙 作息：11:30 前入睡', isCustom: false },
        { id: 3, text: '🏃‍♀️ 运动：每周 3 次 + 日步数≥8000', isCustom: false },
        { id: 4, text: '🥗 饮食：晚 8 点后不进食', isCustom: false },
        { id: 5, text: '💦 喝水：每日 1500ml 温水', isCustom: false },
        { id: 6, text: '🧘‍♀️ 体态：靠墙站立 5 分钟', isCustom: false },
        { id: 7, text: '🍭 戒糖：少喝奶茶少甜食', isCustom: false }
      ];
      setDefaultItems(initialItems);
      localStorage.setItem('beauty_journey_default_items', JSON.stringify(initialItems));
    }
  }, []);

  // 保存默认项目
  const saveDefaultItems = (items) => {
    setDefaultItems(items);
    localStorage.setItem('beauty_journey_default_items', JSON.stringify(items));
  };

  // 添加新项目
  const handleAddItem = () => {
    if (!newItem.trim()) return;

    const newItemObj = {
      id: Date.now(),
      text: newItem.trim(),
      isCustom: true
    };

    saveDefaultItems([...defaultItems, newItemObj]);
    setNewItem('');
  };

  // 开始编辑项目
  const handleEditItem = (item) => {
    setEditingItem(item);
    setEditValue(item.text);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (!editValue.trim() || !editingItem) return;

    const updatedItems = defaultItems.map(item =>
      item.id === editingItem.id
        ? { ...item, text: editValue.trim() }
        : item
    );

    saveDefaultItems(updatedItems);
    setEditingItem(null);
    setEditValue('');
  };

  // 删除项目
  const handleDeleteItem = (itemId) => {
    if (!confirm('确定要删除这个打卡项目吗？')) return;

    const updatedItems = defaultItems.filter(item => item.id !== itemId);
    saveDefaultItems(updatedItems);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 p-4 page-transition">
      <div className="max-w-4xl mx-auto">
        <div className="backdrop-blur-xl bg-white/70 border border-pink-200/50 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(236,72,153,0.08)] p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-pink-600 mb-4" style={{ fontFamily: letterFont }}>
                📝 默认打卡项目管理
              </h1>
            </div>
            <button
              onClick={onBack}
              className="bg-gray-200 text-gray-600 font-medium py-2 px-4 rounded-xl hover:bg-gray-300 transition-colors"
              style={{ fontFamily: letterFont }}
            >
              ← 返回
            </button>
          </div>

          {/* 添加新项目 */}
          <div className="bg-white/80 rounded-2xl p-6 border-2 border-pink-200 mb-6">
            <h3 className="text-lg font-bold text-pink-700 mb-4" style={{ fontFamily: letterFont }}>
              添加新打卡项目
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="输入新打卡项目，如：🎵 每天听歌10分钟"
                className="flex-1 px-4 py-3 bg-white/60 border-2 border-pink-200 rounded-2xl text-pink-700 placeholder-pink-300 focus:outline-none focus:border-pink-400 focus:bg-white/80 transition-all duration-300"
                style={{ fontFamily: letterFont }}
              />
              <button
                onClick={handleAddItem}
                className="bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-b-5 border-pink-700 hover:border-pink-800"
                style={{ fontFamily: letterFont }}
              >
                添加
              </button>
            </div>
          </div>

          {/* 项目列表 */}
          <div className="bg-white/80 rounded-2xl p-6 border-2 border-pink-200">
            <h3 className="text-lg font-bold text-pink-700 mb-4" style={{ fontFamily: letterFont }}>
              现有打卡项目
            </h3>
            {defaultItems.length === 0 ? (
              <div className="text-center text-pink-500 py-8" style={{ fontFamily: letterFont }}>
                还没有打卡项目哦～
              </div>
            ) : (
              <div className="space-y-3">
                {defaultItems.map(item => (
                  <div key={item.id} className="bg-pink-50 border-2 border-pink-200 rounded-xl p-4">
                    {editingItem?.id === item.id ? (
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 px-4 py-2 bg-white/60 border-2 border-pink-200 rounded-xl text-pink-700"
                          style={{ fontFamily: letterFont }}
                        />
                        <button
                          onClick={handleSaveEdit}
                          className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
                          style={{ fontFamily: letterFont }}
                        >
                          保存
                        </button>
                        <button
                          onClick={() => { setEditingItem(null); setEditValue(''); }}
                          className="bg-gray-200 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-300"
                          style={{ fontFamily: letterFont }}
                        >
                          取消
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-pink-700" style={{ fontFamily: letterFont }}>
                          {item.text}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="bg-pink-100 text-pink-600 px-3 py-1 rounded-lg hover:bg-pink-200 transition-colors text-sm"
                            style={{ fontFamily: letterFont }}
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors text-sm"
                            style={{ fontFamily: letterFont }}
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDefaultItemsPage;
