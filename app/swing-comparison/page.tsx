'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SwingComparison } from '@/components/swing-comparison';
import type { AnalysisResult } from '@/lib/types/swing-analysis';

export default function SwingComparisonPage() {
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    router.push('/');
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setIsLoading(false);
    setError(null);
  };

  const handleAnalyze = () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SwingComparison
        onBack={handleBack}
        onAnalysisComplete={handleAnalysisComplete}
        isLoading={isLoading}
        analysisResult={analysisResult}
        error={error}
      />
    </div>
  );
} 