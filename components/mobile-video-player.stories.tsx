import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { userEvent, expect, waitFor, fireEvent } from 'storybook/test';
import { MobileVideoPlayer } from './mobile-video-player';

const meta = {
  title: 'Components/MobileVideoPlayer',
  component: MobileVideoPlayer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: '動画ファイルのURL',
    },
    modelSrc: {
      control: 'text',
      description: 'お手本動画のURL',
    },
    title: {
      control: 'text',
      description: '動画のタイトル（オプション）',
    },
    className: {
      control: 'text',
      description: '追加のCSSクラス',
    },
    enableComparison: {
      control: 'boolean',
      description: '比較モードを有効にする',
    },
  },
} satisfies Meta<typeof MobileVideoPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

// サンプル動画URL（実際のプロジェクトでは適切な動画URLを使用してください）
const sampleVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export const Default: Story = {
  args: {
    src: sampleVideoUrl,
    className: 'w-full h-[400px]',
  },
  play: async ({ canvasElement }) => {
    
    // コンポーネントがレンダリングされるまで待つ
    await waitFor(() => {
      const videos = canvasElement.querySelectorAll('video');
      expect(videos.length).toBeGreaterThan(0);
    });
    
    // 再生ボタンが表示されていることを確認
    await waitFor(() => {
      const playButton = canvasElement.querySelector('button svg.lucide-play');
      expect(playButton).toBeInTheDocument();
    });
    
    // リスタートボタンが表示されていることを確認
    await waitFor(() => {
      const restartButton = canvasElement.querySelector('button svg.lucide-rotate-ccw');
      expect(restartButton).toBeInTheDocument();
    });
    
    // タイムスタンプが表示されていることを確認
    await waitFor(() => {
      const timeDisplay = canvasElement.querySelector('.text-sm');
      expect(timeDisplay).toHaveTextContent('0:00 / 0:00');
    });
  },
};

export const WithTitle: Story = {
  args: {
    src: sampleVideoUrl,
    title: 'ゴルフスイング解析',
    className: 'w-full h-[400px]',
  },
  play: async ({ canvasElement }) => {
    
    // タイトルが表示されていることを確認
    await waitFor(() => {
      const titleElement = canvasElement.querySelector('h3');
      expect(titleElement).toHaveTextContent('ゴルフスイング解析');
    });
  },
};

export const PlayPauseInteraction: Story = {
  args: {
    src: sampleVideoUrl,
    className: 'w-full h-[400px]',
  },
  play: async ({ canvasElement }) => {
    
    // コンポーネントがレンダリングされるまで待つ
    await waitFor(() => {
      const video = canvasElement.querySelector('video');
      expect(video).toBeInTheDocument();
    });
    
    // 初期状態では再生ボタンが表示されている
    await waitFor(() => {
      const playIcon = canvasElement.querySelector('button svg.lucide-play');
      expect(playIcon).toBeInTheDocument();
    });
    
    // 再生ボタンをクリック
    const playIcon = canvasElement.querySelector('button svg.lucide-play');
    const playButton = playIcon?.closest('button');
    if (playButton) await userEvent.click(playButton);
    
    // 一時停止ボタンに切り替わることを確認
    await waitFor(() => {
      const pauseIcon = canvasElement.querySelector('button svg.lucide-pause');
      expect(pauseIcon).toBeInTheDocument();
    });
    
    // 一時停止ボタンをクリック
    const pauseIcon = canvasElement.querySelector('button svg.lucide-pause');
    const pauseButton = pauseIcon?.closest('button');
    if (pauseButton) await userEvent.click(pauseButton);
    
    // 再生ボタンに戻ることを確認
    await waitFor(() => {
      const playIconAgain = canvasElement.querySelector('button svg.lucide-play');
      expect(playIconAgain).toBeInTheDocument();
    });
  },
};

export const RestartInteraction: Story = {
  args: {
    src: sampleVideoUrl,
    className: 'w-full h-[400px]',
  },
  play: async ({ canvasElement }) => {
    
    // コンポーネントがレンダリングされるまで待つ
    await waitFor(() => {
      const video = canvasElement.querySelector('video');
      expect(video).toBeInTheDocument();
    });
    
    // ビデオ要素を取得
    const video = canvasElement.querySelector('video') as HTMLVideoElement;
    
    // 再生ボタンをクリックして動画を開始
    const playIcon = canvasElement.querySelector('button svg.lucide-play');
    const playButton = playIcon?.closest('button');
    if (playButton) await userEvent.click(playButton);
    
    // 動画が再生されていることを確認
    await waitFor(() => {
      expect(video.paused).toBe(false);
    });
    
    // リスタートボタンをクリック
    const restartIcon = canvasElement.querySelector('button svg.lucide-rotate-ccw');
    const restartButton = restartIcon?.closest('button');
    if (restartButton) await userEvent.click(restartButton);
    
    // 動画が最初から再生されることを確認
    await waitFor(() => {
      expect(video.currentTime).toBe(0);
      expect(video.paused).toBe(false);
    });
  },
};

