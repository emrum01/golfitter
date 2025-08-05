'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  Target,
  TrendingUp,
} from 'lucide-react';
import type { DetailedAnalysisData } from '@/lib/types/swing-analysis';
import { getScoreBadgeVariant } from '@/lib/utils/score-utils';

interface SwingAnalysisGraphsProps {
  analysisData: DetailedAnalysisData;
}

export function SwingAnalysisGraphs({
  analysisData,
}: SwingAnalysisGraphsProps) {
  const { overallScore, detailedMetrics } = analysisData;

  const renderMetricGraph = (
    title: string,
    metric: {
      score: number;
      details: Record<string, number>;
      feedback: string;
      recommendation: string;
    }
  ) => {
    const detailLabels: Record<string, string> = {
      backswingSpeed: 'バックスイング速度',
      downswingSpeed: 'ダウンスイング速度',
      rhythm: 'リズム',
      spineAngle: '背骨角度',
      shoulderAlignment: '肩の位置',
      hipPosition: '腰の位置',
      weightDistribution: '体重配分',
      centerOfGravity: '重心',
      stability: '安定性',
      takeaway: 'テイクアウェイ',
      backswing: 'バックスイング',
      downswing: 'ダウンスイング',
      followThrough: 'フォロースルー',
    };

    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{title}分析</CardTitle>
            <Badge variant={getScoreBadgeVariant(metric.score)}>
              {metric.score}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {Object.entries(metric.details).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{detailLabels[key] || key}</span>
                  <span className="font-medium">{value}</span>
                </div>
                <Progress value={value} className="h-2" />
              </div>
            ))}
          </div>
          <div className="pt-2 border-t">
            <p className="text-sm text-gray-600 mb-1">{metric.feedback}</p>
            <p className="text-xs text-gray-500">{metric.recommendation}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* 総合スコアグラフ */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Target className="h-5 w-5" />
            総合スコア
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-3xl font-bold text-blue-900">
                {overallScore}
              </h3>
              <Badge variant={getScoreBadgeVariant(overallScore)} className="text-lg">
                {overallScore >= 90 ? '優秀' : 
                 overallScore >= 80 ? '良好' : 
                 overallScore >= 70 ? '普通' : '要改善'}
              </Badge>
            </div>
            <Progress value={overallScore} className="h-4" />
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div className="text-center">
                <Badge variant={getScoreBadgeVariant(detailedMetrics.tempo.score)}>
                  テンポ: {detailedMetrics.tempo.score}
                </Badge>
              </div>
              <div className="text-center">
                <Badge variant={getScoreBadgeVariant(detailedMetrics.posture.score)}>
                  姿勢: {detailedMetrics.posture.score}
                </Badge>
              </div>
              <div className="text-center">
                <Badge variant={getScoreBadgeVariant(detailedMetrics.balance.score)}>
                  バランス: {detailedMetrics.balance.score}
                </Badge>
              </div>
              <div className="text-center">
                <Badge variant={getScoreBadgeVariant(detailedMetrics.clubPath.score)}>
                  クラブパス: {detailedMetrics.clubPath.score}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 詳細分析グラフ */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold">詳細分析グラフ</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderMetricGraph('テンポ', detailedMetrics.tempo)}
          {renderMetricGraph('姿勢', detailedMetrics.posture)}
          {renderMetricGraph('バランス', detailedMetrics.balance)}
          {renderMetricGraph('クラブパス', detailedMetrics.clubPath)}
        </div>
      </div>

      {/* スコア比較チャート */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            スコア比較
          </CardTitle>
          <CardDescription>
            各分析項目のスコアを比較
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries({
              'テンポ': detailedMetrics.tempo.score,
              '姿勢': detailedMetrics.posture.score,
              'バランス': detailedMetrics.balance.score,
              'クラブパス': detailedMetrics.clubPath.score,
            }).map(([label, score]) => (
              <div key={label} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{label}</span>
                  <span className="text-sm text-gray-600">{score}</span>
                </div>
                <div className="relative">
                  <Progress value={score} className="h-3" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-white drop-shadow">
                      {score >= 90 ? '優秀' : score >= 80 ? '良好' : score >= 70 ? '普通' : '要改善'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 