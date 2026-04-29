/**
 * 微信相关工具
 */

/**
 * 检测是否在微信环境中
 */
export const isWechat = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('micromessenger');
};

/**
 * 检测是否在抖音环境中
 */
export const isDouyin = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('douyin') || ua.includes('aweme');
};

/**
 * 检测是否在移动设备上
 */
export const isMobile = () => {
  const ua = navigator.userAgent.toLowerCase();
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
};

/**
 * 获取浏览器引擎
 */
export const getBrowserEngine = () => {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('webkit')) {
    return 'webkit';
  }
  if (ua.includes('gecko')) {
    return 'gecko';
  }
  if (ua.includes('trident')) {
    return 'trident';
  }
  if (ua.includes('presto')) {
    return 'presto';
  }
  return 'unknown';
};

/**
 * 是否支持 CSS 动画
 */
export const supportsCssAnimations = () => {
  return 'animation' in document.documentElement.style ||
         'WebkitAnimation' in document.documentElement.style;
};

/**
 * 是否支持 CSS 变换
 */
export const supportsCssTransforms = () => {
  return 'transform' in document.documentElement.style ||
         'WebkitTransform' in document.documentElement.style;
};

/**
 * 为微信环境优化的 CSS 属性
 */
export const wechatOptimizedCss = (css) => {
  // 添加 webkit 前缀
  return css
    .replace(/animation:/g, '-webkit-animation:')
    .replace(/transform:/g, '-webkit-transform:')
    .replace(/@keyframes/g, '@-webkit-keyframes')
    .replace(/translate\(/g, '-webkit-translate(')
    .replace(/rotate\(/g, '-webkit-rotate(');
};
