'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface BackToAnalysisButtonProps {
  variant?: 'arrow' | 'text';
  className?: string;
  size?: 'sm' | 'icon' | 'default';
}

export function BackToAnalysisButton({ 
  variant = 'text', 
  className = '',
  size = 'default'
}: BackToAnalysisButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleBackToAnalysis = () => {
    const returnTo = searchParams.get('returnTo');
    
    if (returnTo === 'swing-comparison') {
      // swing-comparisonから来た場合はクエリパラメータを保持して戻る
      const currentParams = new URLSearchParams(searchParams.toString());
      const swingComparisonUrl = `/swing-comparison?${currentParams.toString()}`;
      router.push(swingComparisonUrl);
    } else {
      // その他の場合は診断結果に戻る
      router.push('/?currentStep=results');
    }
  };

  if (variant === 'arrow') {
    return (
      <Button
        variant="ghost"
        size={size}
        className={`text-white hover:bg-white/20 ${className}`}
        onClick={handleBackToAnalysis}
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size={size}
      className={`text-white hover:bg-white/20 px-3 ${className}`}
      onClick={handleBackToAnalysis}
    >
      <BarChart3 className="h-4 w-4 mr-2" />
      分析に戻る
    </Button>
  );
}