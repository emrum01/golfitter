'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Trash2, Calendar } from 'lucide-react';
import { videoStorage, type StoredVideo } from '@/lib/video-storage';

interface SavedVideosListProps {
  onVideoSelect: (video: StoredVideo) => void;
  selectedVideoId?: string;
  className?: string;
}

export function SavedVideosList({ onVideoSelect, selectedVideoId, className }: SavedVideosListProps) {
  const [videos, setVideos] = useState<StoredVideo[]>([]);
  const [loading, setLoading] = useState(true);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const storedVideos = await videoStorage.getAllVideos();
      // 新しい順にソート
      setVideos(storedVideos.sort((a, b) => 
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      ));
    } catch (error) {
      console.error('動画の読み込みに失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleDeleteVideo = async (videoId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (confirm('この動画を削除しますか？')) {
      try {
        await videoStorage.deleteVideo(videoId);
        await loadVideos(); // リストを再読み込み
      } catch (error) {
        console.error('動画の削除に失敗しました:', error);
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">読み込み中...</div>
        </CardContent>
      </Card>
    );
  }

  if (videos.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            保存された動画
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <Video className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>保存された動画はありません</p>
            <p className="text-sm">動画をアップロードすると自動的に保存されます</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          保存された動画 ({videos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {videos.map((video) => (
            <div
              key={video.id}
              className={`
                p-3 border rounded-lg cursor-pointer transition-colors group
                ${selectedVideoId === video.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
              onClick={() => onVideoSelect(video)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Video className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="font-medium text-sm truncate">
                      {video.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(video.uploadedAt)}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {formatFileSize(video.size)}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-8 w-8"
                  onClick={(e) => handleDeleteVideo(video.id, e)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}