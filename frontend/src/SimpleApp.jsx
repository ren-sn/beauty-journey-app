import React, { useState } from 'react';
import './index.css';

function SimpleApp() {
  const [page, setPage] = useState('home');

  if (page === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-100 flex items-center justify-center p-4">
        <div className="checkin-card pink-shadow max-w-md w-full p-8 text-center">
          <h1 className="text-3xl font-bold text-pink-500 mb-6">
            🌸 21天变美打卡 🌸
          </h1>
          <p className="text-pink-700 mb-8 text-lg">
            恭喜你成功启动了！
          </p>
          <button
            onClick={() => setPage('setup')}
            className="w-full bg-gradient-to-r from-pink-400 via-pink-500 to-purple-500 text-white font-bold py-4 px-8 rounded-3xl text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 pink-glow"
          >
            🌸 一起美到不可方物
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-purple-100 flex items-center justify-center p-4">
      <div className="checkin-card pink-shadow max-w-md w-full p-8 text-center">
        <h2 className="text-2xl font-bold text-pink-500 mb-6">
          ✨ 设置页面 ✨
        </h2>
        <p className="text-pink-700 mb-8 text-lg">
          完美！点击功能工作正常！
        </p>
        <button
          onClick={() => setPage('home')}
          className="w-full bg-gradient-to-r from-purple-400 to-purple-500 text-white font-bold py-4 px-8 rounded-3xl text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          回到首页
        </button>
      </div>
    </div>
  );
}

export default SimpleApp;
