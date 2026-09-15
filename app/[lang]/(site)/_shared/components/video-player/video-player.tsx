'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  TbPlayerPlayFilled,
  TbPlayerPauseFilled,
  TbVolume,
  TbVolume2,
  TbVolumeOff,
  TbMaximize,
  TbMinimize,
  TbRotateClockwise,
  TbRewindBackward10,
  TbRewindForward10,
  TbPictureInPicture,
  TbGauge,
  TbBadgeHd,
  TbCheck,
} from 'react-icons/tb';

export interface VideoQualityOption {
  label: string;
  src?: string;
  badge?: string;
}

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  qualities?: VideoQualityOption[];
  defaultQuality?: string;
  objectFit?: 'contain' | 'cover';
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  className?: string;
  videoClassName?: string;
  lang?: 'en' | 'ar';
  title?: string;
  onEnded?: () => void;
}

interface ResolutionInfo {
  label: string;
  badge?: string;
  shortLabel: string;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function VideoPlayer({
  src,
  poster,
  qualities,
  defaultQuality,
  objectFit = 'contain',
  autoPlay = false,
  muted = false,
  loop = false,
  playsInline = true,
  className = '',
  videoClassName = '',
  lang = 'en',
  title,
  onEnded,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Native resolution detected dynamically from stream metadata
  const [nativeRes, setNativeRes] = useState<ResolutionInfo>({
    label: '1080p Full HD',
    badge: 'HD',
    shortLabel: 'HD',
  });

  // Only display multiple options if the caller actually provided multiple streams
  const hasMultipleQualities = Boolean(qualities && qualities.length > 1);

  const availableQualities: VideoQualityOption[] = hasMultipleQualities
    ? (qualities as VideoQualityOption[])
    : [
        {
          label: nativeRes.label,
          badge: nativeRes.badge,
          src: src,
        },
      ];

  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [selectedQuality, setSelectedQuality] = useState<string>(
    defaultQuality || (hasMultipleQualities ? qualities![0].label : nativeRes.label)
  );
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  // Measured container width for responsive adaptation
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(muted ? 0 : 1);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isDraggingTimeline, setIsDraggingTimeline] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const [centerAction, setCenterAction] = useState<'play' | 'pause' | null>(null);
  const [isEnded, setIsEnded] = useState(false);
  const [pipSupported, setPipSupported] = useState(false);

  const isRtl = lang === 'ar';

  // Responsive breakpoints based on actual container width
  const isVeryCompact = containerWidth > 0 ? containerWidth < 380 : true;
  const isCompact = containerWidth > 0 ? containerWidth < 490 : true;
  const isWide = containerWidth >= 490;

  // Keep currentSrc updated if src prop changes
  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  // Measure container width dynamically via ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => {
      if (container) {
        setContainerWidth(container.clientWidth || container.getBoundingClientRect().width);
      }
    };

