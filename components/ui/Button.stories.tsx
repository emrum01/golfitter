import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    asChild: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Button' });
    
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveAttribute('data-slot', 'button');
    await expect(button).toHaveClass(/bg-primary/);
    await expect(button).toHaveClass(/text-primary-foreground/);
    await expect(button).toHaveClass(/shadow-xs/);
    await expect(button).toHaveClass(/hover:bg-primary\/90/);
  },
};

export const WithOnClick: Story = {
  args: {
    children: 'Click me',
    onClick: fn(),
  },
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: 'Click me' });
    
    await userEvent.click(button);
    await waitFor(() => expect(args.onClick).toHaveBeenCalledTimes(1));
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Delete' });
    
    await expect(button).toHaveClass(/bg-destructive/);
    await expect(button).toHaveClass(/text-white/);
    await expect(button).toHaveClass(/hover:bg-destructive\/90/);
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Outline' });
    
    await expect(button).toHaveClass(/border/);
    await expect(button).toHaveClass(/bg-background/);
    await expect(button).toHaveClass(/hover:bg-accent/);
    await expect(button).toHaveClass(/hover:text-accent-foreground/);
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Secondary' });
    
    await expect(button).toHaveClass(/bg-secondary/);
    await expect(button).toHaveClass(/text-secondary-foreground/);
    await expect(button).toHaveClass(/hover:bg-secondary\/80/);
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Ghost' });
    
    await expect(button).toHaveClass(/hover:bg-accent/);
    await expect(button).toHaveClass(/hover:text-accent-foreground/);
    await expect(button).not.toHaveClass(/shadow-xs/);
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Link Button' });
    
    await expect(button).toHaveClass(/text-primary/);
    await expect(button).toHaveClass(/underline-offset-4/);
    await expect(button).toHaveClass(/hover:underline/);
    await expect(button).not.toHaveClass(/shadow-xs/);
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Small' });
    
    await expect(button).toHaveClass(/h-8/);
    await expect(button).toHaveClass(/rounded-md/);
    await expect(button).toHaveClass(/gap-1\.5/);
    await expect(button).toHaveClass(/px-3/);
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Large' });
    
    await expect(button).toHaveClass(/h-10/);
    await expect(button).toHaveClass(/rounded-md/);
    await expect(button).toHaveClass(/px-6/);
  },
};

export const Icon: Story = {
  args: {
    size: 'icon',
    children: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <path d="m22 6-10 7L2 6" />
      </svg>
    ),
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button');
    
    await expect(button).toHaveClass(/size-9/);
    
    const svg = button.querySelector('svg');
    await expect(svg).toBeInTheDocument();
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
    onClick: fn(),
  },
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: 'Disabled' });
    
    await expect(button).toBeDisabled();
    await expect(button).toHaveClass(/disabled:pointer-events-none/);
    await expect(button).toHaveClass(/disabled:opacity-50/);
    
    // クリックしても反応しないことを確認
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const WithCustomClass: Story = {
  args: {
    className: 'custom-button-class',
    children: 'Custom',
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Custom' });
    await expect(button).toHaveClass('custom-button-class');
  },
};

export const FocusState: Story = {
  args: {
    children: 'Focus me',
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Focus me' });
    
    // フォーカス状態のスタイル確認
    await expect(button).toHaveClass(/focus-visible:border-ring/);
    await expect(button).toHaveClass(/focus-visible:ring-ring\/50/);
    await expect(button).toHaveClass(/focus-visible:ring-\[3px\]/);
    
    // タブキーでフォーカス
    await userEvent.tab();
    await expect(button).toHaveFocus();
  },
};

export const AriaInvalid: Story = {
  args: {
    'aria-invalid': true,
    children: 'Invalid',
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Invalid' });
    
    await expect(button).toHaveAttribute('aria-invalid', 'true');
    await expect(button).toHaveClass(/aria-invalid:ring-destructive\/20/);
    await expect(button).toHaveClass(/aria-invalid:border-destructive/);
  },
};

export const CommonStyles: Story = {
  args: {
    children: 'Common Styles',
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Common Styles' });
    
    // 共通のスタイルクラスを確認
    await expect(button).toHaveClass(/inline-flex/);
    await expect(button).toHaveClass(/items-center/);
    await expect(button).toHaveClass(/justify-center/);
    await expect(button).toHaveClass(/gap-2/);
    await expect(button).toHaveClass(/whitespace-nowrap/);
    await expect(button).toHaveClass(/rounded-md/);
    await expect(button).toHaveClass(/text-sm/);
    await expect(button).toHaveClass(/font-medium/);
    await expect(button).toHaveClass(/transition-all/);
    await expect(button).toHaveClass(/outline-none/);
  },
};