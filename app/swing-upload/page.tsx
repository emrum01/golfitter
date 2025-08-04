'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/protected-route';
import { VideoUpload } from '@/components/video-upload';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { videoStorage, StoredVideo } from '@/lib/video-storage';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function SwingUploadPage() {
  const router = useRouter();
  const [savedVideoId, setSavedVideoId] = useState<string | null>(null);
  const [savedVideos, setSavedVideos] = useState<StoredVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<StoredVideo | null>(null);

  useEffect(() => {
    // 保存済みの動画を取得
    loadSavedVideos();
  }, [savedVideoId]);

  const loadSavedVideos = async () => {
    try {
      const videos = await videoStorage.getAllVideos();
      setSavedVideos(videos.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()));
    } catch (error) {
      console.error('動画の読み込みに失敗しました:', error);
    }
  };

  const handleUploadComplete = (videoId: string) => {
    setSavedVideoId(videoId);
  };

  const handleVideoSelect = (video: StoredVideo) => {
    setSelectedVideo(video);
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      await videoStorage.deleteVideo(videoId);
      loadSavedVideos();
      if (selectedVideo?.id === videoId) {
        setSelectedVideo(null);
      }
    } catch (error) {
      console.error('動画の削除に失敗しました:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('ja-JP');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            スイング動画のアップロード
          </h1>
          <p className="text-gray-600 mt-2">
            あなたのゴルフスイングを分析して、改善点を見つけましょう
          </p>
        </div>

        <div className="flex justify-center">
          <VideoUpload onUploadComplete={handleUploadComplete} />
        </div>

        {savedVideos.length > 0 && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>保存済みの動画</CardTitle>
                <CardDescription>
                  クリックして動画を選択し、分析を開始できます
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {savedVideos.map((video) => (
                    <div
                      key={video.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedVideo?.id === video.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleVideoSelect(video)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{video.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(video.size)} • {formatDate(video.uploadedAt)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteVideo(video.id);
                          }}
                        >
                          削除
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedVideo && (
                  <div className="mt-4 text-center">
                    <Button
                      onClick={() => {
                        // 分析ページへの遷移
                        router.push(`/analysis?videoId=${selectedVideo.id}`);
                      }}
                    >
                      選択した動画を分析する
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <SwingUploadPage />
    </ProtectedRoute>
  );
}