    updateWidth();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect) {
            setContainerWidth(entry.contentRect.width);
          }
        }
      });
      observer.observe(container);
      return () => observer.disconnect();
    } else {
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }
  }, []);

  // Global click outside listener to close popups
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSpeedMenu(false);
        setShowQualityMenu(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check Picture-in-Picture capability
  useEffect(() => {
    if (typeof document !== 'undefined' && 'pictureInPictureEnabled' in document) {
      setPipSupported(Boolean(document.pictureInPictureEnabled));
    }
  }, []);

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentFs = document.fullscreenElement === containerRef.current;
      setIsFullscreen(isCurrentFs);
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Auto-hide controls after inactivity while playing (paused when menus are open)
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    if (isPlaying && !isDraggingTimeline && !showSpeedMenu && !showQualityMenu) {
      hideControlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  }, [isPlaying, isDraggingTimeline, showSpeedMenu, showQualityMenu]);

  const handleMouseMove = () => {
    resetHideTimer();
  };

  const handleMouseLeave = () => {
    if (isPlaying && !isDraggingTimeline && !showSpeedMenu && !showQualityMenu) {
      setShowControls(false);
    }
  };

  // Playback control
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isEnded) {
      video.currentTime = 0;
      setIsEnded(false);
    }

    if (video.paused) {
      video
        .play()
        .then(() => {
          setIsPlaying(true);
          setCenterAction('play');
          setTimeout(() => setCenterAction(null), 600);
        })
        .catch(() => {
          video.muted = true;
          setIsMuted(true);
          video.play().then(() => setIsPlaying(true));
        });
    } else {
      video.pause();
      setIsPlaying(false);
      setCenterAction('pause');
      setTimeout(() => setCenterAction(null), 600);
    }
    resetHideTimer();
  }, [isEnded, resetHideTimer]);

  // Fast forward / Rewind
  const seekRelative = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(Math.max(0, video.currentTime + seconds), video.duration || 0);
    resetHideTimer();
  }, [resetHideTimer]);

  // Volume & Mute
  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;
    const clamped = Math.max(0, Math.min(1, newVolume));
    video.volume = clamped;
    setVolume(clamped);
    if (clamped === 0) {
      video.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      video.muted = false;
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isMuted || volume === 0) {
      const restored = volume === 0 ? 0.8 : volume;
      video.muted = false;
      video.volume = restored;
      setIsMuted(false);
      setVolume(restored);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  // Fullscreen
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {});
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  };

  // Picture in Picture
  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await video.requestPictureInPicture();
      }
    } catch (e) {
      console.warn('PiP error', e);
    }
  };

  // Playback speed
  const handleSpeedSelect = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);
    resetHideTimer();
  };

  // Quality selector
  const handleQualitySelect = (quality: VideoQualityOption) => {
    setSelectedQuality(quality.label);
    setShowQualityMenu(false);

    if (quality.src && quality.src !== currentSrc && videoRef.current) {
      const video = videoRef.current;
      const prevTime = video.currentTime;
      const wasPlaying = !video.paused;
      setCurrentSrc(quality.src);

      const onLoaded = () => {
        if (videoRef.current) {
          videoRef.current.currentTime = prevTime;
          if (wasPlaying) {
            videoRef.current.play().catch(() => {});
          }
          videoRef.current.removeEventListener('loadedmetadata', onLoaded);
        }
      };
      videoRef.current.addEventListener('loadedmetadata', onLoaded);
    }
    resetHideTimer();
  };

  // Timeline Scrubbing
  const updateScrubPosition = (e: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
    const timeline = timelineRef.current;
    const video = videoRef.current;
    if (!timeline || !video || !video.duration) return;

    const rect = timeline.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    video.currentTime = pos * video.duration;
    setCurrentTime(video.currentTime);
  };

  const handleTimelinePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDraggingTimeline(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateScrubPosition(e);
  };

  const handleTimelinePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const timeline = timelineRef.current;
    const video = videoRef.current;
    if (timeline && video && video.duration) {
      const rect = timeline.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setHoverPosition(pos * 100);
      setHoverTime(pos * video.duration);
    }
    if (isDraggingTimeline) {
      updateScrubPosition(e);
    }
  };

  const handleTimelinePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingTimeline) {
      setIsDraggingTimeline(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
    resetHideTimer();
  };

  const handleTimelineMouseLeave = () => {
    if (!isDraggingTimeline) {
      setHoverTime(null);
    }
  };

  // Video event handlers
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || isDraggingTimeline) return;
    setCurrentTime(video.currentTime);

    if (video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const duration = video.duration || 1;
      setBuffered((bufferedEnd / duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration || 0);

    const w = video.videoWidth || 0;
    const h = video.videoHeight || 0;

    let label = '1080p Full HD';
    let badge: string | undefined = 'HD';
    let shortLabel = '1080p';

    if (h >= 2160 || w >= 3840) {
      label = '4K Ultra HD';
      badge = '4K';
      shortLabel = '4K';
    } else if (h >= 1080 || w >= 1920) {
      label = '1080p Full HD';
      badge = 'HD';
      shortLabel = '1080p';
    } else if (h >= 720 || w >= 1280 || (w === 384 && h === 832) || h >= 700) {
      label = (w === 384 && h === 832) ? '832p HD (Mobile)' : '720p HD';
      badge = 'HD';
      shortLabel = (w === 384 && h === 832) ? '832p' : '720p';
    } else if (h >= 480) {
      label = '480p SD';
      badge = undefined;
      shortLabel = '480p';
    } else if (h > 0) {
      label = `${h}p SD`;
      badge = undefined;
      shortLabel = `${h}p`;
    }

    setNativeRes({ label, badge, shortLabel });
    if (!hasMultipleQualities) {
      setSelectedQuality(label);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setIsEnded(true);
    setShowControls(true);
    onEnded?.();
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case ' ':
      case 'k':
      case 'K':
        e.preventDefault();
        togglePlay();
        break;
      case 'm':
      case 'M':
        e.preventDefault();
        toggleMute();
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'Escape':
        setShowSpeedMenu(false);
        setShowQualityMenu(false);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        seekRelative(isRtl ? 5 : -5);
        break;
      case 'ArrowRight':
        e.preventDefault();
        seekRelative(isRtl ? -5 : 5);
        break;
      case 'ArrowUp':
        e.preventDefault();
        handleVolumeChange(volume + 0.1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        handleVolumeChange(volume - 0.1);
        break;
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={title || 'Video Player'}
      className={`group/player relative w-full h-full max-w-full overflow-hidden bg-black flex items-center justify-center select-none focus:outline-hidden ${
        !showControls && isPlaying ? 'cursor-none' : 'cursor-default'
      } ${className}`}
    >
      {/* Video element - strictly full height uncropped when objectFit="contain" */}
      <video
        ref={videoRef}
        src={currentSrc}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleVideoEnded}
        onClick={() => {
          setShowSpeedMenu(false);
          setShowQualityMenu(false);
          togglePlay();
        }}
        onDoubleClick={toggleFullscreen}
        className={`w-full h-full max-h-full ${
          objectFit === 'contain' ? 'object-contain' : 'object-cover'
        } ${videoClassName}`}
      />

      {/* Momentary Click-to-Play Pulse Animation */}
      {centerAction && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-15">
          <div className="h-14 w-14 sm:h-18 sm:w-18 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center animate-ping">
            {centerAction === 'play' ? (
              <TbPlayerPlayFilled className="h-7 w-7 text-white ps-0.5" />
            ) : (
              <TbPlayerPauseFilled className="h-7 w-7 text-white" />
            )}
          </div>
        </div>
      )}

      {/* Large Center Hero Play / Replay Button when paused or ended */}
      {(!isPlaying || isEnded) && (
        <div
          onClick={() => {
            setShowSpeedMenu(false);
            setShowQualityMenu(false);
            togglePlay();
          }}
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-all cursor-pointer"
        >
          <button
            type="button"
            aria-label={isEnded ? 'Replay' : isPlaying ? 'Pause' : 'Play'}
            className={`group/center-btn relative flex ${
              isVeryCompact ? 'h-13 w-13' : 'h-16 w-16 sm:h-20 sm:w-20'
            } items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-persici-crimson hover:border-persici-crimson`}
          >
            {isEnded ? (
              <TbRotateClockwise className={`${isVeryCompact ? 'h-6 w-6' : 'h-8 w-8'} transition-transform group-hover/center-btn:rotate-45`} />
            ) : (
              <TbPlayerPlayFilled className={`${isVeryCompact ? 'h-6 w-6 ps-0.5' : 'h-8 w-8 ps-1'} text-white transition-transform group-hover/center-btn:scale-110`} />
            )}
            <span className="absolute -inset-1 rounded-full border border-white/20 animate-pulse pointer-events-none" />
          </button>
        </div>
      )}

      {/* Optional Top Overlay Title Bar */}
      {title && (
        <div
          className={`absolute top-0 inset-x-0 z-20 ${
            isVeryCompact ? 'p-2' : 'p-3.5 sm:p-5'
          } bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-300 pointer-events-none ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-white font-medium text-xs sm:text-base tracking-wide drop-shadow-md truncate">
            {title}
          </p>
        </div>
      )}

      {/* Smart Glassmorphic Bottom Control Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 z-20 w-full max-w-full box-border ${
          isVeryCompact ? 'p-1.5' : isCompact ? 'p-2.5' : 'p-3 sm:p-4'
        } bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-all duration-300 ${
          showControls || !isPlaying || showSpeedMenu || showQualityMenu
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Inner Card without overflow-hidden so popups can float above freely */}
        <div
          className={`relative mx-auto w-full max-w-full flex flex-col ${
            isVeryCompact
              ? 'gap-1.5 px-2 py-1.5 rounded-xl'
              : isCompact
              ? 'gap-2 px-2.5 py-2 rounded-xl'
              : 'gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl'
          } bg-black/75 backdrop-blur-md border border-white/15 shadow-2xl box-border`}
        >
          {/* Interactive Timeline Progress Bar */}
          <div
            ref={timelineRef}
            onPointerDown={handleTimelinePointerDown}
            onPointerMove={handleTimelinePointerMove}
            onPointerUp={handleTimelinePointerUp}
            onMouseLeave={handleTimelineMouseLeave}
            className={`group/timeline relative flex items-center ${
              isVeryCompact ? 'h-3' : 'h-4'
            } w-full cursor-pointer touch-none select-none`}
          >
            {/* Background Rail */}
            <div className="relative w-full h-1 group-hover/timeline:h-1.5 sm:h-1.5 sm:group-hover/timeline:h-2 rounded-full bg-white/20 overflow-hidden transition-all duration-200">
              {/* Buffered Progress */}
              <div
                className="absolute top-0 h-full rounded-full bg-white/30 transition-all duration-300"
                style={{
                  left: isRtl ? 'auto' : 0,
                  right: isRtl ? 0 : 'auto',
                  width: `${buffered}%`,
                }}
              />
              {/* Played Progress Bar */}
              <div
                className="absolute top-0 h-full rounded-full bg-persici-crimson"
                style={{
                  left: isRtl ? 'auto' : 0,
                  right: isRtl ? 0 : 'auto',
                  width: `${progressPercent}%`,
                }}
              />
            </div>

            {/* Scrubber Thumb */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 ${
                isVeryCompact ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5'
              } rounded-full bg-white shadow-md border-2 border-persici-crimson scale-0 group-hover/timeline:scale-100 transition-transform duration-150 pointer-events-none`}
              style={{
                left: isRtl ? `${100 - progressPercent}%` : `${progressPercent}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />

            {/* Hover Tooltip Timestamp */}
            {hoverTime !== null && (
              <div
                className="absolute bottom-5 sm:bottom-6 -translate-x-1/2 rounded-md bg-black/90 border border-white/20 px-1.5 py-0.5 text-[9.5px] sm:text-[9.5px] font-mono text-white pointer-events-none shadow-md whitespace-nowrap"
                style={{ left: `${Math.max(12, Math.min(88, hoverPosition))}%` }}
              >
                {formatTime(hoverTime)}
              </div>
            )}
          </div>

          {/* Lower Controls Row */}
          <div className="flex items-center justify-between gap-1 w-full max-w-full text-white min-w-0">
            {/* Left Controls: Play, [10s Skip], Volume, Time */}
            <div className="flex items-center gap-1 sm:gap-2 min-w-0 shrink">
              {/* Play / Pause Toggle */}
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className={`flex ${
                  isVeryCompact ? 'h-7 w-7' : 'h-8 w-8'
                } shrink-0 items-center justify-center rounded-lg hover:bg-white/15 text-white transition-colors cursor-pointer`}
              >
                {isPlaying ? (
                  <TbPlayerPauseFilled className={isVeryCompact ? 'h-3.5 w-3.5' : 'h-4 w-4 sm:h-5 sm:w-5'} />
                ) : (
                  <TbPlayerPlayFilled className={`${isVeryCompact ? 'h-3.5 w-3.5' : 'h-4 w-4 sm:h-5 sm:w-5'} ps-0.5`} />
                )}
              </button>

              {/* 10s Rewind (Shown on container width >= 380px) */}
              {!isVeryCompact && (
                <button
                  type="button"
                  onClick={() => seekRelative(-10)}
                  aria-label="Rewind 10 seconds"
                  className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                  title="Rewind 10s"
                >
                  <TbRewindBackward10 className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </button>
              )}

              {/* 10s Forward (Shown on container width >= 380px) */}
              {!isVeryCompact && (
                <button
                  type="button"
                  onClick={() => seekRelative(10)}
                  aria-label="Forward 10 seconds"
                  className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                  title="Forward 10s"
                >
                  <TbRewindForward10 className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </button>
              )}

              {/* Volume Button & Expandable Slider */}
              <div className="group/volume relative flex items-center shrink-0">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  className={`flex ${
                    isVeryCompact ? 'h-7 w-7' : 'h-8 w-8'
                  } items-center justify-center rounded-lg hover:bg-white/15 text-white transition-colors cursor-pointer`}
                >
                  {isMuted || volume === 0 ? (
                    <TbVolumeOff className={`${isVeryCompact ? 'h-3.5 w-3.5' : 'h-4 w-4 sm:h-5 sm:w-5'} text-red-400`} />
                  ) : volume < 0.5 ? (
                    <TbVolume2 className={isVeryCompact ? 'h-3.5 w-3.5' : 'h-4 w-4 sm:h-5 sm:w-5'} />
                  ) : (
                    <TbVolume className={isVeryCompact ? 'h-3.5 w-3.5' : 'h-4 w-4 sm:h-5 sm:w-5'} />
                  )}
                </button>

                {/* Sliding Volume Bar (Only on wide viewports) */}
                {isWide && (
                  <div className="w-0 overflow-hidden group-hover/volume:w-16 sm:group-hover/volume:w-20 transition-all duration-300 flex items-center pe-1">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      aria-label="Volume slider"
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/30 accent-persici-crimson"
                    />
                  </div>
                )}
              </div>

              {/* Time Display */}
              <div
                className={`${
                  isVeryCompact ? 'text-[9.5px] tracking-tight' : 'text-[9.5px] sm:text-xs'
                } font-mono text-white/80 select-none shrink-0 tabular-nums`}
              >
                <span>{formatTime(currentTime)}</span>
                <span className="mx-0.5 text-white/40">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right Controls: Quality, Speed, [PiP], Fullscreen */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Quality Controller */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowQualityMenu((prev) => !prev);
                    setShowSpeedMenu(false);
                  }}
                  aria-label="Video Quality"
                  className={`flex ${
                    isVeryCompact ? 'h-7 px-1.5 text-[9.5px]' : 'h-8 px-2 text-xs'
                  } items-center gap-0.5 sm:gap-1 rounded-lg font-mono font-semibold hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer`}
                  title={`Quality: ${selectedQuality}`}
                >
                  <TbBadgeHd className={isVeryCompact ? 'h-3.5 w-3.5 text-persici-crimson' : 'h-4 w-4 text-persici-crimson'} />
                  <span className="hidden min-[330px]:inline">
                    {isVeryCompact
                      ? (nativeRes.badge || nativeRes.shortLabel)
                      : (hasMultipleQualities ? selectedQuality.split(' ')[0] : nativeRes.shortLabel)}
                  </span>
                </button>

                {/* Quality Popover Menu - Floats cleanly above control bar */}
                {showQualityMenu && (
                  <div className="absolute bottom-full mb-2.5 end-0 z-50 flex flex-col rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/20 p-2 shadow-2xl min-w-[130px] sm:min-w-[160px]">
                    <div className="flex items-center justify-between pb-1.5 px-1 text-[9.5px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/10 mb-1">
                      <span>{isRtl ? 'جودة الفيديو' : 'Quality'}</span>
                      <span className="text-slate-500 font-normal">
                        {availableQualities.length > 1
                          ? `${availableQualities.length} ${isRtl ? 'خيارات' : 'options'}`
                          : (isRtl ? 'أصلي' : 'Original')}
                      </span>
                    </div>

                    {availableQualities.map((qual) => {
                      const isSelected = selectedQuality === qual.label;
                      return (
                        <button
                          key={qual.label}
                          type="button"
                          onClick={() => handleQualitySelect(qual)}
                          className={`flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-[9.5px] font-mono text-start hover:bg-white/15 transition-colors cursor-pointer ${
                            isSelected ? 'text-persici-crimson font-semibold bg-white/5' : 'text-white/80'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span>{qual.label}</span>
                            {qual.badge && (
                              <span className="rounded bg-persici-crimson/20 border border-persici-crimson/40 px-1 py-0.2 text-[8.5px] font-semibold text-persici-crimson">
                                {qual.badge}
                              </span>
                            )}
                          </div>
                          {isSelected && <TbCheck className="h-3.5 w-3.5 text-persici-crimson shrink-0" />}
                        </button>
                      );
                    })}

                    {availableQualities.length === 1 && (
                      <div className="pt-1.5 px-1 text-[9.5px] text-slate-400/90 font-sans leading-tight border-t border-white/10 mt-1">
                        {isRtl
                          ? 'أعلى جودة أصلية متاحة لهذا الفيديو'
                          : 'Highest native source quality for this video'}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Playback Speed Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowSpeedMenu((prev) => !prev);
                    setShowQualityMenu(false);
                  }}
                  aria-label="Playback speed"
                  className={`flex ${
                    isVeryCompact ? 'h-7 px-1.5 text-[9.5px]' : 'h-8 px-2 text-xs'
                  } items-center gap-0.5 sm:gap-1 rounded-lg font-mono font-semibold hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer`}
                  title="Playback Speed"
                >
                  {isWide && <TbGauge className="h-3.5 w-3.5" />}
                  <span>{playbackSpeed}x</span>
                </button>

                {/* Speed Popover Menu - Floats cleanly above control bar */}
                {showSpeedMenu && (
                  <div className="absolute bottom-full mb-2.5 end-0 z-50 flex flex-col rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/20 p-1.5 shadow-2xl min-w-[90px] sm:min-w-[110px]">
                    <div className="px-2 py-1 text-[9.5px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/10 mb-1">
                      {isRtl ? 'سرعة التشغيل' : 'Speed'}
                    </div>
                    {SPEED_OPTIONS.map((speed) => {
                      const isSelected = playbackSpeed === speed;
                      return (
                        <button
                          key={speed}
                          type="button"
                          onClick={() => handleSpeedSelect(speed)}
                          className={`flex items-center justify-between rounded-lg px-2 py-1 text-[9.5px] font-mono text-start hover:bg-white/15 transition-colors cursor-pointer ${
                            isSelected ? 'text-persici-crimson font-semibold' : 'text-white/80'
                          }`}
                        >
                          <span>{speed === 1 ? (isRtl ? 'عادي (1x)' : '1x (Normal)') : `${speed}x`}</span>
                          {isSelected && <TbCheck className="h-3.5 w-3.5 text-persici-crimson" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Picture in Picture (Shown only when PiP is supported AND container is wide enough) */}
              {pipSupported && isWide && (
                <button
                  type="button"
                  onClick={togglePiP}
                  aria-label="Picture-in-Picture"
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                  title="Picture-in-Picture"
                >
                  <TbPictureInPicture className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </button>
              )}

              {/* Fullscreen Toggle */}
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                className={`flex ${
                  isVeryCompact ? 'h-7 w-7' : 'h-8 w-8'
                } items-center justify-center rounded-lg hover:bg-white/15 text-white transition-colors cursor-pointer`}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? (
                  <TbMinimize className={isVeryCompact ? 'h-3.5 w-3.5' : 'h-4 w-4 sm:h-5 sm:w-5'} />
                ) : (
                  <TbMaximize className={isVeryCompact ? 'h-3.5 w-3.5' : 'h-4 w-4 sm:h-5 sm:w-5'} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
