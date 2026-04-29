import { toPng, toJpeg } from 'html-to-image';

/**
 * 检测是否在微信/抖音环境中
 */
const isWechatOrDouyin = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('micromessenger') || ua.includes('douyin') || ua.includes('aweme');
};

/**
 * 将DOM元素转换为图片并下载
 * @param {HTMLElement} element - 要转换的DOM元素
 * @param {Object} options - 配置选项
 * @param {string} options.filename - 文件名（不含扩展名）
 * @param {string} options.format - 图片格式 ('png' | 'jpeg')
 * @param {number} options.quality - 图片质量 (0-1, 仅jpeg有效)
 * @param {number} options.pixelRatio - 像素比例 (提高清晰度)
 * @param {Object} options.style - 临时应用的样式
 */
export const downloadElementAsImage = async (element, options = {}) => {
  try {
    const {
      filename = 'beauty-journey',
      format = 'png',
      pixelRatio = 2,
    } = options;

    if (!element) {
      throw new Error('请提供要转换的DOM元素');
    }

    // 隐藏原始元素中的按钮
    const buttons = element.querySelectorAll('button');
    const originalButtonStyles = Array.from(buttons).map(button => {
      const original = button.style.display;
      button.style.display = 'none';
      return { button, original };
    });

    let dataUrl;

    try {
      if (format === 'jpeg') {
        dataUrl = await toJpeg(element, {
          pixelRatio,
          cacheBust: true,
          backgroundColor: '#fff',
        });
      } else {
        dataUrl = await toPng(element, {
          pixelRatio,
          cacheBust: true,
          backgroundColor: null,
        });
      }

      // 显示长按保存弹窗
      showImageInPage(dataUrl, filename, format);
    } finally {
      // 恢复按钮样式
      originalButtonStyles.forEach(({ button, original }) => {
        button.style.display = original;
      });
    }

    return {
      success: true,
      dataUrl,
    };
  } catch (error) {
    console.error('图片生成失败:', error);

    // 降级方案：创建一个简单的图片提示
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(254, 243, 248, 0.98);
      z-index: 99999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      background: transparent;
      color: #ec4899;
      border: none;
      font-size: 32px;
      cursor: pointer;
    `;
    closeBtn.onclick = () => document.body.removeChild(overlay);

    const message = document.createElement('div');
    message.textContent = '请使用截图功能保存页面哦～';
    message.style.cssText = `
      color: #be185d;
      font-size: 18px;
      font-family: "KaiTi", "STKaiti", "Ma Shan Zheng", "Ma Shan Zheng Regular", "Noto Sans SC", "ZCOOL QingKe HuangYou", "Hannotate SC", "FangSong", "STFangsong", "Microsoft YaHei", "PingFang SC", "Chalkboard SE", "Comic Sans MS", cursive, sans-serif;
    `;

    overlay.appendChild(closeBtn);
    overlay.appendChild(message);
    document.body.appendChild(overlay);

    return {
      success: false,
      error: error.message || '保存失败，请重试',
    };
  }
};

/**
 * 在当前页面显示图片（微信/抖音降级方案）
 */
const showImageInPage = (dataUrl, filename, format) => {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(254, 243, 248, 0.98);
    z-index: 99999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
  `;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = `
    position: absolute;
    top: 20px;
    right: 20px;
    background: transparent;
    color: #ec4899;
    border: none;
    font-size: 32px;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
    z-index: 10;
  `;
  closeBtn.onmouseenter = () => {
    closeBtn.style.background = 'rgba(236, 72, 153, 0.1)';
  };
  closeBtn.onmouseleave = () => {
    closeBtn.style.background = 'transparent';
  };
  closeBtn.onclick = (e) => {
    e.stopPropagation();
    document.body.removeChild(overlay);
  };

  const title = document.createElement('h1');
  title.textContent = '🌸 保存打卡记录';
  title.style.cssText = `
    color: #ec4899;
    margin-bottom: 15px;
    font-size: 20px;
    font-family: "KaiTi", "STKaiti", "Ma Shan Zheng", "Ma Shan Zheng Regular", "Noto Sans SC", "ZCOOL QingKe HuangYou", "Hannotate SC", "FangSong", "STFangsong", "Microsoft YaHei", "PingFang SC", "Chalkboard SE", "Comic Sans MS", cursive, sans-serif;
  `;

  const tip = document.createElement('p');
  tip.textContent = '长按图片保存到相册';
  tip.style.cssText = `
    color: #be185d;
    margin-bottom: 20px;
    font-size: 16px;
    font-family: "KaiTi", "STKaiti", "Ma Shan Zheng", "Ma Shan Zheng Regular", "Noto Sans SC", "ZCOOL QingKe HuangYou", "Hannotate SC", "FangSong", "STFangsong", "Microsoft YaHei", "PingFang SC", "Chalkboard SE", "Comic Sans MS", cursive, sans-serif;
  `;

  const imgContainer = document.createElement('div');
  imgContainer.style.cssText = `
    background: white;
    border: 2px solid #fbcfe8;
    border-radius: 20px;
    padding: 10px;
    box-shadow: 0 20px 40px -15px rgba(236,72,153,0.2);
    margin-bottom: 20px;
    -webkit-touch-callout: default;
    -webkit-user-select: auto;
  `;

  const img = document.createElement('img');
  img.src = dataUrl;
  img.alt = '打卡记录';
  img.draggable = true;
  img.style.cssText = `
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    display: block;
    -webkit-touch-callout: default;
    -webkit-user-select: auto;
    user-select: auto;
    pointer-events: auto;
    touch-action: auto;
  `;
  img.ondragstart = (e) => {
    // 允许拖拽保存
    e.dataTransfer.setData('text/uri-list', dataUrl);
    e.dataTransfer.setData('text/html', `<img src="${dataUrl}" />`);
    e.dataTransfer.setData('DownloadURL', `image/${format};name=${filename}.${format};${dataUrl}`);
  };
  img.onclick = (e) => {
    // 防止点击图片关闭弹窗
    e.stopPropagation();
  };
  imgContainer.appendChild(img);

  const tip2 = document.createElement('div');
  tip2.textContent = '💡 长按图片保存到相册，或点击图片查看大图';
  tip2.style.cssText = `
    background: rgba(255,241,248,0.9);
    padding: 16px 20px;
    border-radius: 16px;
    font-size: 14px;
    color: #be185d;
    border: 1px solid #fbcfe8;
    font-family: "KaiTi", "STKaiti", "Ma Shan Zheng", "Ma Shan Zheng Regular", "Noto Sans SC", "ZCOOL QingKe HuangYou", "Hannotate SC", "FangSong", "STFangsong", "Microsoft YaHei", "PingFang SC", "Chalkboard SE", "Comic Sans MS", cursive, sans-serif;
    text-align: center;
  `;

  overlay.appendChild(closeBtn);
  overlay.appendChild(title);
  overlay.appendChild(tip);
  overlay.appendChild(imgContainer);
  overlay.appendChild(tip2);

  // 点击背景关闭，但图片区域除外
  overlay.onclick = (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  };

  document.body.appendChild(overlay);
};

/**
 * 将DOM元素转换为图片，仅返回数据URL
 * @param {HTMLElement} element - 要转换的DOM元素
 * @param {Object} options - 配置选项
 */
export const elementToDataUrl = async (element, options = {}) => {
  try {
    const {
      format = 'png',
      quality = 0.95,
      pixelRatio = 2,
    } = options;

    if (!element) {
      throw new Error('请提供要转换的DOM元素');
    }

    let dataUrl;

    if (format === 'jpeg') {
      dataUrl = await toJpeg(element, {
        quality,
        pixelRatio,
        cacheBust: true,
        backgroundColor: '#fff',
      });
    } else {
      dataUrl = await toPng(element, {
        pixelRatio,
        cacheBust: true,
      });
    }

    return {
      success: true,
      dataUrl,
    };
  } catch (error) {
    console.error('图片生成失败:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 复制图片到剪贴板
 * @param {HTMLElement} element - 要转换的DOM元素
 */
export const copyImageToClipboard = async (element) => {
  try {
    const result = await elementToDataUrl(element);
    if (!result.success) {
      throw new Error(result.error);
    }

    // 将dataURL转换为blob
    const response = await fetch(result.dataUrl);
    const blob = await response.blob();

    // 复制到剪贴板
    if (navigator.clipboard && navigator.clipboard.write) {
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      return { success: true };
    } else {
      // 降级方案
      const textarea = document.createElement('textarea');
      textarea.value = result.dataUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return { success: true };
    }
  } catch (error) {
    console.error('复制图片失败:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
