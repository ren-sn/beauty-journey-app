import React, { useState, useEffect } from 'react';
import { AlertProvider } from './contexts/AlertContext';
import WelcomePage from './pages/WelcomePage';
import SetupPage from './pages/SetupPage';
import FirstResultPage from './pages/FirstResultPage';
import DailyCheckinPage from './pages/DailyCheckinPage';
import DailyResultPage from './pages/DailyResultPage';
import AdminPage from './pages/AdminPage';
import GroupManagementPage from './pages/GroupManagementPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminDefaultItemsPage from './pages/AdminDefaultItemsPage';
import AdminUserDetailPage from './pages/AdminUserDetailPage';

function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [userData, setUserData] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pendingNickname, setPendingNickname] = useState('');

  useEffect(() => {
    console.log('App: useEffect running, checking localStorage...');

    const savedData = localStorage.getItem('beauty_journey_user_data');
    console.log('App: savedData from localStorage:', savedData);

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('App: Parsed user data:', parsedData);
        setUserData(parsedData);
      } catch (error) {
        console.error('App: Failed to load user data:', error);
        localStorage.removeItem('beauty_journey_user_data');
      }
    } else {
      console.log('App: No user data in localStorage');
    }

    // 加载管理员登录状态
    const savedAdmin = localStorage.getItem('beauty_journey_admin');
    if (savedAdmin) {
      try {
        setAdminData(JSON.parse(savedAdmin));
      } catch (error) {
        console.error('Failed to load admin data:', error);
      }
    }
  }, []);

  // 当 userData 变化时，确保跳转正确
  useEffect(() => {
    console.log('App: userData changed:', userData);
    console.log('App: currentPage:', currentPage);

    if (userData && (currentPage === 'welcome' || currentPage === 'setup')) {
      console.log('App: User data exists, jumping to daily page');
      setCurrentPage('daily');
    }
  }, [userData, currentPage]);

  const handleWelcomeComplete = (nickname) => {
    setPendingNickname(nickname);
    setCurrentPage('setup');
  };

  const handleSetupComplete = async (data) => {
    console.log('handleSetupComplete 被调用:', data);
    try {
      // 先检查 localStorage 中是否有用户数据（可能是本地创建的）
      const usersData = JSON.parse(localStorage.getItem('beauty_journey_users') || '[]');

      // 先尝试调用后端API注册用户
      let userCreated = false;
      let apiResult = null;

      try {
        const response = await fetch('/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nickname: data.nickname,
            startDate: data.startDate,
            checkinItems: data.checkinItems,
          }),
        });

        apiResult = await response.json();
        userCreated = apiResult.success;
      } catch (apiError) {
        console.warn('API注册失败，使用本地存储:', apiError);
      }

      // 保存用户数据到 localStorage（本地使用）
      setUserData(data);
      localStorage.setItem('beauty_journey_user_data', JSON.stringify(data));

      // 添加到用户列表
      const existingIndex = usersData.findIndex(u => u.nickname === data.nickname);
      if (existingIndex >= 0) {
        usersData[existingIndex] = data;
      } else {
        usersData.push(data);
      }
      localStorage.setItem('beauty_journey_users', JSON.stringify(usersData));

      if (userCreated && apiResult) {
        // 如果API成功，保存用户ID和token
        const userDataWithId = { ...data, id: apiResult.user.id };
        setUserData(userDataWithId);
        localStorage.setItem('beauty_journey_user_data', JSON.stringify(userDataWithId));
        localStorage.setItem('beauty_journey_token', apiResult.token);
      }

      // 继续下一步，即使API失败
      setCurrentPage('firstResult');
    } catch (error) {
      console.error('注册失败:', error);
      // 即使失败，也尝试使用本地存储继续
      setUserData(data);
      localStorage.setItem('beauty_journey_user_data', JSON.stringify(data));

      const usersData = JSON.parse(localStorage.getItem('beauty_journey_users') || '[]');
      const existingIndex = usersData.findIndex(u => u.nickname === data.nickname);
      if (existingIndex >= 0) {
        usersData[existingIndex] = data;
      } else {
        usersData.push(data);
      }
      localStorage.setItem('beauty_journey_users', JSON.stringify(usersData));

      setCurrentPage('firstResult');
    }
  };

  const handleFirstResultContinue = () => {
    setCurrentPage('daily');
  };

  // 修复打卡记录更新函数，确保状态同步
  const handleCheckinComplete = (updatedUserData) => {
    console.log('handleCheckinComplete 调用:', {
      receivedData: updatedUserData,
      userDataBeforeUpdate: userData
    });

    if (updatedUserData) {
      setUserData(updatedUserData);
      localStorage.setItem('beauty_journey_user_data', JSON.stringify(updatedUserData));

      // 更新用户列表
      const usersData = JSON.parse(localStorage.getItem('beauty_journey_users') || '[]');
      const existingIndex = usersData.findIndex(u => u.nickname === updatedUserData.nickname);
      if (existingIndex >= 0) {
        usersData[existingIndex] = updatedUserData;
        localStorage.setItem('beauty_journey_users', JSON.stringify(usersData));
      }

      console.log('handleCheckinComplete 完成:', {
        userDataAfterUpdate: updatedUserData,
        checkinHistory: updatedUserData.checkinHistory
      });
    }
    setCurrentPage('result');
  };

  const handleBackToDaily = () => {
    setCurrentPage('daily');
  };

  const handleRestart = () => {
    localStorage.removeItem('beauty_journey_user_data');
    setUserData(null);
    setCurrentPage('welcome');
  };

  const handleAdminComplete = () => {
    setCurrentPage('adminLogin');
  };

  const handleGroupsComplete = () => {
    setCurrentPage('welcome');
  };

  // 用户登录（通过昵称查找并登录）
  const handleLoginUser = async (userFromDB, checkinItems, checkinRecords) => {
    try {
      // 转换数据格式以适配前端 - 特别注意打卡项目的字段名称转换
      const userData = {
        id: userFromDB.id,
        nickname: userFromDB.nickname,
        startDate: userFromDB.startDate,
        checkinItems: checkinItems ? checkinItems.map(item => ({
          text: item.item_text || item.text,
          isCustom: item.is_custom !== undefined ? (item.is_custom === 1 || item.is_custom === true) : item.isCustom
        })) : [],
        checkinHistory: [],
        completedCycles: userFromDB.totalCycles || 0,
        initialText: '',
        initialImage: null
      };

      // 转换打卡记录格式
      if (checkinRecords && checkinRecords.length > 0) {
        userData.checkinHistory = checkinRecords.map(record => {
          let completedItems = [];
          try {
            if (record.completed_items) {
              const parsed = JSON.parse(record.completed_items);
              completedItems = parsed.map(item => ({
                text: item.item_text || item.text,
                isCustom: item.is_custom !== undefined ? (item.is_custom === 1 || item.is_custom === true) : item.isCustom
              }));
            }
          } catch (e) {
            console.error('解析打卡项目失败:', e);
          }
          return {
            date: record.checkin_date,
            completedItems: completedItems,
            text: record.content_text || '',
            image: record.content_image ? `/uploads/${record.content_image}` : null
          };
        });
      }

      console.log('登录用户数据:', userData);

      // 保存用户数据
      setUserData(userData);
      localStorage.setItem('beauty_journey_user_data', JSON.stringify(userData));

      if (userData.checkinItems && userData.checkinItems.length > 0) {
        // 用户已有打卡项目，直接去打卡页
        setCurrentPage('daily');
      } else {
        // 用户需要设置打卡项目
        setPendingNickname(userFromDB.nickname);
        setCurrentPage('setup');
      }
    } catch (error) {
      console.error('登录用户失败:', error);
      alert('登录失败，请重试');
    }
  };

  const handleAdminLogin = (admin) => {
    setAdminData(admin);
    localStorage.setItem('beauty_journey_admin', JSON.stringify(admin));
    setCurrentPage('adminDashboard');
  };

  const handleAdminLogout = () => {
    setAdminData(null);
    localStorage.removeItem('beauty_journey_admin');
    setCurrentPage('welcome');
  };

  const handleAdminBack = () => {
    setCurrentPage('adminDashboard');
  };

  const handleManageDefaultItems = () => {
    setCurrentPage('adminDefaultItems');
  };

  const handleViewUserDetail = (user) => {
    setSelectedUser(user);
    setCurrentPage('adminUserDetail');
  };

  const handleBackFromUserDetail = () => {
    setSelectedUser(null);
    setCurrentPage('adminDashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'welcome':
        return (
          <WelcomePage
            onStart={handleWelcomeComplete}
            onAdmin={() => setCurrentPage('adminLogin')}
            onGroups={handleGroupsComplete}
            onLoginUser={handleLoginUser}
          />
        );
      case 'setup':
        return <SetupPage initialNickname={pendingNickname} onComplete={handleSetupComplete} />;
      case 'firstResult':
        return <FirstResultPage userData={userData} onContinue={handleFirstResultContinue} />;
      case 'daily':
        return (
          <DailyCheckinPage
            userData={userData}
            onCheckinComplete={handleCheckinComplete}
            onRestart={handleRestart}
          />
        );
      case 'result':
        return (
          <DailyResultPage
            userData={userData}
            onBackToDaily={handleBackToDaily}
            onRestart={handleRestart}
          />
        );
      case 'admin':
        return <AdminPage onComplete={handleAdminComplete} />;
      case 'groups':
        return <GroupManagementPage onComplete={handleGroupsComplete} />;
      case 'adminLogin':
        return <AdminLoginPage onLogin={handleAdminLogin} />;
      case 'adminDashboard':
        return (
          <AdminDashboardPage
            adminData={adminData}
            onLogout={handleAdminLogout}
            onViewUserDetail={handleViewUserDetail}
            onManageItems={handleManageDefaultItems}
          />
        );
      case 'adminDefaultItems':
        return <AdminDefaultItemsPage onBack={handleAdminBack} />;
      case 'adminUserDetail':
        return <AdminUserDetailPage userData={selectedUser} onBack={handleBackFromUserDetail} />;
      default:
        return <WelcomePage onStart={handleWelcomeComplete} />;
    }
  };

  return (
    <AlertProvider>
      <div className="min-h-screen">
        {renderPage()}
      </div>
    </AlertProvider>
  );
}

export default App;
