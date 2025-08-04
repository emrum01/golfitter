import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import Page from './page';

const meta = {
  title: 'Pages/SwingAnalysis/ServerPage',
  component: Page,
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
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    // サーバーコンポーネントのレンダリング確認
    const heading = canvas.getByRole('heading', { name: 'スイング分析' });
    await expect(heading).toBeInTheDocument();
  },
};

export const MetadataRendering: Story = {
  play: async ({ canvas }) => {
    // ページがレンダリングされることを確認
    // メタデータはStorybook内では直接テストできないが、
    // ページコンポーネントが正しくレンダリングされることを確認
    const pageContent = canvas.getByText('あなたのスイング動画をAIが詳細分析します');
    await expect(pageContent).toBeInTheDocument();
  },
};

export const ClientComponentIntegration: Story = {
  play: async ({ canvas }) => {
    // サーバーコンポーネントがクライアントコンポーネントを
    // 正しくレンダリングすることを確認
    const uploadCard = canvas.getByText('スイング動画アップロード');
    await expect(uploadCard).toBeInTheDocument();
    
    const homeButton = canvas.getByRole('button', { name: 'ホームに戻る' });
    await expect(homeButton).toBeInTheDocument();
  },
};

export const FullPageLoad: Story = {
  play: async ({ canvas }) => {
    // ページ全体が正しくロードされることを確認
    // ヘッダー部分
    const header = canvas.getByRole('heading', { level: 1 });
    await expect(header).toHaveTextContent('スイング分析');
    
    // 説明文
    const description = canvas.getByText(/AIが詳細分析/);
    await expect(description).toBeInTheDocument();
    
    // メインコンテンツ
    const mainContent = canvas.getByText('動画をアップロード');
    await expect(mainContent).toBeInTheDocument();
  },
};

export const PageAccessibility: Story = {
  play: async ({ canvas }) => {
    // アクセシビリティの基本的な確認
    // ランドマークの確認
    const main = canvas.getByRole('main');
    await expect(main).toBeInTheDocument();
    
    // ヘッディング階層の確認
    const h1 = canvas.getByRole('heading', { level: 1 });
    await expect(h1).toBeInTheDocument();
    
    // インタラクティブ要素の確認
    const buttons = canvas.getAllByRole('button');
    await expect(buttons.length).toBeGreaterThan(0);
  },
};