import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import SwingAnalysisPage from './SwingAnalysisPage';

const meta = {
  title: 'Pages/SwingAnalysis/Page',
  component: SwingAnalysisPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/swing-analysis',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SwingAnalysisPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    // ページ全体のレンダリング確認
    const heading = canvas.getByRole('heading', { name: 'スイング分析' });
    await expect(heading).toBeInTheDocument();
    
    // ページの説明文
    const description = canvas.getByText('あなたのスイング動画をAIが詳細分析します');
    await expect(description).toBeInTheDocument();
  },
};

export const PageStructure: Story = {
  play: async ({ canvas }) => {
    // グラデーション背景の確認
    const pageContainer = canvas.getByRole('heading', { name: 'スイング分析' }).closest('.min-h-screen');
    await expect(pageContainer).toHaveClass('bg-gradient-to-br', 'from-blue-50', 'to-purple-50');
    
    // コンテンツの最大幅確認
    const contentContainer = canvas.getByRole('heading', { name: 'スイング分析' }).closest('.max-w-6xl');
    await expect(contentContainer).toBeInTheDocument();
  },
};

export const VideoUploadSection: Story = {
  play: async ({ canvas }) => {
    // 動画アップロードカードの確認
    const uploadCard = canvas.getByText('スイング動画アップロード').closest('[data-slot="card"]');
    await expect(uploadCard).toBeInTheDocument();
    
    // アップロードエリアの確認
    const uploadArea = canvas.getByText('動画をアップロード');
    await expect(uploadArea).toBeInTheDocument();
  },
};

export const NavigationFlow: Story = {
  play: async ({ canvas }) => {
    // ホームへ戻るボタンの確認
    const homeButton = canvas.getByRole('button', { name: 'ホームに戻る' });
    await expect(homeButton).toBeInTheDocument();
    
    // 動画管理ページへのリンク
    const videoManagementLink = canvas.getByText('動画管理ページへ');
    await expect(videoManagementLink).toBeInTheDocument();
  },
};

export const ResponsiveDesign: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  play: async ({ canvas }) => {
    // モバイルでの表示確認
    const heading = canvas.getByRole('heading', { name: 'スイング分析' });
    await expect(heading).toBeInTheDocument();
    
    // グリッドレイアウトの確認
    const gridContainer = canvas.getByText('スイング動画アップロード').closest('.grid');
    await expect(gridContainer).toBeInTheDocument();
  },
};

export const EmptyState: Story = {
  play: async ({ canvas }) => {
    // 初期状態（動画未アップロード）の確認
    const uploadPrompt = canvas.getByText('動画をアップロード');
    await expect(uploadPrompt).toBeInTheDocument();
    
    // AI分析開始ボタンが存在しないことを確認
    const analyzeButton = canvas.queryByRole('button', { name: 'AI分析開始' });
    await expect(analyzeButton).not.toBeInTheDocument();
  },
};

export const FullPageIntegration: Story = {
  play: async ({ canvas }) => {
    // ページ全体の統合テスト
    // ヘッダー
    const heading = canvas.getByRole('heading', { name: 'スイング分析' });
    await expect(heading).toBeInTheDocument();
    
    // 説明文
    const description = canvas.getByText('あなたのスイング動画をAIが詳細分析します');
    await expect(description).toBeInTheDocument();
    
    // アップロードカード
    const uploadCard = canvas.getByText('スイング動画アップロード');
    await expect(uploadCard).toBeInTheDocument();
    
    // フッター部分のボタン
    const homeButton = canvas.getByRole('button', { name: 'ホームに戻る' });
    await expect(homeButton).toBeInTheDocument();
  },
};