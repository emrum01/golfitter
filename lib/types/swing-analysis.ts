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