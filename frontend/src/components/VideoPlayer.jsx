import React, { useState, useRef, useEffect } from 'react';

const letterFont = '"KaiTi", "STKaiti", "Ma Shan Zheng", "Ma Shan Zheng Regular", "Noto Sans SC", "ZCOOL QingKe HuangYou", "Hannotate SC", "FangSong", "STFangsong", "Microsoft YaHei", "PingFang SC", "Chalkboard SE", "Comic Sans MS", cursive, sans-serif';

function VideoPlayer({ src, onEnded, poster, startTime = 0, endTime = null }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayFailed, setAutoPlayFailed] = useState(false);
  const [isWechat, setIsWechat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setIsWechat(ua.includes('micromessenger'));

    // 尝试自动播放
    const video = videoRef.current;
    if (video) {
      // 先设置为静音，这样在微信和大多数浏览器中可以自动播放
      video.muted = true;
      video.playsInline = true;
      video.webkitPlaysInline = true;

      video.play().then(() => {
        console.log('视频自动播放成功');
        setIsPlaying(true);
      }).catch(error => {
        console.log('视频自动播放失败，显示播放按钮', error);
        setAutoPlayFailed(true);
      });
    }
  }, []);

  // 视频加载事件
  const handleVideoLoaded = () => {
    setIsLoading(false);
    if (videoRef.current && startTime > 0) {
      videoRef.current.currentTime = startTime;
    }
  };

  // 视频加载错误
  const handleVideoError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setAutoPlayFailed(false);
    try {
      const video = videoRef.current;
      if (video) {
        video.muted = false;
        video.play().catch(error => {
          console.log('视频播放失败，尝试静音播放', error);
          video.muted = true;
          video.play().catch(e => {
            console.log('视频播放错误', e);
          });
        });
      }
    } catch (error) {
      console.log('视频播放错误', error);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    onEnded?.();
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
    setAutoPlayFailed(false);
  };

  const handleVideoPlaying = () => {
    setIsPlaying(true);
    setAutoPlayFailed(false);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        handlePlay();
      } else {
        video.pause();
      }
    }
  };

  // 如果是GIF，直接显示图片并自动循环
  const isGif = src && src.toLowerCase().endsWith('.gif');

  if (isGif) {
    return (
      <div className="relative w-full" onClick={handleVideoEnded}>
        <img
          src={src}
          alt="庆祝动画"
          className="w-full rounded-3xl"
          style={{ objectFit: 'cover' }}
          onLoad={() => setIsPlaying(true)}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl overflow-hidden">
      {/* 加载状态 */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-pink-700 text-sm" style={{ fontFamily: letterFont }}>
              木纳喵在来找你的路上咯
            </p>
          </div>
        </div>
      )}

      {/* 错误状态 */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-pink-50 z-10">
          <div className="flex flex-col items-center p-6 text-center">
            <div className="text-4xl mb-3">😿</div>
            <p className="text-pink-700 text-sm" style={{ fontFamily: letterFont }}>
              加载失败，请重试
            </p>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        src={src}
        playsInline
        webkit-playsinline="true"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="false"
        x5-playsinline="true"
        preload="metadata"
        loop={!endTime}
        muted
        autoplay
        className="w-full"
        onEnded={handleVideoEnded}
        onPlay={handleVideoPlay}
        onPlaying={handleVideoPlaying}
        onPause={handleVideoPause}
        onClick={handleVideoClick}
        onLoadedData={handleVideoLoaded}
        onCanPlay={handleVideoLoaded}
        onError={handleVideoError}
        onTimeUpdate={() => {
          if (endTime && videoRef.current && videoRef.current.currentTime >= endTime) {
            videoRef.current.pause();
            videoRef.current.currentTime = startTime;
            handleVideoEnded();
          }
        }}
        controls={false}
        style={{
          objectFit: 'cover',
          display: 'block',
          background: 'transparent'
        }}
      />

      {!isPlaying && autoPlayFailed && !isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          onClick={handlePlay}
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-pink-500/90 rounded-full flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
            <p className="text-white text-sm" style={{ fontFamily: letterFont }}>
              点击播放视频 🌸
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
