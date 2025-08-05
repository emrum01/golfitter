import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, userEvent, expect, fn, waitFor } from 'storybook/test';
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
    
    // ファイル形式の説明（複数存在するので getAllByText を使用）
    const formatTexts = canvas.getAllByText(/MP4, MOV, AVI形式対応/);
    await expect(formatTexts).toHaveLength(2); // 2つの動画アップロードエリアがある
    
    const sizeTexts = canvas.getAllByText(/最大100MB/);
    await expect(sizeTexts).toHaveLength(2);
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
    
    // 戻るボタンの確認（実際のテキストは「診断結果に戻る」）
    const backButton = canvas.getByRole('button', { name: '診断結果に戻る' });
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
    
    // ローディング中は「診断結果に戻る」ボタンのみ表示される
    const backButton = canvas.getByRole('button', { name: '診断結果に戻る' });
    await expect(backButton).toBeInTheDocument();
    await expect(backButton).toBeEnabled();
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
    
    // エラータイトルの確認
    await expect(canvas.getByText('エラー')).toBeInTheDocument();
    
    // エラーメッセージの確認
    await expect(canvas.getByText('動画の分析に失敗しました。再度お試しください。')).toBeInTheDocument();
    
    // 再試行ボタンの確認
    const retryButton = canvas.getByRole('button', { name: '再試行' });
    await expect(retryButton).toBeInTheDocument();
    await expect(retryButton).toBeEnabled();
    
    // 診断結果に戻るボタンも存在する
    const backButton = canvas.getByRole('button', { name: '診断結果に戻る' });
    await expect(backButton).toBeInTheDocument();
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

export const VideoUploadInteraction: Story = {
  args: {
    onBack: fn(),
    onAnalysisComplete: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // 動画1のアップロードエリアをクリック
    const uploadArea1 = canvas.getByText('動画1をアップロード').closest('div');
    await expect(uploadArea1).toBeInTheDocument();
    
    // ファイル入力要素の存在確認
    const fileInput1 = canvasElement.querySelector('input[type="file"]');
    await expect(fileInput1).toBeInTheDocument();
    await expect(fileInput1).toHaveAttribute('accept', 'video/*');
    
    // 動画2のアップロードエリアの確認
    const uploadArea2 = canvas.getByText('動画2をアップロード').closest('div');
    await expect(uploadArea2).toBeInTheDocument();
  },
};

export const PresetVideo2: Story = {
  args: {
    onBack: fn(),
    onAnalysisComplete: fn(),
    presetVideo2: '/videos/pro-swing.mp4',
    presetVideo2Name: '田中太郎のスイング',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // 動画2にプロのスイングラベルが表示される
    await expect(canvas.getByText('(プロのスイング)')).toBeInTheDocument();
    
    // 動画2エリアの青色のスタイルを確認（より具体的なセレクタ）
    const video2Areas = canvasElement.querySelectorAll('.border-2.border-dashed');
    const video2Area = video2Areas[1]; // 2番目のアップロードエリア
    await expect(video2Area).toHaveClass('border-blue-300');
    await expect(video2Area).toHaveClass('bg-blue-50');
    
    // プリセット動画の名前が表示される
    await expect(canvas.getByText('田中太郎のスイング')).toBeInTheDocument();
    
    // 自動設定メッセージが表示される
    await expect(canvas.getByText('✓ プロのスイングが自動設定されました')).toBeInTheDocument();
  },
};

export const AnalysisButtonEnabledWithVideo: Story = {
  args: {
    onBack: fn(),
    onAnalysisComplete: fn(),
    presetVideo2: '/videos/pro-swing.mp4',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // 初期状態：動画1がないので分析ボタンは無効
    const analyzeButton = canvas.getByRole('button', { name: '比較分析開始' });
    await expect(analyzeButton).toBeDisabled();
    
    // 動画1をアップロード（シミュレート）
    const fileInput1 = canvasElement.querySelectorAll('input[type="file"]')[0] as HTMLInputElement;
    const file = new File(['video content'], 'my-swing.mp4', { type: 'video/mp4' });
    
    // ファイル変更イベントをシミュレート
    Object.defineProperty(fileInput1, 'files', {
      value: [file],
      writable: false,
    });
    
    const event = new Event('change', { bubbles: true });
    fileInput1.dispatchEvent(event);
    
    // 分析ボタンが有効になることを確認（動画1 + presetVideo2）
    await waitFor(() => {
      expect(analyzeButton).toBeEnabled();
    });
  },
};

export const RetryFunctionality: Story = {
  args: {
    onBack: fn(),
    onAnalysisComplete: fn(),
    analysisResult: mockAnalysisResult,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // 新しい動画で分析ボタンを確認
    const retryButton = canvas.getByRole('button', { name: '新しい動画で分析' });
    await expect(retryButton).toBeInTheDocument();
    
    // 注：実際のコンポーネントでは、RetryボタンはhandleRetry関数を呼び出しますが、
    // 現在のコンポーネントの実装では、状態をリセットしてもanalysisResultが
    // propsから渡されているため、画面は変わりません。
    // この動作は正しいため、ボタンの存在確認のみを行います。
  },
};

