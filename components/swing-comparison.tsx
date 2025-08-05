'use client';

import React, { useState, useRef } from 'react';
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
  BarChart3,
} from 'lucide-react';
import type { SwingComparisonProps } from '@/lib/types/swing-analysis';
import { mockAnalysisResult, mockDetailedAnalysisData } from '@/lib/mocks/swing-analysis';
import { getScoreBadgeVariant } from '@/lib/utils/score-utils';
import { DetailedSwingAnalysis } from './detailed-swing-analysis';
import { SwingAnalysisGraphs } from './swing-analysis-graphs';

export function SwingComparison({
  onBack,
  onAnalysisComplete,
  isLoading = false,
  analysisResult = null,
  error = null,
  presetVideo2,
  presetVideo2Name,
}: SwingComparisonProps) {
  const [video1, setVideo1] = useState<File | null>(null);
  const [video2, setVideo2] = useState<File | null>(null);
  const [video1Url, setVideo1Url] = useState<string>('');
  const [video2Url, setVideo2Url] = useState<string>('');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [presetVideo2DisplayName, setPresetVideo2DisplayName] = useState<string>('');
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const fileInput1Ref = useRef<HTMLInputElement>(null);
  const fileInput2Ref = useRef<HTMLInputElement>(null);

  // presetVideo2が設定されている場合、動画2を自動設定
  React.useEffect(() => {
    if (presetVideo2) {
      setVideo2Url(presetVideo2);
      setPresetVideo2DisplayName(presetVideo2Name || 'プロのスイング');
    }
  }, [presetVideo2, presetVideo2Name]);

  const handleVideo1Upload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideo1(file);
      const url = URL.createObjectURL(file);
      setVideo1Url(url);
    }
  };

  const handleVideo2Upload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideo2(file);
      const url = URL.createObjectURL(file);
      setVideo2Url(url);
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

  const handleRetry = () => {
    setVideo1(null);
    setVideo2(null);
    setVideo1Url('');
    setVideo2Url('');
    setAnalysisProgress(0);
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
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              分析結果
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                総合スコア: {analysisResult.overallScore}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <div className="mb-6">
              <SwingAnalysisGraphs analysisData={mockDetailedAnalysisData} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-green-600">強み</h4>
                <ul className="space-y-1">
                  {analysisResult.strengths.map((strength, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-orange-600">改善点</h4>
                <ul className="space-y-1">
                  {analysisResult.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex gap-2 flex-wrap">
              <Button 
                onClick={() => setShowDetailedAnalysis(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                動画1の詳細分析
              </Button>
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
      </div>
    );
  }

  // 詳細分析モーダル
  if (showDetailedAnalysis) {
    return (
      <DetailedSwingAnalysis
        analysisData={mockDetailedAnalysisData}
        onClose={() => setShowDetailedAnalysis(false)}
      />
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
                  <h3 className="font-semibold mb-3">動画1</h3>
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
                  <h3 className="font-semibold mb-3">動画2 {presetVideo2 && <span className="text-sm text-blue-600">(プロのスイング)</span>}</h3>
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
    </div>
  );
} 