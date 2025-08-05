'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Trash2,
  FolderOpen,
} from 'lucide-react';
import { videoStorage, type StoredVideo } from '@/lib/video-storage';

interface SwingAnalysisResult {
  overallScore: number;
  tempo: {
    score: number;
    feedback: string;
    recommendation: string;
  };
  posture: {
    score: number;
    feedback: string;
    recommendation: string;
  };
  balance: {
    score: number;
    feedback: string;
    recommendation: string;
  };
  clubPath: {
    score: number;
    feedback: string;
    recommendation: string;
  };
  improvements: string[];
  strengths: string[];
}

interface SwingAnalysisProps {
  onBack: () => void;
  matchedProName?: string;
  onNavigateToUpload?: () => void;
}

export default function SwingAnalysis({
  onBack,
  matchedProName = '田中 太郎',
  onNavigateToUpload,
}: SwingAnalysisProps) {
  const router = useRouter();
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] =
    useState<SwingAnalysisResult | null>(null);
  const [savedVideos, setSavedVideos] = useState<StoredVideo[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [showSavedVideos, setShowSavedVideos] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSavedVideos();
  }, []);

  useEffect(() => {
    return () => {
      if (videoUrl && !videoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  const loadSavedVideos = async () => {
    try {
      const videos = await videoStorage.getAllVideos();
      setSavedVideos(videos.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()));
    } catch (error) {
      console.error('動画の読み込みに失敗しました:', error);
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setUploadedVideo(file);
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setAnalysisResult(null);
      setSelectedVideoId(null);
      setShowSavedVideos(false);
    }
  };

  const handleSaveVideo = async () => {
    if (!uploadedVideo) return;
    
    try {
      await videoStorage.saveVideo(uploadedVideo);
      await loadSavedVideos();
      alert('動画が保存されました');
    } catch (error) {
      console.error('動画の保存に失敗しました:', error);
      alert('動画の保存に失敗しました');
    }
  };

  const handleSelectSavedVideo = async (video: StoredVideo) => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    const url = videoStorage.getVideoUrl(video);
    setVideoUrl(url);
    setSelectedVideoId(video.id);
    setUploadedVideo(null);
    setAnalysisResult(null);
    setShowSavedVideos(false);
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      await videoStorage.deleteVideo(videoId);
      await loadSavedVideos();
      if (selectedVideoId === videoId) {
        setVideoUrl('');
        setSelectedVideoId(null);
      }
    } catch (error) {
      console.error('動画の削除に失敗しました:', error);
    }
  };

  const simulateAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate analysis progress
    const intervals = [20, 40, 60, 80, 100];
    for (const progress of intervals) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setAnalysisProgress(progress);
    }

    // Mock analysis result
    const mockResult: SwingAnalysisResult = {
      overallScore: 78,
      tempo: {
        score: 85,
        feedback: 'テンポが良好です',
        recommendation: `${matchedProName}と同様のリズムを保てています`,
      },
      posture: {
        score: 72,
        feedback: 'アドレス時の姿勢に改善の余地があります',
        recommendation: '背筋をもう少し伸ばし、膝の角度を調整してください',
      },
      balance: {
        score: 80,
        feedback: 'バランスは安定しています',
        recommendation: 'フィニッシュでの体重移動をより意識してください',
      },
      clubPath: {
        score: 75,
        feedback: 'クラブパスは概ね良好です',
        recommendation: 'ダウンスイング時のクラブの軌道をもう少し内側に',
      },
      improvements: [
        'アドレス時の前傾角度を5度深くする',
        'バックスイングのトップでの左腕の伸び',
        'インパクト後のフォロースルーの高さ',
        '体重移動のタイミング調整',
      ],
      strengths: [
        '安定したテンポとリズム',
        '良好なバランス感覚',
        'スムーズな体の回転',
        '一貫したスイングプレーン',
      ],
    };

    setAnalysisResult(mockResult);
    setIsAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (
    score: number
  ): 'default' | 'secondary' | 'destructive' => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-blue-800">スイング分析</h1>
          <p className="text-gray-600">
            あなたのスイング動画をAIが詳細分析します
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* 動画アップロード・プレビューセクション */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                スイング動画アップロード
              </CardTitle>
              <CardDescription>
                正面または側面からのスイング動画をアップロードしてください
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!videoUrl ? (
                <div
                  className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 mx-auto text-blue-400 mb-4" />
                  <p className="text-lg font-medium text-blue-600 mb-2">
                    動画をアップロード
                  </p>
                  <p className="text-sm text-gray-500">
                    MP4, MOV, AVI形式対応
                    <br />
                    最大100MB、10秒以内推奨
                  </p>
                  <div className="mt-4 space-y-2">
                    {savedVideos.length > 0 && (
                      <Button
                        variant="link"
                        onClick={() => setShowSavedVideos(true)}
                        className="block"
                      >
                        保存済み動画から選ぶ ({savedVideos.length})
                      </Button>
                    )}
                    <Button
                      variant="link"
                      onClick={() => onNavigateToUpload ? onNavigateToUpload() : router.push('/swing-upload')}
                      className="block"
                    >
                      <FolderOpen className="w-4 h-4 mr-2 inline" />
                      動画管理ページへ
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-64 object-cover rounded-lg"
                  >
                    お使いのブラウザは動画再生に対応していません。
                  </video>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      size="sm"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      別の動画を選択
                    </Button>
                    {uploadedVideo && (
                      <Button
                        onClick={handleSaveVideo}
                        variant="outline"
                        size="sm"
                      >
                        動画を保存
                      </Button>
                    )}
                    {savedVideos.length > 0 && (
                      <Button
                        onClick={() => setShowSavedVideos(!showSavedVideos)}
                        variant="outline"
                        size="sm"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        保存済み ({savedVideos.length})
                      </Button>
                    )}
                    <Button
                      onClick={simulateAnalysis}
                      disabled={isAnalyzing}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isAnalyzing ? '分析中...' : 'AI分析開始'}
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </div>
              )}

              {isAnalyzing && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-blue-600">AI分析中...</span>
                  </div>
                  <Progress value={analysisProgress} className="w-full" />
                  <p className="text-xs text-gray-500 text-center">
                    {analysisProgress < 40 && '動画を解析しています...'}
                    {analysisProgress >= 40 &&
                      analysisProgress < 80 &&
                      'スイングフォームを分析中...'}
                    {analysisProgress >= 80 && '結果を生成しています...'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 保存済み動画一覧 */}
          {showSavedVideos && savedVideos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    保存済み動画
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSavedVideos(false)}
                  >
                    閉じる
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {savedVideos.map((video) => (
                    <div
                      key={video.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedVideoId === video.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div
                          className="flex-1"
                          onClick={() => handleSelectSavedVideo(video)}
                        >
                          <p className="font-medium text-sm">{video.name}</p>
                          <p className="text-xs text-gray-500">
                            {(video.size / 1024 / 1024).toFixed(2)} MB • {' '}
                            {new Date(video.uploadedAt).toLocaleString('ja-JP')}
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
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 分析結果表示セクション */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* 分析結果表示 */}
          {analysisResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  総合スコア
                </CardTitle>
                <CardDescription>AIによる総合的なスイング評価</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="text-6xl font-bold text-blue-600">
                      {analysisResult.overallScore}
                    </div>
                    <div className="text-lg text-gray-500">/ 100</div>
                  </div>
                  <Badge
                    variant={getScoreBadgeVariant(analysisResult.overallScore)}
                    className="text-lg px-4 py-1"
                  >
                    {analysisResult.overallScore >= 80
                      ? '優秀'
                      : analysisResult.overallScore >= 60
                      ? '良好'
                      : '要改善'}
                  </Badge>
                  <p className="text-sm text-gray-600">
                    {matchedProName}との比較に基づく評価
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 詳細分析結果 */}
        {analysisResult && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* 各項目の詳細スコア */}
            <Card>
              <CardHeader>
                <CardTitle>詳細分析結果</CardTitle>
                <CardDescription>スイングの各要素別評価</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    key: 'tempo',
                    label: 'テンポ・リズム',
                    data: analysisResult.tempo,
                  },
                  {
                    key: 'posture',
                    label: 'アドレス・姿勢',
                    data: analysisResult.posture,
                  },
                  {
                    key: 'balance',
                    label: 'バランス',
                    data: analysisResult.balance,
                  },
                  {
                    key: 'clubPath',
                    label: 'クラブパス',
                    data: analysisResult.clubPath,
                  },
                ].map(({ key, label, data }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{label}</span>
                      <span
                        className={`font-bold ${getScoreColor(data.score)}`}
                      >
                        {data.score}/100
                      </span>
                    </div>
                    <Progress value={data.score} className="h-2" />
                    <p className="text-sm text-gray-600">{data.feedback}</p>
                    <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      💡 {data.recommendation}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 改善点と強み */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    改善ポイント
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysisResult.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-sm">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    あなたの強み
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysisResult.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4">
          <Button onClick={onBack} variant="outline">
            診断結果に戻る
          </Button>
          {analysisResult && (
            <Button className="bg-green-600 hover:bg-green-700">
              分析結果を保存
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
