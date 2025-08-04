'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { videoStorage } from '@/lib/video-storage';

interface VideoUploadProps {
  onUploadComplete?: (videoId: string) => void;
}

export function VideoUpload({ onUploadComplete }: VideoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // コンポーネントのアンマウント時にプレビューURLをクリーンアップ
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ファイルタイプの検証
    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    if (!validTypes.includes(file.type)) {
      setError('対応している形式は MP4, MOV, AVI です');
      return;
    }

    // ファイルサイズの検証（100MB以下）
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      setError('ファイルサイズは100MB以下にしてください');
      return;
    }

    setError(null);
    setSelectedFile(file);

    // 古いプレビューURLをクリーンアップ
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }

    // プレビュー用のURLを作成
    const previewUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(previewUrl);
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    setSaving(true);
    setError(null);

    try {
      // IndexedDBに動画を保存
      const videoId = await videoStorage.saveVideo(selectedFile);
      
      // 保存完了後の処理
      if (onUploadComplete) {
        onUploadComplete(videoId);
      }

      // 状態をリセット
      setSelectedFile(null);
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
      setVideoPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setVideoPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>スイング動画のアップロード</CardTitle>
        <CardDescription>
          ゴルフスイングの動画をアップロードして分析を開始しましょう
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedFile ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Input
                ref={fileInputRef}
                type="file"
                id="video-upload"
                accept="video/mp4,video/quicktime,video/x-msvideo"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Label
                htmlFor="video-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="text-sm text-gray-600">
                  クリックして動画を選択
                </span>
                <span className="text-xs text-gray-500">
                  MP4, MOV, AVI (最大100MB)
                </span>
              </Label>
            </div>
            {error && (
              <div className="text-sm text-red-500 text-center">{error}</div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {videoPreviewUrl && (
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  src={videoPreviewUrl}
                  controls
                  className="w-full h-full object-contain"
                >
                  お使いのブラウザは動画の再生に対応していません。
                </video>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{selectedFile.name}</span>
                <span className="ml-2">
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveFile}
                disabled={saving}
              >
                削除
              </Button>
            </div>
            {error && (
              <div className="text-sm text-red-500 text-center">{error}</div>
            )}
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full"
            >
              {saving ? '保存中...' : '動画を保存'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}