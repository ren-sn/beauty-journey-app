import React, { useState } from 'react';

const letterFont = '"KaiTi", "STKaiti", "Ma Shan Zheng", "Ma Shan Zheng Regular", "Noto Sans SC", "ZCOOL QingKe HuangYou", "Hannotate SC", "FangSong", "STFangsong", "Microsoft YaHei", "PingFang SC", "Chalkboard SE", "Comic Sans MS", cursive, sans-serif';

function OptimizedImage({ src, alt, className = '', style = {}, objectFit = 'cover' }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`relative ${className}`} style={style}>
      {/* 加载状态 */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-pink-50 to-purple-50 z-10">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-pink-600 text-xs" style={{ fontFamily: letterFont }}>
              木纳喵在来找你的路上咯
            </p>
          </div>
        </div>
      )}

      {/* 错误状态 */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-pink-50 z-10">
          <div className="flex flex-col items-center p-4 text-center">
            <div className="text-3xl mb-2">😿</div>
            <p className="text-pink-700 text-xs" style={{ fontFamily: letterFont }}>
              加载失败
            </p>
          </div>
        </div>
      )}

      <img
        src={src}
        alt={alt}
        className="w-full h-full"
        style={{
          objectFit,
          display: isLoading && !hasError ? 'none' : 'block',
          transition: 'opacity 0.3s ease',
          opacity: isLoading ? 0 : 1
        }}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export default OptimizedImage;