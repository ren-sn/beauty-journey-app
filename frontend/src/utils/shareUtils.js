/**
 * 分享功能工具类
 */

/**
 * 生成分享链接（用于分享到微信/QQ等平台）
 */
export const generateShareLink = () => {
  // 获取当前页面URL
  const baseUrl = window.location.origin;
  return baseUrl;
};

/**
 * 复制分享链接到剪贴板
 */
export const copyShareLink = async () => {
  try {
    const shareText = '木纳喵邀请你一起美到不可方物 🌸';
    await navigator.clipboard.writeText(shareText);
    return { success: true, message: '分享文字已复制！' };
  } catch (error) {
    console.error('复制分享文字失败:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 生成分享标题
 */
export const generateShareTitle = () => {
  return '21天变美打卡 - 一起开启美丽之旅！';
};

/**
 * 生成分享描述
 */
export const generateShareDescription = () => {
  return '加入21天变美打卡挑战，每天记录你的美丽之路，与木纳喵一起变美！';
};

/**
 * 打开系统分享对话框（如果支持）
 */
export const shareWithSystem = async (title = generateShareTitle(), description = generateShareDescription()) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text: description,
        url: generateShareLink()
      });
      return { success: true };
    } catch (error) {
      // 用户取消分享或分享失败
      console.error('系统分享失败:', error);
      return { success: false, error: error.message };
    }
  } else {
    // 不支持系统分享，返回false
    return { success: false, error: '不支持系统分享' };
  }
};

/**
 * 分享到微信好友（模拟）
 */
export const shareToWechatFriend = () => {
  // 在实际开发中，这通常需要通过微信SDK来实现
  console.log('分享到微信好友:', generateShareLink());
  return copyShareLink(); // 降级为复制链接
};

/**
 * 分享到微信朋友圈（模拟）
 */
export const shareToWechatMoment = () => {
  // 在实际开发中，这通常需要通过微信SDK来实现
  console.log('分享到微信朋友圈:', generateShareLink());
  return copyShareLink(); // 降级为复制链接
};

/**
 * 分享到QQ好友（模拟）
 */
export const shareToQQFriend = () => {
  console.log('分享到QQ好友:', generateShareLink());
  return copyShareLink(); // 降级为复制链接
};
