'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { MobileVideoPlayer } from '@/components/mobile-video-player';
import { videoStorage } from '@/lib/video-storage';
import { Button } from '@/components/ui/button';
import { BackToAnalysisButton } from '@/components/back-to-analysis-button';
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

function VideosPageContent() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialSlide, setInitialSlide] = useState(0);
  const [returnTo, setReturnTo] = useState<string>('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadVideos = async () => {
      try {
        // URLパラメータから動画データを取得
        const videosParam = searchParams.get('videos');
        const initialIndexParam = searchParams.get('initialIndex');
        const returnToParam = searchParams.get('returnTo');

        if (videosParam) {
          // URLパラメータから動画データをパース
          const parsedVideos = JSON.parse(videosParam);
          const videoList: Video[] = parsedVideos.map((video: { src: string; title: string }, index: number) => ({
            id: `comparison-${index}`,
            name: video.title,
            url: video.src,
            uploadedAt: new Date(),
          }));

          setVideos(videoList);
          setInitialSlide(initialIndexParam ? parseInt(initialIndexParam, 10) : 0);
          setReturnTo(returnToParam || '');
        } else {
          // 通常の動画リスト表示
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
        }
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
        if (video.url && !video.url.startsWith('http')) {
          URL.revokeObjectURL(video.url);
        }
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <BackToAnalysisButton 
          variant="arrow" 
          size="icon"
        />
        
        {returnTo === 'swing-comparison' && (
          <BackToAnalysisButton 
            variant="text" 
            size="sm"
          />
        )}
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        initialSlide={initialSlide}
        className="h-full"
      >
        {videos.map((video, index) => (
          <SwiperSlide key={video.id}>
            <MobileVideoPlayer
              src={video.url}
              modelSrc={videos.length === 2 && index === 0 ? videos[1].url : undefined}
              title={`${video.name} (${index + 1}/${videos.length})`}
              className="h-full"
              enableComparison={videos.length === 2}
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

export default function VideosPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white">動画を読み込み中...</div>
      </div>
    }>
      <VideosPageContent />
    </Suspense>
  );
}