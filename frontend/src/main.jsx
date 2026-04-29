import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('✅ main.jsx 开始加载');

// 清除可能损坏的localStorage数据
try {
  const userData = localStorage.getItem('beauty_journey_user_data');
  if (userData) {
    try {
      JSON.parse(userData);
      console.log('✅ localStorage数据正常');
    } catch (e) {
      console.warn('⚠️ localStorage数据损坏，已清除');
      localStorage.removeItem('beauty_journey_user_data');
    }
  }
} catch (e) {
  console.error('❌ localStorage错误');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
console.log('✅ React应用已渲染');