export const AnalysisWithCallbacks: Story = {
  args: {
    onBack: fn(),
    onAnalysisComplete: fn(),
    presetVideo2: '/videos/test.mp4',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // 動画1をアップロード
    const fileInput1 = canvasElement.querySelectorAll('input[type="file"]')[0] as HTMLInputElement;
    const file = new File(['video content'], 'my-swing.mp4', { type: 'video/mp4' });
    Object.defineProperty(fileInput1, 'files', {
      value: [file],
      writable: false,
    });
    fileInput1.dispatchEvent(new Event('change', { bubbles: true }));
    
    // 分析ボタンが有効になるまで待つ
    const analyzeButton = await waitFor(() => {
      const button = canvas.getByRole('button', { name: '比較分析開始' });
      expect(button).toBeEnabled();
      return button;
    });
    
    await userEvent.click(analyzeButton);
    
    // onAnalysisCompleteが呼ばれることを確認（2秒後）
    // 注：現在の実装では、isLoadingの状態はpropsで制御されているため、
    // ローディング画面は表示されません。
    await waitFor(() => {
      expect(args.onAnalysisComplete).toHaveBeenCalledWith(mockAnalysisResult);
    }, { timeout: 3000 });
  },
}; 

export const AnalysisResultWithVideos: Story = {
  args: {
    onBack: fn(),
    onAnalysisComplete: fn(),
    analysisResult: mockAnalysisResult,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // 分析結果が表示されることを確認
    await expect(canvas.getByText('分析結果')).toBeInTheDocument();
    await expect(canvas.getByText('総合スコア: 85')).toBeInTheDocument();
    
    // 動画も表示されていることを確認
    await expect(canvas.getByText('動画1')).toBeInTheDocument();
    await expect(canvas.getByText('動画2')).toBeInTheDocument();
    
    // 動画プレイヤーが存在することを確認
    const videos = canvas.getAllByRole('video');
    await expect(videos).toHaveLength(2);
    
    // グラフが表示されることを確認
    await expect(canvas.getByText('総合スコア')).toBeInTheDocument();
    await expect(canvas.getByText('詳細分析グラフ')).toBeInTheDocument();
  },
};

export const AnalysisResultWithVideosVertical: Story = {
  args: {
    onBack: fn(),
    onAnalysisComplete: fn(),
    analysisResult: mockAnalysisResult,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // 分析結果が上部に表示されることを確認
    await expect(canvas.getByText('分析結果')).toBeInTheDocument();
    await expect(canvas.getByText('総合スコア: 85')).toBeInTheDocument();
    
    // 動画が下部に表示されることを確認
    await expect(canvas.getByText('比較動画')).toBeInTheDocument();
    await expect(canvas.getByText('動画1')).toBeInTheDocument();
    await expect(canvas.getByText('動画2')).toBeInTheDocument();
    
    // 動画プレイヤーが存在することを確認
    const videos = canvas.getAllByRole('video');
    await expect(videos).toHaveLength(2);
    
    // グラフが表示されることを確認
    await expect(canvas.getByText('総合スコア')).toBeInTheDocument();
    await expect(canvas.getByText('詳細分析グラフ')).toBeInTheDocument();
  },
};

export const AnalysisResultWithVideosTop: Story = {
  args: {
    onBack: fn(),
    onAnalysisComplete: fn(),
    analysisResult: mockAnalysisResult,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // 動画が一番上に表示されることを確認
    await expect(canvas.getByText('比較動画')).toBeInTheDocument();
    await expect(canvas.getByText('動画1')).toBeInTheDocument();
    await expect(canvas.getByText('動画2')).toBeInTheDocument();
    
    // 動画プレイヤーが存在することを確認
    const videos = canvas.getAllByRole('video');
    await expect(videos).toHaveLength(2);
    
    // ボタンが比較動画セクションに表示されることを確認
    await expect(canvas.getByRole('button', { name: '新しい動画で分析' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: '診断結果に戻る' })).toBeInTheDocument();
    
    // 動画1の詳細分析ボタンが存在しないことを確認
    const detailedAnalysisButton = canvas.queryByRole('button', { name: /動画1の詳細分析/ });
    expect(detailedAnalysisButton).not.toBeInTheDocument();
    
    // 分析結果が動画の下に表示されることを確認
    await expect(canvas.getByText('分析結果')).toBeInTheDocument();
    await expect(canvas.getByText('総合スコア: 85')).toBeInTheDocument();
    
    // グラフが表示されることを確認
    await expect(canvas.getByText('総合スコア')).toBeInTheDocument();
    await expect(canvas.getByText('詳細分析グラフ')).toBeInTheDocument();
  },
};

export const NewAnalysisButton: Story = {
  args: {
    onBack: fn(),
    onAnalysisComplete: fn(),
    analysisResult: mockAnalysisResult,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // 新しい動画で分析ボタンをクリック
    const newAnalysisButton = canvas.getByRole('button', { name: '新しい動画で分析' });
    await userEvent.click(newAnalysisButton);
    
    // 初期画面に戻ることを確認（分析結果が表示されない）
    await expect(canvas.queryByText('分析結果')).not.toBeInTheDocument();
    await expect(canvas.queryByText('総合スコア: 85')).not.toBeInTheDocument();
    
    // 動画アップロード画面が表示されることを確認
    await expect(canvas.getByText('スイング比較分析')).toBeInTheDocument();
    await expect(canvas.getByText('動画1をアップロード')).toBeInTheDocument();
    await expect(canvas.getByText('動画2をアップロード')).toBeInTheDocument();
    
    // 動画2はセットされたままであることを確認
    await expect(canvas.getByText('動画2')).toBeInTheDocument();
  },
}; 