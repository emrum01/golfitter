import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, userEvent, expect, fn } from 'storybook/test';
import { SwingComparison } from './swing-comparison';
import { mockAnalysisResult, mockAnalysisResultHighScore, mockAnalysisResultLowScore } from '@/lib/mocks/swing-analysis';

const meta = {
  title: 'Features/SwingComparison',
  component: SwingComparison,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onBack: { action: 'onBack' },
    onAnalysisComplete: { action: 'onAnalysisComplete' },
  },
} satisfies Meta<typeof SwingComparison>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onBack: fn(),
    onAnalysisComplete: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // 基本的な表示要素の確認
    await expect(canvas.getByText('スイング比較分析')).toBeInTheDocument();
    await expect(canvas.getByText('動画1')).toBeInTheDocument();
    await expect(canvas.getByText('動画2')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: '比較分析開始' })).toBeInTheDocument();
  },
};

export const VideoUpload: Story = {
  args: {
    onBack: fn(),
    onAnalysisComplete: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // 動画アップロードエリアの確認
    const uploadArea1 = canvas.getByText('動画1をアップロード');
    const uploadArea2 = canvas.getByText('動画2をアップロード');
    
    await expect(uploadArea1).toBeInTheDocument();
    await expect(uploadArea2).toBeInTheDocument();
    
    // ファイル形式の説明
    await expect(canvas.getByText(/MP4, MOV, AVI形式対応/)).toBeInTheDocument();
    await expect(canvas.getByText(/最大100MB/)).toBeInTheDocument();
  },
};

export const AnalysisButton: Story = {
  args: {
    onBack: fn(),
    onAnalysisComplete: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // 分析ボタンの初期状態（無効）
    const analyzeButton = canvas.getByRole('button', { name: '比較分析開始' });
    await expect(analyzeButton).toBeDisabled();
    
    // ボタンの説明テキスト
    await expect(canvas.getByText(/2つの動画をアップロードしてください/)).toBeInTheDocument();
  },
};

export const BackButton: Story = {
  args: {
    onBack: fn(),
    onAnalysisComplete: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // 戻るボタンの確認
    const backButton = canvas.getByRole('button', { name: '戻る' });
    await expect(backButton).toBeInTheDocument();
    await expect(backButton).toBeEnabled();
    
    // クリックイベントのテスト
    await userEvent.click(backButton);
    await expect(args.onBack).toHaveBeenCalledTimes(1);
  },
};

export const LoadingState: Story = {
  args: {
    onBack: fn(),
    onAnalysisComplete: fn(),
    isLoading: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // ローディング状態の確認
    await expect(canvas.getByText('分析中...')).toBeInTheDocument();
    await expect(canvas.getByRole('progressbar')).toBeInTheDocument();
    
    // 分析ボタンが無効化される
    const analyzeButton = canvas.getByRole('button', { name: '比較分析開始' });
    await expect(analyzeButton).toBeDisabled();
  },
};

export const AnalysisResult: Story = {
  args: {
    onBack: fn(),
    onAnalysisComplete: fn(),
    analysisResult: mockAnalysisResult,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // 分析結果の表示確認
    await expect(canvas.getByText('分析結果')).toBeInTheDocument();
    await expect(canvas.getByText('総合スコア: 85')).toBeInTheDocument();
    
    // 各項目のスコア確認
    await expect(canvas.getByText('テンポ: 90')).toBeInTheDocument();
    await expect(canvas.getByText('姿勢: 80')).toBeInTheDocument();
    await expect(canvas.getByText('バランス: 85')).toBeInTheDocument();
    await expect(canvas.getByText('クラブパス: 75')).toBeInTheDocument();
    
    // 改善点と強みの確認
    await expect(canvas.getByText('改善点')).toBeInTheDocument();
    await expect(canvas.getByText('強み')).toBeInTheDocument();
  },
};

export const ErrorState: Story = {
  args: {
    onBack: fn(),
    onAnalysisComplete: fn(),
    error: '動画の分析に失敗しました。再度お試しください。',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // エラー状態の確認
    await expect(canvas.getByText('エラー')).toBeInTheDocument();
    await expect(canvas.getByText('動画の分析に失敗しました。再度お試しください。')).toBeInTheDocument();
    
    // 再試行ボタンの確認
    const retryButton = canvas.getByRole('button', { name: '再試行' });
    await expect(retryButton).toBeInTheDocument();
    await expect(retryButton).toBeEnabled();
  },
};

export const HighScoreResult: Story = {
  args: {
    onBack: fn(),
    onAnalysisComplete: fn(),
    analysisResult: mockAnalysisResultHighScore,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // 高スコア結果の確認
    await expect(canvas.getByText('総合スコア: 95')).toBeInTheDocument();
    await expect(canvas.getByText('テンポ: 95')).toBeInTheDocument();
    await expect(canvas.getByText('姿勢: 90')).toBeInTheDocument();
    await expect(canvas.getByText('バランス: 95')).toBeInTheDocument();
    await expect(canvas.getByText('クラブパス: 90')).toBeInTheDocument();
  },
};

export const LowScoreResult: Story = {
  args: {
    onBack: fn(),
    onAnalysisComplete: fn(),
    analysisResult: mockAnalysisResultLowScore,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // 低スコア結果の確認
    await expect(canvas.getByText('総合スコア: 65')).toBeInTheDocument();
    await expect(canvas.getByText('テンポ: 60')).toBeInTheDocument();
    await expect(canvas.getByText('姿勢: 70')).toBeInTheDocument();
    await expect(canvas.getByText('バランス: 65')).toBeInTheDocument();
    await expect(canvas.getByText('クラブパス: 60')).toBeInTheDocument();
  },
}; 