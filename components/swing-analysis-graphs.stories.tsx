import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect } from 'storybook/test';
// まだ存在しないコンポーネントをインポート（RED Phase）
import { SwingAnalysisGraphs } from './swing-analysis-graphs';

const meta = {
  title: 'Analysis/SwingAnalysisGraphs',
  component: SwingAnalysisGraphs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    analysisData: {
      control: 'object',
      description: '分析データ',
    },
  },
} satisfies Meta<typeof SwingAnalysisGraphs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    analysisData: {
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
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // 総合スコアのグラフが表示されることを確認
    await expect(canvas.getByText('総合スコア')).toBeInTheDocument();
    
    // 各分析項目のグラフが表示されることを確認
    await expect(canvas.getByText('テンポ分析')).toBeInTheDocument();
    await expect(canvas.getByText('姿勢分析')).toBeInTheDocument();
    await expect(canvas.getByText('バランス分析')).toBeInTheDocument();
    await expect(canvas.getByText('クラブパス分析')).toBeInTheDocument();
    
    // 詳細メトリクスが表示されることを確認
    await expect(canvas.getByText('バックスイング速度')).toBeInTheDocument();
    await expect(canvas.getByText('ダウンスイング速度')).toBeInTheDocument();
    await expect(canvas.getByText('リズム')).toBeInTheDocument();
  },
};

export const HighScore: Story = {
  args: {
    analysisData: {
      overallScore: 95,
      detailedMetrics: {
        tempo: {
          score: 95,
          details: {
            backswingSpeed: 92,
            downswingSpeed: 98,
            rhythm: 95,
          },
          feedback: 'テンポが非常に良好です',
          recommendation: '現在のテンポを維持してください',
        },
        posture: {
          score: 90,
          details: {
            spineAngle: 88,
            shoulderAlignment: 92,
            hipPosition: 90,
          },
          feedback: '姿勢が良好です',
          recommendation: '現在の姿勢を維持してください',
        },
        balance: {
          score: 95,
          details: {
            weightDistribution: 95,
            centerOfGravity: 94,
            stability: 96,
          },
          feedback: 'バランスが非常に良好です',
          recommendation: '現在のバランスを維持してください',
        },
        clubPath: {
          score: 90,
          details: {
            takeaway: 88,
            backswing: 92,
            downswing: 90,
            followThrough: 90,
          },
          feedback: 'クラブパスが良好です',
          recommendation: '現在のクラブパスを維持してください',
        },
      },
      strengths: ['テンポが素晴らしい', 'バランスが完璧', '姿勢が理想的な形'],
      improvements: ['さらなる精度向上'],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // 高スコアの表示を確認
    await expect(canvas.getByText('総合スコア: 95')).toBeInTheDocument();
    
    // 高スコアのバッジが表示されることを確認
    await expect(canvas.getByText('テンポ: 95')).toBeInTheDocument();
    await expect(canvas.getByText('姿勢: 90')).toBeInTheDocument();
    await expect(canvas.getByText('バランス: 95')).toBeInTheDocument();
    await expect(canvas.getByText('クラブパス: 90')).toBeInTheDocument();
  },
};

export const LowScore: Story = {
  args: {
    analysisData: {
      overallScore: 65,
      detailedMetrics: {
        tempo: {
          score: 60,
          details: {
            backswingSpeed: 55,
            downswingSpeed: 65,
            rhythm: 60,
          },
          feedback: 'テンポに改善の余地があります',
          recommendation: 'メトロノームを使用してテンポを練習してください',
        },
        posture: {
          score: 70,
          details: {
            spineAngle: 65,
            shoulderAlignment: 75,
            hipPosition: 70,
          },
          feedback: '姿勢に改善の余地があります',
          recommendation: '背筋を伸ばし、肩の力を抜いてください',
        },
        balance: {
          score: 65,
          details: {
            weightDistribution: 60,
            centerOfGravity: 70,
            stability: 65,
          },
          feedback: 'バランスに改善の余地があります',
          recommendation: '重心を安定させてください',
        },
        clubPath: {
          score: 60,
          details: {
            takeaway: 55,
            backswing: 65,
            downswing: 60,
            followThrough: 60,
          },
          feedback: 'クラブパスに改善の余地があります',
          recommendation: 'インサイドアウトの軌道を意識してください',
        },
      },
      strengths: ['基本的なスイング動作は理解している'],
      improvements: ['テンポの改善', '姿勢の修正', 'バランスの向上', 'クラブパスの修正'],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // 低スコアの表示を確認
    await expect(canvas.getByText('総合スコア: 65')).toBeInTheDocument();
    
    // 改善点が多く表示されることを確認
    await expect(canvas.getByText('テンポの改善')).toBeInTheDocument();
    await expect(canvas.getByText('姿勢の修正')).toBeInTheDocument();
    await expect(canvas.getByText('バランスの向上')).toBeInTheDocument();
    await expect(canvas.getByText('クラブパスの修正')).toBeInTheDocument();
  },
}; 