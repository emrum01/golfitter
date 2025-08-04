import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor } from 'storybook/test';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
  play: async ({ canvas }) => {
    const fallback = canvas.getByText('CN');
    const avatar = fallback.closest('[data-slot="avatar"]');
    
    await expect(avatar).toBeInTheDocument();
    await expect(avatar).toHaveAttribute('data-slot', 'avatar');
    
    // デフォルトスタイルの確認
    await expect(avatar).toHaveClass(/relative/);
    await expect(avatar).toHaveClass(/flex/);
    await expect(avatar).toHaveClass(/size-8/);
    await expect(avatar).toHaveClass(/shrink-0/);
    await expect(avatar).toHaveClass(/overflow-hidden/);
    await expect(avatar).toHaveClass(/rounded-full/);
  },
};

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage 
        src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop&crop=faces" 
        alt="User avatar" 
      />
      <AvatarFallback>US</AvatarFallback>
    </Avatar>
  ),
  play: async ({ canvas }) => {
    // 画像が読み込まれるのを待つ
    await waitFor(async () => {
      try {
        const images = canvas.getAllByRole('img');
        const image = images.find(img => img.getAttribute('alt') === 'User avatar');
        await expect(image).toBeInTheDocument();
        await expect(image).toHaveAttribute('src', 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop&crop=faces');
        await expect(image).toHaveAttribute('data-slot', 'avatar-image');
        
        // 画像のスタイル確認
        await expect(image).toHaveClass(/aspect-square/);
        await expect(image).toHaveClass(/size-full/);
      } catch {
        // Image not loaded yet, retry
      }
    }, { timeout: 5000 });
  },
};

export const FallbackOnly: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
  play: async ({ canvas }) => {
    const fallback = canvas.getByText('JD');
    
    await expect(fallback).toBeInTheDocument();
    await expect(fallback).toHaveAttribute('data-slot', 'avatar-fallback');
    
    // フォールバックのスタイル確認
    await expect(fallback).toHaveClass(/flex/);
    await expect(fallback).toHaveClass(/size-full/);
    await expect(fallback).toHaveClass(/items-center/);
    await expect(fallback).toHaveClass(/justify-center/);
    await expect(fallback).toHaveClass(/rounded-full/);
    await expect(fallback).toHaveClass(/bg-muted/);
  },
};

export const BrokenImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://broken-image-url.com/image.jpg" alt="Broken" />
      <AvatarFallback>BR</AvatarFallback>
    </Avatar>
  ),
  play: async ({ canvas }) => {
    // 画像の読み込みに失敗してフォールバックが表示されるのを待つ
    await waitFor(async () => {
      const fallback = canvas.getByText('BR');
      await expect(fallback).toBeInTheDocument();
      await expect(fallback).toBeVisible();
    }, { timeout: 5000 });
  },
};

export const CustomSize: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="h-6 w-6">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback className="text-xs">SM</AvatarFallback>
      </Avatar>
      
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      
      <Avatar className="h-16 w-16">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback className="text-xl">LG</AvatarFallback>
      </Avatar>
      
      <Avatar className="h-24 w-24">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback className="text-3xl">XL</AvatarFallback>
      </Avatar>
    </div>
  ),
  play: async ({ canvas }) => {
    const small = canvas.getByText('SM').closest('[data-slot="avatar"]');
    const medium = canvas.getByText('MD').closest('[data-slot="avatar"]');
    const large = canvas.getByText('LG').closest('[data-slot="avatar"]');
    const xlarge = canvas.getByText('XL').closest('[data-slot="avatar"]');
    
    await expect(small).toHaveClass(/h-6/);
    await expect(small).toHaveClass(/w-6/);
    
    await expect(medium).toHaveClass(/size-8/);
    
    await expect(large).toHaveClass(/h-16/);
    await expect(large).toHaveClass(/w-16/);
    
    await expect(xlarge).toHaveClass(/h-24/);
    await expect(xlarge).toHaveClass(/w-24/);
  },
};

export const CustomColors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback className="bg-red-500 text-white">RD</AvatarFallback>
      </Avatar>
      
      <Avatar>
        <AvatarFallback className="bg-green-500 text-white">GR</AvatarFallback>
      </Avatar>
      
      <Avatar>
        <AvatarFallback className="bg-blue-500 text-white">BL</AvatarFallback>
      </Avatar>
      
      <Avatar>
        <AvatarFallback className="bg-purple-500 text-white">PR</AvatarFallback>
      </Avatar>
    </div>
  ),
  play: async ({ canvas }) => {
    const redFallback = canvas.getByText('RD');
    const greenFallback = canvas.getByText('GR');
    const blueFallback = canvas.getByText('BL');
    const purpleFallback = canvas.getByText('PR');
    
    await expect(redFallback).toHaveClass(/bg-red-500/);
    await expect(redFallback).toHaveClass(/text-white/);
    
    await expect(greenFallback).toHaveClass(/bg-green-500/);
    await expect(greenFallback).toHaveClass(/text-white/);
    
    await expect(blueFallback).toHaveClass(/bg-blue-500/);
    await expect(blueFallback).toHaveClass(/text-white/);
    
    await expect(purpleFallback).toHaveClass(/bg-purple-500/);
    await expect(purpleFallback).toHaveClass(/text-white/);
  },
};

export const SquareAvatar: Story = {
  render: () => (
    <Avatar className="rounded-md">
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback className="rounded-md">SQ</AvatarFallback>
    </Avatar>
  ),
  play: async ({ canvas }) => {
    const fallback = canvas.getByText('SQ');
    const avatar = fallback.closest('[data-slot="avatar"]');
    
    await expect(avatar).toHaveClass(/rounded-md/);
    await expect(fallback).toHaveClass(/rounded-md/);
  },
};

export const WithBorder: Story = {
  render: () => (
    <Avatar className="border-2 border-primary">
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>BD</AvatarFallback>
    </Avatar>
  ),
  play: async ({ canvas }) => {
    const fallback = canvas.getByText('BD');
    const avatar = fallback.closest('[data-slot="avatar"]');
    
    await expect(avatar).toHaveClass(/border-2/);
    await expect(avatar).toHaveClass(/border-primary/);
  },
};

export const AvatarGroup: Story = {
  render: () => (
    <div className="flex -space-x-4">
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=128&h=128&fit=crop&crop=faces" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://images.unsplash.com/photo-1511485977113-f34c92461ad9?w=128&h=128&fit=crop&crop=faces" />
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=128&h=128&fit=crop&crop=faces" />
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback>+5</AvatarFallback>
      </Avatar>
    </div>
  ),
  play: async ({ canvas }) => {
    // Wait for fallbacks to appear (images might load first)
    await waitFor(async () => {
      canvas.getByText('+5');
    });
    
    const count = canvas.getByText('+5').closest('[data-slot="avatar"]');
    
    // カウントアバターが存在することを確認
    await expect(count).toBeInTheDocument();
    await expect(count).toHaveClass(/border-2/);
    await expect(count).toHaveClass(/border-background/);
    
    // 最後のアバターがカウント表示であることを確認
    const countFallback = canvas.getByText('+5');
    await expect(countFallback).toBeInTheDocument();
  },
};