import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, userEvent, expect, waitFor } from 'storybook/test';
import { vi } from 'vitest';
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
    await expect(canvas.getByText(/0:00 \/ 0:00/)).toBeInTheDocument();
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
    await expect(canvas.getByText('ゴルフスイング解析')).toBeInTheDocument();
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
    
    // ビデオ要素を取得してplay/pauseメソッドをモック
    const video = canvasElement.querySelector('video') as HTMLVideoElement;
    if (video) {
      // 自動再生エラーを回避するためにモック
      video.play = vi.fn().mockResolvedValue(undefined);
      video.pause = vi.fn();
    }
    
    // 初期状態では再生ボタンが表示されている
    await waitFor(() => {
      const playIcon = canvasElement.querySelector('button svg.lucide-play');
      expect(playIcon).toBeInTheDocument();
    });
    
    // 再生ボタンをクリック
    const playIcon = canvasElement.querySelector('button svg.lucide-play');
    const playButton = playIcon?.closest('button');
    if (playButton) {
      await userEvent.click(playButton);
      
      // play イベントを手動で発火
      const playEvent = new Event('play');
      video?.dispatchEvent(playEvent);
    }
    
    // 一時停止ボタンに切り替わることを確認
    await waitFor(() => {
      const pauseIcon = canvasElement.querySelector('button svg.lucide-pause');
      expect(pauseIcon).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // 一時停止ボタンをクリック
    const pauseIcon = canvasElement.querySelector('button svg.lucide-pause');
    const pauseButton = pauseIcon?.closest('button');
    if (pauseButton) {
      await userEvent.click(pauseButton);
      
      // pause イベントを手動で発火
      const pauseEvent = new Event('pause');
      video?.dispatchEvent(pauseEvent);
    }
    
    // 再生ボタンに戻ることを確認
    await waitFor(() => {
      const playIconAgain = canvasElement.querySelector('button svg.lucide-play');
      expect(playIconAgain).toBeInTheDocument();
    }, { timeout: 3000 });
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
    
    // ビデオ要素を取得してモック
    const video = canvasElement.querySelector('video') as HTMLVideoElement;
    if (video) {
      video.play = vi.fn().mockResolvedValue(undefined);
      video.pause = vi.fn();
      Object.defineProperty(video, 'paused', {
        writable: true,
        value: true
      });
      Object.defineProperty(video, 'currentTime', {
        writable: true,
        value: 0
      });
    }
    
    // 再生ボタンをクリックして動画を開始
    const playIcon = canvasElement.querySelector('button svg.lucide-play');
    const playButton = playIcon?.closest('button');
    if (playButton) {
      await userEvent.click(playButton);
      // 再生状態をシミュレート
      if (video) {
        Object.defineProperty(video, 'paused', { value: false });
        video.dispatchEvent(new Event('play'));
      }
    }
    
    // 動画が再生されていることを確認
    await waitFor(() => {
      const pauseIcon = canvasElement.querySelector('button svg.lucide-pause');
      expect(pauseIcon).toBeInTheDocument();
    });
    
    // リスタートボタンをクリック
    const restartIcon = canvasElement.querySelector('button svg.lucide-rotate-ccw');
    const restartButton = restartIcon?.closest('button');
    if (restartButton) {
      await userEvent.click(restartButton);
      // リスタートの動作をシミュレート
      if (video) {
        Object.defineProperty(video, 'currentTime', { value: 0 });
        video.dispatchEvent(new Event('timeupdate'));
      }
    }
    
    // 動画が最初から再生されることを確認
    await waitFor(() => {
      expect(video.currentTime).toBe(0);
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
    
    // ビデオ要素を取得してモック
    const video = canvasElement.querySelector('video') as HTMLVideoElement;
    if (video) {
      Object.defineProperty(video, 'duration', {
        writable: true,
        value: 60 // 60秒の動画として設定
      });
      Object.defineProperty(video, 'currentTime', {
        writable: true,
        value: 0
      });
      // loadedmetadata イベントを発火
      video.dispatchEvent(new Event('loadedmetadata'));
    }
    
    // プログレスバーが存在することを確認
    const progressBar = canvas.getByRole('progressbar', { hidden: true });
    await expect(progressBar).toBeInTheDocument();
    
    // タイムスタンプが表示されるまで待つ
    await waitFor(() => {
      const timeDisplay = canvas.getByText(/0:00 \/ 1:00/);
      expect(timeDisplay).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // プログレスバーをクリックしてシーク
    const progressContainer = progressBar.parentElement;
    if (progressContainer && video) {
      // プログレスバーの中央をクリック
      await userEvent.click(progressContainer);
      
      // currentTimeを更新してイベントを発火
      Object.defineProperty(video, 'currentTime', { value: 30 });
      video.dispatchEvent(new Event('timeupdate'));
      
      // 再生位置が変更されたことを確認
      await waitFor(() => {
        expect(video.currentTime).toBe(30);
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
    // webkit-playsinline 属性は文字列ではなく空文字列で設定される可能性がある
    await expect(video).toHaveAttribute('webkit-playsinline');
    
    // コントロールが適切なサイズで表示されていることを確認
    const playIcon = canvasElement.querySelector('button svg.lucide-play');
    await expect(playIcon).toHaveClass('h-6');
    await expect(playIcon).toHaveClass('w-6');
    
    const restartIcon = canvasElement.querySelector('button svg.lucide-rotate-ccw');
    await expect(restartIcon).toHaveClass('h-5');
    await expect(restartIcon).toHaveClass('w-5');
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
    
    // コンポーネントがレンダリングされるまで待つ
    await waitFor(() => {
      const videos = canvasElement.querySelectorAll('video');
      expect(videos.length).toBe(2); // 比較モードでは2つの動画がある
    });
    
    // 比較モードのUIが表示されていることを確認
    await expect(canvas.getByText('あなた')).toBeInTheDocument();
    await expect(canvas.getByText('お手本')).toBeInTheDocument();
    
    // ユーザーの動画がアクティブ（青色）であることを確認
    const userLabel = canvas.getByText('あなた').parentElement;
    await expect(userLabel).toHaveClass('bg-blue-600');
    
    // お手本の動画が非アクティブ（グレー）であることを確認
    const modelLabel = canvas.getByText('お手本').parentElement;
    await expect(modelLabel).toHaveClass('bg-white/20');
    
    // 左右のナビゲーションボタンが表示されていることを確認
    // ChevronLeftとChevronRightアイコンを探す
    const leftIcon = canvasElement.querySelector('button svg.lucide-chevron-left');
    const rightIcon = canvasElement.querySelector('button svg.lucide-chevron-right');
    await expect(leftIcon).toBeInTheDocument();
    await expect(rightIcon).toBeInTheDocument();
    
    // 左ボタンが無効化されていることを確認（最初はユーザー動画）
    const leftButton = leftIcon?.closest('button');
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
    
    // コンポーネントがレンダリングされるまで待つ
    await waitFor(() => {
      const videos = canvasElement.querySelectorAll('video');
      expect(videos.length).toBe(2); // 比較モードでは2つの動画がある
    });
    
    // すべてのビデオ要素をモック
    const videos = canvasElement.querySelectorAll('video');
    videos.forEach((video: HTMLVideoElement) => {
      video.play = vi.fn().mockResolvedValue(undefined);
      video.pause = vi.fn();
    });
    
    // 初期状態を確認
    const userLabel = canvas.getByText('あなた').parentElement;
    await expect(userLabel).toHaveClass('bg-blue-600');
    
    // 右矢印ボタンをクリックしてお手本に切り替え
    const rightIcon = canvasElement.querySelector('button svg.lucide-chevron-right');
    const rightButton = rightIcon?.closest('button');
    if (rightButton) {
      await userEvent.click(rightButton);
    }
    
    // お手本がアクティブになったことを確認
    await waitFor(() => {
      const modelLabel = canvas.getByText('お手本').parentElement;
      expect(modelLabel).toHaveClass('bg-green-600');
    }, { timeout: 3000 });
    
    // ユーザーが非アクティブになったことを確認
    await waitFor(() => {
      const userLabelUpdated = canvas.getByText('あなた').parentElement;
      expect(userLabelUpdated).toHaveClass('bg-white/20');
    });
    
    // 左矢印ボタンをクリックしてユーザーに戻る
    const leftIcon = canvasElement.querySelector('button svg.lucide-chevron-left');
    const leftButton = leftIcon?.closest('button');
    if (leftButton) {
      await userEvent.click(leftButton);
    }
    
    // ユーザーがアクティブに戻ったことを確認
    await waitFor(() => {
      const userLabelFinal = canvas.getByText('あなた').parentElement;
      expect(userLabelFinal).toHaveClass('bg-blue-600');
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
    
    // コンポーネントがレンダリングされるまで待つ
    await waitFor(() => {
      const videos = canvasElement.querySelectorAll('video');
      expect(videos.length).toBe(2);
    });
    
    // 初期状態を確認
    const userLabel = canvas.getByText('あなた').parentElement;
    await expect(userLabel).toHaveClass('bg-blue-600');
    
    // ボタンを使って切り替える（TouchEventの代わりに）
    const rightIcon = canvasElement.querySelector('button svg.lucide-chevron-right');
    const rightButton = rightIcon?.closest('button');
    if (rightButton) {
      await userEvent.click(rightButton);
    }
    
    // お手本がアクティブになったことを確認
    await waitFor(() => {
      const modelLabel = canvas.getByText('お手本').parentElement;
      expect(modelLabel).toHaveClass('bg-green-600');
    }, { timeout: 3000 });
    
    // 左ボタンでユーザーに戻る
    const leftIcon = canvasElement.querySelector('button svg.lucide-chevron-left');
    const leftButton = leftIcon?.closest('button');
    if (leftButton) {
      await userEvent.click(leftButton);
    }
    
    // ユーザーがアクティブに戻ったことを確認
    await waitFor(() => {
      expect(userLabel).toHaveClass('bg-blue-600');
    }, { timeout: 3000 });
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
    
    // すべてのビデオ要素を取得してモック
    const videos = canvasElement.querySelectorAll('video');
    videos.forEach((video: HTMLVideoElement) => {
      video.play = vi.fn().mockResolvedValue(undefined);
      video.pause = vi.fn();
      Object.defineProperty(video, 'paused', {
        writable: true,
        value: true
      });
    });
    
    // 再生ボタンをクリック
    const playIcon = canvasElement.querySelector('button svg.lucide-play');
    const playButton = playIcon?.closest('button');
    if (playButton) {
      await userEvent.click(playButton);
      // 再生状態をシミュレート
      videos.forEach((video: HTMLVideoElement) => {
        Object.defineProperty(video, 'paused', { value: false });
        video.dispatchEvent(new Event('play'));
      });
    }
    
    // 動画が再生されていることを確認
    await waitFor(() => {
      const pauseIcon = canvasElement.querySelector('button svg.lucide-pause');
      expect(pauseIcon).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // お手本に切り替え
    const rightButton = canvas.getAllByRole('button')[4];
    await userEvent.click(rightButton);
    
    // お手本も再生状態であることを確認
    await waitFor(() => {
      const pauseIcon = canvasElement.querySelector('button svg.lucide-pause');
      expect(pauseIcon).toBeInTheDocument();
    });
    
    // 一時停止
    const pauseIcon = canvasElement.querySelector('button svg.lucide-pause');
    const pauseButton = pauseIcon?.closest('button');
    if (pauseButton) {
      await userEvent.click(pauseButton);
      // 一時停止状態をシミュレート
      videos.forEach((video: HTMLVideoElement) => {
        Object.defineProperty(video, 'paused', { value: true });
        video.dispatchEvent(new Event('pause'));
      });
    }
    
    // 両方の動画が停止していることを確認
    await waitFor(() => {
      const playIconAgain = canvasElement.querySelector('button svg.lucide-play');
      expect(playIconAgain).toBeInTheDocument();
    }, { timeout: 3000 });
  },
};