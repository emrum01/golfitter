import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent } from 'storybook/test';
import SwingAnalysis from './SwingAnalysis';

const meta = {
  title: 'Pages/SwingAnalysis/SwingAnalysis',
  component: SwingAnalysis,
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
} satisfies Meta<typeof SwingAnalysis>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    // ヘッダーの確認
    const heading = canvas.getByRole('heading', { name: 'スイング分析' });
    await expect(heading).toBeInTheDocument();
    
    // 動画アップロード領域の確認
    const uploadText = canvas.getByText('動画をアップロード');
    await expect(uploadText).toBeInTheDocument();
  },
};

export const BackButton: Story = {
  play: async ({ canvas }) => {
    // 戻るボタンの確認
    const backButton = canvas.getByRole('button', { name: 'ホームに戻る' });
    await expect(backButton).toBeInTheDocument();
    await expect(backButton).toBeEnabled();
  },
};

export const FileUploadArea: Story = {
  play: async ({ canvas }) => {
    // アップロードエリアの存在確認
    const uploadArea = canvas.getByText('動画をアップロード').closest('div');
    await expect(uploadArea).toBeInTheDocument();
    
    // ファイル形式の説明
    const formatText = canvas.getByText(/MP4, MOV, AVI形式対応/);
    await expect(formatText).toBeInTheDocument();
    
    // サイズ制限の説明
    const sizeText = canvas.getByText(/最大100MB/);
    await expect(sizeText).toBeInTheDocument();
  },
};

export const CardStructure: Story = {
  play: async ({ canvas }) => {
    // カードヘッダーの確認
    const cardTitle = canvas.getByText('スイング動画アップロード');
    await expect(cardTitle).toBeInTheDocument();
    
    const cardDescription = canvas.getByText(/正面または側面からのスイング動画をアップロードしてください/);
    await expect(cardDescription).toBeInTheDocument();
  },
};

export const UIComponents: Story = {
  play: async ({ canvas }) => {
    // Buttonコンポーネントの確認
    const button = canvas.getByRole('button', { name: 'ホームに戻る' });
    await expect(button).toHaveAttribute('data-slot', 'button');
    
    // Cardコンポーネントの確認
    const cardTitle = canvas.getByText('スイング動画アップロード');
    const card = cardTitle.closest('[data-slot="card"]');
    await expect(card).toBeInTheDocument();
  },
};

export const ResponsiveLayout: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  play: async ({ canvas }) => {
    // モバイルビューでの表示確認
    const heading = canvas.getByRole('heading', { name: 'スイング分析' });
    await expect(heading).toBeInTheDocument();
    
    // カードが存在することを確認
    const card = canvas.getByText('スイング動画アップロード').closest('[data-slot="card"]');
    await expect(card).toBeInTheDocument();
  },
};

export const VideoManagementLink: Story = {
  play: async ({ canvas }) => {
    // 動画管理ページへのリンクを確認
    const managementLink = canvas.getByText('動画管理ページへ');
    await expect(managementLink).toBeInTheDocument();
  },
};

export const ProNameDisplay: Story = {
  play: async ({ canvas }) => {
    // デフォルトのプロ名（田中 太郎）が表示されることを確認
    const defaultProName = canvas.getByText(/田中 太郎/);
    await expect(defaultProName).toBeInTheDocument();
  },
};