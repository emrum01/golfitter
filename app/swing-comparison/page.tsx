'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SwingComparison } from '@/components/swing-comparison';
import type { AnalysisResult } from '@/lib/types/swing-analysis';

export default function SwingComparisonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // URLパラメータから動画2の情報を取得
  const video2Param = searchParams.get('video2');
  const proNameParam = searchParams.get('proName');

  const handleBack = () => {
    // 診断結果画面に戻る（currentStep=resultsパラメータ付き）
    router.push('/?currentStep=results');
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setIsLoading(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SwingComparison
        onBack={handleBack}
        onAnalysisComplete={handleAnalysisComplete}
        isLoading={isLoading}
        analysisResult={analysisResult}
        error={error}
        presetVideo2={video2Param ? `/videos/${video2Param}` : undefined}
        presetVideo2Name={proNameParam ? `${proNameParam}のスイング` : undefined}
      />
    </div>
  );
} 