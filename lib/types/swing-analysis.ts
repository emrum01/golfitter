export interface AnalysisResult {
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

// 詳細な分析データの型定義
export interface DetailedAnalysisData {
  overallScore: number;
  detailedMetrics: {
    tempo: {
      score: number;
      details: {
        backswingSpeed: number;
        downswingSpeed: number;
        rhythm: number;
      };
      feedback: string;
      recommendation: string;
    };
    posture: {
      score: number;
      details: {
        spineAngle: number;
        shoulderAlignment: number;
        hipPosition: number;
      };
      feedback: string;
      recommendation: string;
    };
    balance: {
      score: number;
      details: {
        weightDistribution: number;
        centerOfGravity: number;
        stability: number;
      };
      feedback: string;
      recommendation: string;
    };
    clubPath: {
      score: number;
      details: {
        takeaway: number;
        backswing: number;
        downswing: number;
        followThrough: number;
      };
      feedback: string;
      recommendation: string;
    };
  };
  strengths: string[];
  improvements: string[];
}

export interface DetailedSwingAnalysisProps {
  analysisData: DetailedAnalysisData;
  onClose: () => void;
}

export interface SwingComparisonProps {
  onBack: () => void;
  onAnalysisComplete?: (result: AnalysisResult) => void;
  isLoading?: boolean;
  analysisResult?: AnalysisResult | null;
  error?: string | null;
  presetVideo2?: string;
  presetVideo2Name?: string;
}

export interface VideoUploadState {
  file: File | null;
  url: string;
} 