import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, waitFor } from '@storybook/test';
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
    title: {
      control: 'text',
      description: '動画のタイトル（オプション）',
    },
    className: {
      control: 'text',
      description: '追加のCSSクラス',
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
    const canvas = within(canvasElement);
    
    // ビデオ要素が存在することを確認
    const video = canvas.getByRole('application') as HTMLVideoElement;
    await expect(video).toBeInTheDocument();
    
    // 再生ボタンが表示されていることを確認
    const playButton = canvas.getByRole('button', { name: /play/i });
    await expect(playButton).toBeInTheDocument();
    
    // リスタートボタンが表示されていることを確認
    const restartButton = canvas.getByRole('button', { name: /rotate/i });
    await expect(restartButton).toBeInTheDocument();
    
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
    const canvas = within(canvasElement);
    
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
    const canvas = within(canvasElement);
    
    // 初期状態では再生ボタンが表示されている
    const playButton = canvas.getByRole('button', { name: /play/i });
    await expect(playButton).toBeInTheDocument();
    
    // 再生ボタンをクリック
    await userEvent.click(playButton);
    
    // 一時停止ボタンに切り替わることを確認
    await waitFor(() => {
      const pauseButton = canvas.getByRole('button', { name: /pause/i });
      expect(pauseButton).toBeInTheDocument();
    });
    
    // 一時停止ボタンをクリック
    const pauseButton = canvas.getByRole('button', { name: /pause/i });
    await userEvent.click(pauseButton);
    
    // 再生ボタンに戻ることを確認
    await waitFor(() => {
      expect(canvas.getByRole('button', { name: /play/i })).toBeInTheDocument();
    });
  },
};

export const RestartInteraction: Story = {
  args: {
    src: sampleVideoUrl,
    className: 'w-full h-[400px]',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // ビデオ要素を取得
    const video = canvas.getByRole('application') as HTMLVideoElement;
    
    // 再生ボタンをクリックして動画を開始
    const playButton = canvas.getByRole('button', { name: /play/i });
    await userEvent.click(playButton);
    
    // 動画が再生されていることを確認
    await waitFor(() => {
      expect(video.paused).toBe(false);
    });
    
    // リスタートボタンをクリック
    const restartButton = canvas.getByRole('button', { name: /rotate/i });
    await userEvent.click(restartButton);
    
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
    const canvas = within(canvasElement);
    
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
      const rect = progressContainer.getBoundingClientRect();
      await userEvent.click(progressContainer, {
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      });
      
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
    const canvas = within(canvasElement);
    
    // モバイル向けの属性が設定されていることを確認
    const video = canvas.getByRole('application') as HTMLVideoElement;
    await expect(video).toHaveAttribute('playsinline');
    await expect(video).toHaveAttribute('webkit-playsinline', 'true');
    
    // コントロールが適切なサイズで表示されていることを確認
    const playButton = canvas.getByRole('button', { name: /play/i });
    await expect(playButton).toHaveClass('h-6', 'w-6');
    
    const restartButton = canvas.getByRole('button', { name: /rotate/i });
    await expect(restartButton).toHaveClass('h-5', 'w-5');
  },
};