export const ProgressBarInteraction: Story = {
  args: {
    src: sampleVideoUrl,
    className: 'w-full h-[400px]',
  },
  play: async ({ canvasElement }) => {
    
    // コンポーネントがレンダリングされるまで待つ
    await waitFor(() => {
      const video = canvasElement.querySelector('video');
      expect(video).toBeInTheDocument();
    });
    
    // プログレスバーが存在することを確認
    const progressBar = canvas.getByRole('progressbar', { hidden: true });
    await expect(progressBar).toBeInTheDocument();
    
    // ビデオのメタデータが読み込まれるまで待つ
    await waitFor(() => {
      const timeDisplay = canvas.getByText(/\d:\d{2} \/ \d:\d{2}/);
      expect(timeDisplay).toBeInTheDocument();
    }, { timeout: 5000 });
    
    // プログレスバーをクリックしてシーク
    const progressContainer = progressBar.parentElement;
    if (progressContainer) {
      // プログレスバーの中央をクリック
      await userEvent.click(progressContainer);
      
      // ビデオの再生位置が変更されたことを確認
      const video = canvas.getByRole('application') as HTMLVideoElement;
      await waitFor(() => {
        expect(video.currentTime).toBeGreaterThan(0);
      });
    }
  },
};

export const MobileOptimized: Story = {
  args: {
    src: sampleVideoUrl,
    title: 'モバイル最適化',
    className: 'w-full h-[300px] sm:h-[400px]',
  },
  play: async ({ canvasElement }) => {
    
    // コンポーネントがレンダリングされるまで待つ
    await waitFor(() => {
      const video = canvasElement.querySelector('video');
      expect(video).toBeInTheDocument();
    });
    
    // モバイル向けの属性が設定されていることを確認
    const video = canvasElement.querySelector('video') as HTMLVideoElement;
    await expect(video).toHaveAttribute('playsinline');
    await expect(video).toHaveAttribute('webkit-playsinline', 'true');
    
    // コントロールが適切なサイズで表示されていることを確認
    const playIcon = canvasElement.querySelector('button svg.lucide-play');
    await expect(playIcon).toHaveClass('h-6', 'w-6');
    
    const restartIcon = canvasElement.querySelector('button svg.lucide-rotate-ccw');
    await expect(restartIcon).toHaveClass('h-5', 'w-5');
  },
};

export const ComparisonMode: Story = {
  args: {
    src: sampleVideoUrl,
    modelSrc: sampleVideoUrl, // 実際のプロジェクトではお手本動画のURLを使用
    title: 'スイング比較',
    className: 'w-full h-[400px]',
    enableComparison: true,
  },
  play: async ({ canvasElement }) => {
    
    // 比較モードのUIが表示されていることを確認
    await waitFor(() => {
      const userText = Array.from(canvasElement.querySelectorAll('span')).find(el => el.textContent === 'あなた');
      expect(userText).toBeInTheDocument();
    });
    
    await waitFor(() => {
      const modelText = Array.from(canvasElement.querySelectorAll('span')).find(el => el.textContent === 'お手本');
      expect(modelText).toBeInTheDocument();
    });
    
    // ユーザーの動画がアクティブ（青色）であることを確認
    const userText = Array.from(canvasElement.querySelectorAll('span')).find(el => el.textContent === 'あなた');
    const userLabel = userText?.parentElement;
    await expect(userLabel).toHaveClass('bg-blue-600');
    
    // お手本の動画が非アクティブ（グレー）であることを確認
    const modelText = Array.from(canvasElement.querySelectorAll('span')).find(el => el.textContent === 'お手本');
    const modelLabel = modelText?.parentElement;
    await expect(modelLabel).toHaveClass('bg-white/20');
    
    // 左右のナビゲーションボタンが表示されていることを確認
    const leftButton = canvasElement.querySelector('button svg.lucide-chevron-left')?.closest('button');
    const rightButton = canvasElement.querySelector('button svg.lucide-chevron-right')?.closest('button');
    await expect(leftButton).toBeInTheDocument();
    await expect(rightButton).toBeInTheDocument();
    
    // 左ボタンが無効化されていることを確認（最初はユーザー動画）
    await expect(leftButton).toBeDisabled();
  },
};

