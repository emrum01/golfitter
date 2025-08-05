'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Video,
  ArrowLeft,
  List,
  X,
  User,
  Trophy,
  Play,
} from 'lucide-react';
import type { SwingComparisonProps, AnalysisResult } from '@/lib/types/swing-analysis';
import { mockAnalysisResult, mockDetailedAnalysisData } from '@/lib/mocks/swing-analysis';
import { getScoreBadgeVariant } from '@/lib/utils/score-utils';
import { SwingAnalysisGraphs } from './swing-analysis-graphs';
import { videoStorage, type StoredVideo } from '@/lib/video-storage';
import { useRouter } from 'next/navigation';

export function SwingComparison({
  onBack,
  onAnalysisComplete,
  isLoading = false,
  analysisResult = null,
  error = null,
  presetVideo2,
  presetVideo2Name,
}: SwingComparisonProps) {
  const router = useRouter();
  const [video1, setVideo1] = useState<File | null>(null);
  const [video2, setVideo2] = useState<File | null>(null);
  const [video1Url, setVideo1Url] = useState<string>('');
  const [video2Url, setVideo2Url] = useState<string>('');
  const [, setVideo1StoredId] = useState<string>('');
  const [, setVideo2StoredId] = useState<string>('');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [presetVideo2DisplayName, setPresetVideo2DisplayName] = useState<string>('');
  const [storedVideos, setStoredVideos] = useState<StoredVideo[]>([]);
  const [showVideoSelector1, setShowVideoSelector1] = useState(false);
  const [showVideoSelector2, setShowVideoSelector2] = useState(false);
  const fileInput1Ref = useRef<HTMLInputElement>(null);
  const fileInput2Ref = useRef<HTMLInputElement>(null);

  // 保存済み動画の読み込み
  useEffect(() => {
    const loadStoredVideos = async () => {
      try {
        const videos = await videoStorage.getAllVideos();
        setStoredVideos(videos);
      } catch (error) {
        console.error('Failed to load stored videos:', error);
      }
    };
    loadStoredVideos();
  }, []);

  // presetVideo2が設定されている場合、動画2を自動設定
  useEffect(() => {
    if (presetVideo2) {
      setVideo2Url(presetVideo2);
      setPresetVideo2DisplayName(presetVideo2Name || 'プロのスイング');
    }
  }, [presetVideo2, presetVideo2Name]);

  const handleVideo1Upload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      try {
        // ローカルストレージに保存
        const videoId = await videoStorage.saveVideo(file);
        setVideo1(file);
        setVideo1StoredId(videoId);
        const url = URL.createObjectURL(file);
        setVideo1Url(url);
        
        // 保存済み動画リストを更新
        const videos = await videoStorage.getAllVideos();
        setStoredVideos(videos);
      } catch (error) {
        console.error('Failed to save video:', error);
      }
    }
  };

  const handleVideo2Upload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      try {
        // ローカルストレージに保存
        const videoId = await videoStorage.saveVideo(file);
        setVideo2(file);
        setVideo2StoredId(videoId);
        const url = URL.createObjectURL(file);
        setVideo2Url(url);
        
        // 保存済み動画リストを更新
        const videos = await videoStorage.getAllVideos();
        setStoredVideos(videos);
      } catch (error) {
        console.error('Failed to save video:', error);
      }
    }
  };

  const handleStoredVideoSelect = async (videoId: string, isVideo1: boolean) => {
    try {
      const storedVideo = await videoStorage.getVideo(videoId);
      if (storedVideo) {
        const url = videoStorage.getVideoUrl(storedVideo);
        const file = new File([storedVideo.data], storedVideo.name, { type: storedVideo.type });
        
        if (isVideo1) {
          setVideo1(file);
          setVideo1Url(url);
          setVideo1StoredId(videoId);
          setShowVideoSelector1(false);
        } else {
          setVideo2(file);
          setVideo2Url(url);
          setVideo2StoredId(videoId);
          setShowVideoSelector2(false);
        }
      }
    } catch (error) {
      console.error('Failed to load stored video:', error);
    }
  };

  const handleAnalyze = async () => {
    if (!video1 || (!video2 && !presetVideo2)) return;

    // モック分析処理
    setAnalysisProgress(0);
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // モック結果
    setTimeout(() => {
      onAnalysisComplete?.(mockAnalysisResult);
    }, 2000);
  };

  const handleViewComparison = () => {
    if (!video1 || (!video2 && !presetVideo2)) return;

    // 動画データを準備
    const video1Data = {
      src: video1Url,
      title: video1?.name || '動画1',
    };
    
    const video2Data = {
      src: presetVideo2 || video2Url,
      title: presetVideo2DisplayName || video2?.name || '動画2',
    };

    const videosParam = JSON.stringify([video1Data, video2Data]);
    
    // videosページに遷移
    router.push(`/videos?videos=${encodeURIComponent(videosParam)}&initialIndex=0&returnTo=swing-comparison`);
  };

  const handleRetry = () => {
    // 動画1のみをリセット、動画2は保持
    setVideo1(null);
    setVideo1Url('');
    setAnalysisProgress(0);
    // 分析結果もリセット
    onAnalysisComplete?.(null as unknown as AnalysisResult);
  };

  const canAnalyze = video1 && (video2 || presetVideo2) && !isLoading;



  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              エラー
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{error}</p>
            <div className="flex gap-2">
              <Button onClick={handleRetry} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                再試行
              </Button>
              <Button onClick={onBack} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                診断結果に戻る
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (analysisResult) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="space-y-6">
          {/* 動画比較ビューアーへのリンク */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                動画で詳しく比較
              </CardTitle>
              <CardDescription>
                スイング動画を並べて詳しく比較できます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="relative border-2 border-dashed border-blue-300 rounded-lg p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                onClick={handleViewComparison}
              >
                <div className="flex items-center gap-4">
                  {/* 動画サムネイル */}
                  <div className="flex gap-2">
                    <div className="relative w-20 h-14 bg-gray-200 rounded overflow-hidden">
                      {video1Url && (
                        <video
                          src={video1Url}
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 self-center">vs</div>
                    <div className="relative w-20 h-14 bg-gray-200 rounded overflow-hidden">
                      {(video2Url || presetVideo2) && (
                        <video
                          src={presetVideo2 || video2Url}
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <Trophy className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* 説明テキスト */}
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">スイング比較ビューアー</p>
                    <p className="text-sm text-gray-600">
                      あなたのスイングとお手本を並べて詳しく比較できます
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      → タップして比較画面を開く
                    </p>
                  </div>
                  
                  {/* 再生アイコン */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <Play className="h-5 w-5 text-white ml-0.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="flex gap-2 flex-wrap justify-center pt-4 border-t mt-6">
                <Button onClick={handleRetry} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  新しい動画で分析
                </Button>
                <Button onClick={onBack} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  診断結果に戻る
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 分析結果エリア */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                分析結果
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  総合スコア: {analysisResult.overallScore}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="text-center">
                    <Badge variant={getScoreBadgeVariant(analysisResult.tempo.score)}>
                      テンポ: {analysisResult.tempo.score}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <Badge variant={getScoreBadgeVariant(analysisResult.posture.score)}>
                      姿勢: {analysisResult.posture.score}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <Badge variant={getScoreBadgeVariant(analysisResult.balance.score)}>
                      バランス: {analysisResult.balance.score}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <Badge variant={getScoreBadgeVariant(analysisResult.clubPath.score)}>
                      クラブパス: {analysisResult.clubPath.score}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* グラフ表示 */}
              <SwingAnalysisGraphs analysisData={mockDetailedAnalysisData} />
            </CardContent>
          </Card>

          {/* 強みと改善点 */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  強み
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {analysisResult.strengths.map((strength, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <AlertCircle className="h-4 w-4" />
                  改善点
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {analysisResult.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    );
  }



  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            スイング比較分析
          </CardTitle>
          <CardDescription>
            2つのスイング動画をアップロードして比較分析を行います
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <Progress value={analysisProgress} className="w-full" />
              </div>
              <p className="text-gray-600">分析中...</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* 動画1 */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">動画1</h3>
                    {storedVideos.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowVideoSelector1(true)}
                        className="text-xs"
                      >
                        <List className="h-3 w-3 mr-1" />
                        保存済み動画から選択
                      </Button>
                    )}
                  </div>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                    onClick={() => fileInput1Ref.current?.click()}
                  >
                    {video1Url ? (
                      <div>
                        <video
                          src={video1Url}
                          className="w-full h-32 object-cover rounded mb-2"
                          controls
                        />
                        <p className="text-sm text-gray-600">{video1?.name}</p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">動画1をアップロード</p>
                        <p className="text-xs text-gray-500 mt-1">
                          MP4, MOV, AVI形式対応
                        </p>
                        <p className="text-xs text-gray-500">最大100MB</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInput1Ref}
                    type="file"
                    accept="video/*"
                    onChange={handleVideo1Upload}
                    className="hidden"
                  />
                </div>

                {/* 動画2 */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">動画2 {presetVideo2 && <span className="text-sm text-blue-600">(プロのスイング)</span>}</h3>
                    {storedVideos.length > 0 && !presetVideo2 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowVideoSelector2(true)}
                        className="text-xs"
                      >
                        <List className="h-3 w-3 mr-1" />
                        保存済み動画から選択
                      </Button>
                    )}
                  </div>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      presetVideo2 
                        ? 'border-blue-300 bg-blue-50 hover:border-blue-400' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => fileInput2Ref.current?.click()}
                  >
                    {video2Url ? (
                      <div>
                        <video
                          src={video2Url}
                          className="w-full h-32 object-cover rounded mb-2"
                          controls
                        />
                        <p className="text-sm text-gray-600">
                          {presetVideo2 ? presetVideo2DisplayName : video2?.name}
                        </p>
                        {presetVideo2 && (
                          <p className="text-xs text-blue-600 mt-1">
                            ✓ プロのスイングが自動設定されました
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">動画2をアップロード</p>
                        <p className="text-xs text-gray-500 mt-1">
                          MP4, MOV, AVI形式対応
                        </p>
                        <p className="text-xs text-gray-500">最大100MB</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInput2Ref}
                    type="file"
                    accept="video/*"
                    onChange={handleVideo2Upload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  className="w-full md:w-auto"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  比較分析開始
                </Button>
                {!canAnalyze && (
                  <p className="text-sm text-gray-500 mt-2">
                    2つの動画をアップロードしてください
                  </p>
                )}
              </div>
            </>
          )}

          <div className="mt-6 flex justify-center">
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              診断結果に戻る
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 動画選択モーダル */}
      {(showVideoSelector1 || showVideoSelector2) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                保存済み動画から選択 ({showVideoSelector1 ? '動画1' : '動画2'})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowVideoSelector1(false);
                  setShowVideoSelector2(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {storedVideos.map((video) => (
                <div
                  key={video.id}
                  className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleStoredVideoSelect(video.id, showVideoSelector1)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{video.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(video.uploadedAt).toLocaleDateString()} • {Math.round(video.size / 1024 / 1024)}MB
                      </p>
                    </div>
                    <Video className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 