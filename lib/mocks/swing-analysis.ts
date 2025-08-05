import type { AnalysisResult, DetailedAnalysisData } from '../types/swing-analysis';

export const mockAnalysisResult: AnalysisResult = {
  overallScore: 85,
  tempo: {
    score: 90,
    feedback: 'テンポが良好です',
    recommendation: '現在のテンポを維持してください',
  },
  posture: {
    score: 80,
    feedback: '姿勢に改善の余地があります',
    recommendation: '背筋を伸ばしてください',
  },
  balance: {
    score: 85,
    feedback: 'バランスは良好です',
    recommendation: '現在のバランスを維持してください',
  },
  clubPath: {
    score: 75,
    feedback: 'クラブパスに改善の余地があります',
    recommendation: 'インサイドアウトを意識してください',
  },
  improvements: ['姿勢の改善', 'クラブパスの修正'],
  strengths: ['テンポが良い', 'バランスが安定している'],
};

// 詳細な分析データのモック
export const mockDetailedAnalysisData: DetailedAnalysisData = {
  overallScore: 85,
  detailedMetrics: {
    tempo: {
      score: 90,
      details: {
        backswingSpeed: 85,
        downswingSpeed: 92,
        rhythm: 88,
      },
      feedback: 'テンポが良好です',
      recommendation: '現在のテンポを維持してください',
    },
    posture: {
      score: 80,
      details: {
        spineAngle: 75,
        shoulderAlignment: 85,
        hipPosition: 82,
      },
      feedback: '姿勢に改善の余地があります',
      recommendation: '背筋を伸ばしてください',
    },
    balance: {
      score: 85,
      details: {
        weightDistribution: 88,
        centerOfGravity: 82,
        stability: 85,
      },
      feedback: 'バランスは良好です',
      recommendation: '現在のバランスを維持してください',
    },
    clubPath: {
      score: 75,
      details: {
        takeaway: 70,
        backswing: 78,
        downswing: 72,
        followThrough: 80,
      },
      feedback: 'クラブパスに改善の余地があります',
      recommendation: 'インサイドアウトを意識してください',
    },
  },
  strengths: ['テンポが良い', 'バランスが安定している'],
  improvements: ['姿勢の改善', 'クラブパスの修正'],
};

export const mockAnalysisResultHighScore: AnalysisResult = {
  overallScore: 95,
  tempo: {
    score: 95,
    feedback: 'テンポが非常に良好です',
    recommendation: '現在のテンポを維持してください',
  },
  posture: {
    score: 90,
    feedback: '姿勢が良好です',
    recommendation: '現在の姿勢を維持してください',
  },
  balance: {
    score: 95,
    feedback: 'バランスが非常に良好です',
    recommendation: '現在のバランスを維持してください',
  },
  clubPath: {
    score: 90,
    feedback: 'クラブパスが良好です',
    recommendation: '現在のクラブパスを維持してください',
  },
  improvements: ['さらなる精度向上'],
  strengths: ['テンポが素晴らしい', 'バランスが完璧', '姿勢が理想的な形'],
};

export const mockAnalysisResultLowScore: AnalysisResult = {
  overallScore: 65,
  tempo: {
    score: 60,
    feedback: 'テンポに改善の余地があります',
    recommendation: 'メトロノームを使用してテンポを練習してください',
  },
  posture: {
    score: 70,
    feedback: '姿勢に改善の余地があります',
    recommendation: '背筋を伸ばし、肩の力を抜いてください',
  },
  balance: {
    score: 65,
    feedback: 'バランスに改善の余地があります',
    recommendation: '重心を安定させてください',
  },
  clubPath: {
    score: 60,
    feedback: 'クラブパスに改善の余地があります',
    recommendation: 'インサイドアウトの軌道を意識してください',
  },
  improvements: ['テンポの改善', '姿勢の修正', 'バランスの向上', 'クラブパスの修正'],
  strengths: ['基本的なスイング動作は理解している'],
}; 