export const ComparisonSwipe: Story = {
  args: {
    src: sampleVideoUrl,
    modelSrc: sampleVideoUrl,
    title: 'スワイプテスト',
    className: 'w-full h-[400px]',
    enableComparison: true,
  },
  play: async ({ canvasElement }) => {
    
    // 初期状態を確認
    await waitFor(() => {
      const userText = Array.from(canvasElement.querySelectorAll('span')).find(el => el.textContent === 'あなた');
      const userLabel = userText?.parentElement;
      expect(userLabel).toHaveClass('bg-blue-600');
    });
    
    // 右矢印ボタンをクリックしてお手本に切り替え
    const rightButton = canvasElement.querySelector('button svg.lucide-chevron-right')?.closest('button');
    if (rightButton) await userEvent.click(rightButton);
    
    // お手本がアクティブになったことを確認
    await waitFor(() => {
      const modelText = Array.from(canvasElement.querySelectorAll('span')).find(el => el.textContent === 'お手本');
      const modelLabel = modelText?.parentElement;
      expect(modelLabel).toHaveClass('bg-green-600');
    });
    
    // ユーザーが非アクティブになったことを確認
    await waitFor(() => {
      const userText = Array.from(canvasElement.querySelectorAll('span')).find(el => el.textContent === 'あなた');
      const userLabel = userText?.parentElement;
      expect(userLabel).toHaveClass('bg-white/20');
    });
    
    // 左矢印ボタンをクリックしてユーザーに戻る
    const leftButton = canvasElement.querySelector('button svg.lucide-chevron-left')?.closest('button');
    if (leftButton) await userEvent.click(leftButton);
    
    // ユーザーがアクティブに戻ったことを確認
    await waitFor(() => {
      const userText = Array.from(canvasElement.querySelectorAll('span')).find(el => el.textContent === 'あなた');
      const userLabel = userText?.parentElement;
      expect(userLabel).toHaveClass('bg-blue-600');
    });
  },
};

export const ComparisonTouchSwipe: Story = {
  args: {
    src: sampleVideoUrl,
    modelSrc: sampleVideoUrl,
    title: 'タッチスワイプ',
    className: 'w-full h-[400px]',
    enableComparison: true,
  },
  play: async ({ canvasElement }) => {
    const container = canvasElement.querySelector('.relative.bg-black');
    
    if (!container) return;
    
    // 初期状態を確認
    await waitFor(() => {
      const userText = Array.from(canvasElement.querySelectorAll('span')).find(el => el.textContent === 'あなた');
      const userLabel = userText?.parentElement;
      expect(userLabel).toHaveClass('bg-blue-600');
    });
    
    // 左スワイプをシミュレート（お手本に切り替え）
    fireEvent.touchStart(container, {
      touches: [{ clientX: 200, clientY: 200 }],
    });
    fireEvent.touchMove(container, {
      touches: [{ clientX: 100, clientY: 200 }],
    });
    fireEvent.touchEnd(container, {});
    
    // お手本がアクティブになったことを確認
    await waitFor(() => {
      const modelText = Array.from(canvasElement.querySelectorAll('span')).find(el => el.textContent === 'お手本');
      const modelLabel = modelText?.parentElement;
      expect(modelLabel).toHaveClass('bg-green-600');
    });
    
    // 右スワイプをシミュレート（ユーザーに戻る）
    fireEvent.touchStart(container, {
      touches: [{ clientX: 100, clientY: 200 }],
    });
    fireEvent.touchMove(container, {
      touches: [{ clientX: 200, clientY: 200 }],
    });
    fireEvent.touchEnd(container, {});
    
    // ユーザーがアクティブに戻ったことを確認
    await waitFor(() => {
      const userText = Array.from(canvasElement.querySelectorAll('span')).find(el => el.textContent === 'あなた');
      const userLabel = userText?.parentElement;
      expect(userLabel).toHaveClass('bg-blue-600');
    });
  },
};

export const ComparisonVideoSync: Story = {
  args: {
    src: sampleVideoUrl,
    modelSrc: sampleVideoUrl,
    title: '動画同期',
    className: 'w-full h-[400px]',
    enableComparison: true,
  },
  play: async ({ canvasElement }) => {
    
    // 再生ボタンをクリック
    const playIcon = canvasElement.querySelector('button svg.lucide-play');
    const playButton = playIcon?.closest('button');
    if (playButton) await userEvent.click(playButton);
    
    // 動画が再生されていることを確認
    await waitFor(() => {
      const pauseIcon = canvasElement.querySelector('button svg.lucide-pause');
      expect(pauseIcon).toBeInTheDocument();
    });
    
    // お手本に切り替え
    const rightButton = canvasElement.querySelector('button svg.lucide-chevron-right')?.closest('button');
    if (rightButton) await userEvent.click(rightButton);
    
    // お手本も再生されていることを確認（同期されている）
    await waitFor(() => {
      const pauseButton = canvas.getByRole('button', { name: /pause/i });
      expect(pauseButton).toBeInTheDocument();
    });
    
    // 一時停止
    const pauseIcon = canvasElement.querySelector('button svg.lucide-pause');
    const pauseButton = pauseIcon?.closest('button');
    if (pauseButton) await userEvent.click(pauseButton);
    
    // 両方の動画が停止していることを確認
    await waitFor(() => {
      const playIconAgain = canvasElement.querySelector('button svg.lucide-play');
      expect(playIconAgain).toBeInTheDocument();
    });
  },
};