'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { MobileVideoPlayer } from '@/components/mobile-video-player';
import { videoStorage } from '@/lib/video-storage';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Video {
  id: string;
  name: string;
  url: string;
  uploadedAt: Date;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const allVideos = await videoStorage.getAllVideos();
        const videoList: Video[] = [];

        for (const video of allVideos) {
          const url = videoStorage.getVideoUrl(video);
          videoList.push({
            id: video.id,
            name: video.name,
            url,
            uploadedAt: video.uploadedAt,
          });
        }

        setVideos(videoList);
      } catch (error) {
        console.error('Failed to load videos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();

    // クリーンアップ関数
    return () => {
      videos.forEach(video => {
        if (video.url) {
          URL.revokeObjectURL(video.url);
        }
      });
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white">動画を読み込み中...</div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-4">
        <p className="mb-4">まだ動画がアップロードされていません</p>
        <Link href="/swing-upload">
          <Button>動画をアップロード</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black relative">
      <div className="absolute top-4 left-4 z-20">
        <Link href="/">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        className="h-full"
      >
        {videos.map((video, index) => (
          <SwiperSlide key={video.id}>
            <MobileVideoPlayer
              src={video.url}
              title={`${video.name} (${index + 1}/${videos.length})`}
              className="h-full"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          opacity: 0.8;
        }
        
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          opacity: 1;
        }

        .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
        }

        .swiper-pagination-bullet-active {
          opacity: 1;
        }

        @media (max-width: 640px) {
          .swiper-button-next,
          .swiper-button-prev {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}