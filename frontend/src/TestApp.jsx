import React from 'react';

function TestApp() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFF5F5 0%, #FFE7F0 50%, #F3E8FF 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      color: '#EB218B',
      fontFamily: '"Comic Sans MS", "Marker Felt", "Segoe Script", cursive'
    }}>
      <div>
        <h1>🌸 21天变美打卡 🌸</h1>
        <p>页面正常显示！</p>
        <p style={{ fontSize: '14px', marginTop: '20px' }}>
          如果您能看到这个页面，说明React正常工作，问题在于其他组件。
        </p>
      </div>
    </div>
  );
}

export default TestApp;
