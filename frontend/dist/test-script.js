// === 请在浏览器控制台中执行以下命令来设置测试数据 ===
// 打开浏览器，访问 http://localhost:3001，然后按 F12，选择 "Console" 标签，复制并粘贴以下代码：

const testUserData = {
  id: 7,
  nickname: "测试用户",
  checkinItems: [
    { text: "💧 护肤：白天涂 2 次精华棒", isCustom: false },
    { text: "🌙 作息：11:30 前入睡", isCustom: false },
    { text: "🏃‍♀️ 运动：每周 3 次 + 日步数≥8000", isCustom: false }
  ],
  startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 3天前
  checkinHistory: [
    { // 第一天打卡记录
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 2天前
      completedItems: [
        { text: "💧 护肤：白天涂 2 次精华棒", isCustom: false },
        { text: "🌙 作息：11:30 前入睡", isCustom: false }
      ],
      text: "第一天打卡成功！",
      image: null
    }
    // 第二天没有打卡记录，会显示红色 ❌
  ],
  completedCycles: 0,
  initialText: "我要开始变美之旅！",
  initialImage: null
};

// 设置用户数据到 localStorage 中
localStorage.setItem("beauty_journey_user_data", JSON.stringify(testUserData));
console.log("=== 测试用户数据已设置 ===");
console.log(`用户昵称：${testUserData.nickname}`);
console.log(`开始日期：${testUserData.startDate}`);
console.log(`打卡历史：${testUserData.checkinHistory.length} 条记录`);
console.log("您现在可以看到：");
console.log("• 第一天（2天前）：✅");
console.log("• 第二天（昨天）：❌");
console.log("• 第三天（今天）：等待您打卡！");
console.log("==================================");

// 刷新页面来查看效果
location.reload();
