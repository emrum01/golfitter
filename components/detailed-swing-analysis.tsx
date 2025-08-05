'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  X,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Target,
} from 'lucide-react';
import type { DetailedSwingAnalysisProps } from '@/lib/types/swing-analysis';
import { getScoreBadgeVariant } from '@/lib/utils/score-utils';

export function DetailedSwingAnalysis({
  analysisData,
  onClose,
}: DetailedSwingAnalysisProps) {
  const { overallScore, detailedMetrics, strengths, improvements } = analysisData;

  const renderMetricDetails = (metricName: string, details: Record<string, number>) => {
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
      <div className="space-y-3">
        {Object.entries(details).map(([key, value]) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{detailLabels[key] || key}</span>
              <span className="font-medium">{value}</span>
            </div>
            <Progress value={value} className="h-2" />
          </div>
        ))}
      </div>
    );
  };

  const renderMetricCard = (
    title: string,
    metric: {
      score: number;
      details: Record<string, number>;
      feedback: string;
      recommendation: string;
    }
  ) => {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{title}</CardTitle>
            <Badge variant={getScoreBadgeVariant(metric.score)}>
              {metric.score}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">詳細分析</h4>
            {renderMetricDetails(title, metric.details)}
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">フィードバック</h4>
            <p className="text-sm text-gray-600">{metric.feedback}</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">推奨事項</h4>
            <p className="text-sm text-gray-600">{metric.recommendation}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <div>
              <CardTitle>詳細分析結果</CardTitle>
              <CardDescription>
                動画1の詳細なスイング分析結果
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 総合スコア */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Target className="h-6 w-6 text-blue-600" />
                  <h3 className="text-2xl font-bold text-blue-900">
                    総合スコア: {overallScore}
                  </h3>
                </div>
                <Progress value={overallScore} className="h-3" />
                <p className="text-sm text-blue-700">
                  {overallScore >= 90 ? '優秀' : 
                   overallScore >= 80 ? '良好' : 
                   overallScore >= 70 ? '普通' : '要改善'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 詳細メトリクス */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderMetricCard('テンポ', detailedMetrics.tempo)}
            {renderMetricCard('姿勢', detailedMetrics.posture)}
            {renderMetricCard('バランス', detailedMetrics.balance)}
            {renderMetricCard('クラブパス', detailedMetrics.clubPath)}
          </div>

          {/* 強みと改善点 */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  強み
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {strengths.map((strength, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <AlertCircle className="h-5 w-5" />
                  改善点
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {improvements.map((improvement, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* 閉じるボタン */}
          <div className="flex justify-center">
            <Button onClick={onClose} variant="outline">
              閉じる
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 