import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent } from 'storybook/test';
import SwingAnalysis from '@/components/swing-analysis';

const meta = {
  title: 'Features/SwingAnalysis',
  component: SwingAnalysis,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    onBack: { action: 'onBack' },
    matchedProName: { control: 'text' },
  },
} satisfies Meta<typeof SwingAnalysis>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onBack: () => {},
    matchedProName: '田中 太郎',
  },
  play: async ({ canvas }) => {
    // ヘッダーの確認
    const heading = canvas.getByRole('heading', { name: 'スイング分析' });
    await expect(heading).toBeInTheDocument();
    
    // 動画アップロード領域の確認
    const uploadText = canvas.getByText('動画をアップロード');
    await expect(uploadText).toBeInTheDocument();
  },
};

export const CustomProName: Story = {
  args: {
    onBack: () => {},
    matchedProName: '山田 花子',
  },
  play: async ({ canvas }) => {
    // プロ名が表示されることを確認
    const proName = canvas.getByText(/山田 花子/);
    await expect(proName).toBeInTheDocument();
  },
};

export const BackButton: Story = {
  args: {
    onBack: () => console.log('Back button clicked'),
  },
  play: async ({ canvas }) => {
    // 戻るボタンの確認
    const backButton = canvas.getByRole('button', { name: '診断結果に戻る' });
    await expect(backButton).toBeInTheDocument();
    await expect(backButton).toBeEnabled();
  },
};

export const FileUploadArea: Story = {
  args: {
    onBack: () => {},
  },
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
  args: {
    onBack: () => {},
  },
  play: async ({ canvas }) => {
    // カードヘッダーの確認
    const cardTitle = canvas.getByText('スイング動画アップロード');
    await expect(cardTitle).toBeInTheDocument();
    
    const cardDescription = canvas.getByText(/正面または側面からのスイング動画をアップロードしてください/);
    await expect(cardDescription).toBeInTheDocument();
  },
};

export const UIComponents: Story = {
  args: {
    onBack: () => {},
  },
  play: async ({ canvas }) => {
    // Buttonコンポーネントの確認
    const button = canvas.getByRole('button', { name: '診断結果に戻る' });
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
  args: {
    onBack: () => {},
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