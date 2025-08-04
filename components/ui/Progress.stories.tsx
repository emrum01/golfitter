import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor } from 'storybook/test';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';

const meta = {
  title: 'UI/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 33,
  },
  play: async ({ canvas }) => {
    const progressRoot = canvas.getByRole('progressbar');
    const progressIndicator = progressRoot.querySelector('.bg-primary');
    
    await expect(progressRoot).toBeInTheDocument();
    await expect(progressIndicator).toBeInTheDocument();
    await expect(progressIndicator).toHaveStyle({ transform: 'translateX(-67%)' });
  },
};

export const Empty: Story = {
  args: {
    value: 0,
  },
  play: async ({ canvas }) => {
    const progressRoot = canvas.getByRole('progressbar');
    const progressIndicator = progressRoot.querySelector('.bg-primary');
    
    await expect(progressIndicator).toHaveStyle({ transform: 'translateX(-100%)' });
  },
};

export const Half: Story = {
  args: {
    value: 50,
  },
  play: async ({ canvas }) => {
    const progressRoot = canvas.getByRole('progressbar');
    const progressIndicator = progressRoot.querySelector('.bg-primary');
    
    await expect(progressIndicator).toHaveStyle({ transform: 'translateX(-50%)' });
  },
};

export const Full: Story = {
  args: {
    value: 100,
  },
  play: async ({ canvas }) => {
    const progressRoot = canvas.getByRole('progressbar');
    const progressIndicator = progressRoot.querySelector('.bg-primary');
    
    await expect(progressIndicator).toHaveStyle({ transform: 'translateX(0%)' });
  },
};

export const CustomClass: Story = {
  args: {
    value: 75,
    className: 'custom-progress-class',
  },
  play: async ({ canvas }) => {
    const progressRoot = canvas.getByRole('progressbar');
    await expect(progressRoot).toHaveClass('custom-progress-class');
  },
};

export const DefaultStyles: Story = {
  args: {
    value: 60,
  },
  play: async ({ canvas }) => {
    const progressRoot = canvas.getByRole('progressbar');
    const progressIndicator = progressRoot.querySelector('.bg-primary');
    
    // ルート要素のスタイル確認
    await expect(progressRoot).toHaveClass(/relative/);
    await expect(progressRoot).toHaveClass(/h-4/);
    await expect(progressRoot).toHaveClass(/w-full/);
    await expect(progressRoot).toHaveClass(/overflow-hidden/);
    await expect(progressRoot).toHaveClass(/rounded-full/);
    await expect(progressRoot).toHaveClass(/bg-secondary/);
    
    // インジケーターのスタイル確認
    await expect(progressIndicator).toHaveClass(/h-full/);
    await expect(progressIndicator).toHaveClass(/w-full/);
    await expect(progressIndicator).toHaveClass(/flex-1/);
    await expect(progressIndicator).toHaveClass(/bg-primary/);
    await expect(progressIndicator).toHaveClass(/transition-all/);
  },
};

export const Animated: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
      const timer = setTimeout(() => setProgress(66), 100);
      return () => clearTimeout(timer);
    }, []);
    
    return <Progress value={progress} className="w-[60%]" />;
  },
  play: async ({ canvas }) => {
    const progressRoot = canvas.getByRole('progressbar');
    const progressIndicator = progressRoot.querySelector('.bg-primary');
    
    // 初期状態
    await expect(progressRoot).toBeInTheDocument();
    
    // アニメーション後の状態を待つ
    await waitFor(() => {
      expect(progressIndicator).toHaveStyle({ transform: 'translateX(-34%)' });
    }, { timeout: 1000 });
    
    // トランジションクラスの確認
    await expect(progressIndicator).toHaveClass(/transition-all/);
  },
};

export const CustomWidth: Story = {
  render: () => (
    <div className="w-[300px]">
      <Progress value={40} />
    </div>
  ),
  play: async ({ canvas }) => {
    const progressRoot = canvas.getByRole('progressbar');
    
    await expect(progressRoot).toBeInTheDocument();
    await expect(progressRoot).toHaveClass(/w-full/);
    await expect(progressRoot.parentElement).toHaveClass('w-[300px]');
  },
};

export const NullValue: Story = {
  args: {
    value: null,
  },
  play: async ({ canvas }) => {
    const progressRoot = canvas.getByRole('progressbar');
    const progressIndicator = progressRoot.querySelector('.bg-primary');
    
    // null値の場合、0として扱われることを確認
    await expect(progressIndicator).toHaveStyle({ transform: 'translateX(-100%)' });
  },
};

export const OutOfBoundsValues: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm mb-2">Negative value (-20)</p>
        <Progress value={-20} />
      </div>
      <div>
        <p className="text-sm mb-2">Over 100 (120)</p>
        <Progress value={120} />
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    const progressBars = canvas.getAllByRole('progressbar');
    
    // 負の値は0にクランプされる
    const firstIndicator = progressBars[0].querySelector('.bg-primary');
    await expect(firstIndicator).toHaveStyle({ transform: 'translateX(-100%)' });
    
    // 100を超える値は100にクランプされる
    const secondIndicator = progressBars[1].querySelector('.bg-primary');
    await expect(secondIndicator).toHaveStyle({ transform: 'translateX(0%)' });
  },
};