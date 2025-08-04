'use client';

import { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, User, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileVideoPlayerProps {
  src: string;
  modelSrc?: string;
  title?: string;
  className?: string;
  enableComparison?: boolean;
}

export function MobileVideoPlayer({ 
  src, 
  modelSrc = '/videos/model-swing.mp4',
  title, 
  className = '',
  enableComparison = false
}: MobileVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modelVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeVideo, setActiveVideo] = useState<'user' | 'model'>('user');
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const video = activeVideo === 'user' ? videoRef.current : modelVideoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [activeVideo]);

  useEffect(() => {
    if (!enableComparison) return;
    
    // 動画を同期させる
    const userVideo = videoRef.current;
    const modelVideo = modelVideoRef.current;
    
    if (userVideo && modelVideo) {
      const syncVideos = () => {
        const activeVid = activeVideo === 'user' ? userVideo : modelVideo;
        const inactiveVid = activeVideo === 'user' ? modelVideo : userVideo;
        
        if (Math.abs(activeVid.currentTime - inactiveVid.currentTime) > 0.1) {
          inactiveVid.currentTime = activeVid.currentTime;
        }
      };
      
      userVideo.addEventListener('timeupdate', syncVideos);
      modelVideo.addEventListener('timeupdate', syncVideos);
      
      return () => {
        userVideo.removeEventListener('timeupdate', syncVideos);
        modelVideo.removeEventListener('timeupdate', syncVideos);
      };
    }
  }, [activeVideo, enableComparison]);

  const togglePlayPause = () => {
    const userVideo = videoRef.current;
    const modelVideo = modelVideoRef.current;
    const activeVid = activeVideo === 'user' ? userVideo : modelVideo;
    
    if (!activeVid) return;

    if (isPlaying) {
      activeVid.pause();
      if (enableComparison) {
        userVideo?.pause();
        modelVideo?.pause();
      }
    } else {
      activeVid.play();
      if (enableComparison) {
        userVideo?.play();
        modelVideo?.play();
      }
    }
  };

  const restart = () => {
    const userVideo = videoRef.current;
    const modelVideo = modelVideoRef.current;
    
    if (userVideo) {
      userVideo.currentTime = 0;
      userVideo.play();
    }
    
    if (enableComparison && modelVideo) {
      modelVideo.currentTime = 0;
      modelVideo.play();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const userVideo = videoRef.current;
    const modelVideo = modelVideoRef.current;
    const activeVid = activeVideo === 'user' ? userVideo : modelVideo;
    
    if (!activeVid) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    
    activeVid.currentTime = percentage * duration;
    
    if (enableComparison) {
      if (userVideo) userVideo.currentTime = percentage * duration;
      if (modelVideo) modelVideo.currentTime = percentage * duration;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (enableComparison && (isLeftSwipe || isRightSwipe)) {
      setActiveVideo(prev => prev === 'user' ? 'model' : 'user');
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={cn("relative bg-black overflow-hidden", className)}
      onTouchStart={enableComparison ? handleTouchStart : undefined}
      onTouchMove={enableComparison ? handleTouchMove : undefined}
      onTouchEnd={enableComparison ? handleTouchEnd : undefined}
    >
      {enableComparison && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-full transition-all",
                activeVideo === 'user' 
                  ? "bg-blue-600 text-white" 
                  : "bg-white/20 text-white/60"
              )}>
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">あなた</span>
              </div>
              <div className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-full transition-all",
                activeVideo === 'model' 
                  ? "bg-green-600 text-white" 
                  : "bg-white/20 text-white/60"
              )}>
                <Trophy className="h-4 w-4" />
                <span className="text-sm font-medium">お手本</span>
              </div>
            </div>
            {title && <h3 className="text-white font-medium text-sm">{title}</h3>}
          </div>
        </div>
      )}
      
      {!enableComparison && title && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-4 z-10">
          <h3 className="text-white font-medium">{title}</h3>
        </div>
      )}
      
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          src={src}
          className={cn(
            "absolute inset-0 w-full h-full object-contain transition-transform duration-300",
            enableComparison && activeVideo === 'model' && "translate-x-full"
          )}
          playsInline
          webkit-playsinline="true"
        />
        
        {enableComparison && (
          <video
            ref={modelVideoRef}
            src={modelSrc}
            className={cn(
              "absolute inset-0 w-full h-full object-contain transition-transform duration-300",
              activeVideo === 'user' && "-translate-x-full"
            )}
            playsInline
            webkit-playsinline="true"
          />
        )}
      </div>

      {enableComparison && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 z-10",
              activeVideo === 'user' && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => setActiveVideo('user')}
            disabled={activeVideo === 'user'}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 z-10",
              activeVideo === 'model' && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => setActiveVideo('model')}
            disabled={activeVideo === 'model'}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
        <div className="space-y-2">
          <div
            className="relative h-1 bg-white/30 rounded-full cursor-pointer"
            onClick={handleProgressClick}
            role="progressbar"
            aria-label="Video progress"
            aria-valuenow={currentTime}
            aria-valuemin={0}
            aria-valuemax={duration}
          >
            <div
              className="absolute top-0 left-0 h-full bg-white rounded-full transition-all"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={restart}
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>

            <div className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}