import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Badge } from '@/components/ui/badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
    children: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default',
  },
  play: async ({ canvas }) => {
    const badge = canvas.getByText('Default');
    
    await expect(badge).toBeInTheDocument();
    await expect(badge).toHaveClass(/bg-primary/);
    await expect(badge).toHaveClass(/text-primary-foreground/);
    await expect(badge).toHaveClass(/border-transparent/);
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
  play: async ({ canvas }) => {
    const badge = canvas.getByText('Secondary');
    
    await expect(badge).toHaveClass(/bg-secondary/);
    await expect(badge).toHaveClass(/text-secondary-foreground/);
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Error',
  },
  play: async ({ canvas }) => {
    const badge = canvas.getByText('Error');
    
    await expect(badge).toHaveClass(/bg-destructive/);
    await expect(badge).toHaveClass(/text-destructive-foreground/);
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
  play: async ({ canvas }) => {
    const badge = canvas.getByText('Outline');
    
    await expect(badge).toHaveClass(/text-foreground/);
    await expect(badge).not.toHaveClass(/bg-primary/);
  },
};

export const CommonStyles: Story = {
  args: {
    children: 'Badge',
  },
  play: async ({ canvas }) => {
    const badge = canvas.getByText('Badge');
    
    // 共通のスタイルを確認
    await expect(badge).toHaveClass(/inline-flex/);
    await expect(badge).toHaveClass(/items-center/);
    await expect(badge).toHaveClass(/rounded-full/);
    await expect(badge).toHaveClass(/px-2\.5/);
    await expect(badge).toHaveClass(/py-0\.5/);
    await expect(badge).toHaveClass(/text-xs/);
    await expect(badge).toHaveClass(/font-semibold/);
  },
};

export const WithIcon: Story = {
  render: () => (
    <Badge>
      <span data-testid="icon">🔥</span>
      Hot
    </Badge>
  ),
  play: async ({ canvas }) => {
    const badge = canvas.getByText(/Hot/);
    const icon = canvas.getByTestId('icon');
    
    await expect(badge).toBeInTheDocument();
    await expect(icon).toBeInTheDocument();
  },
};

export const CustomClass: Story = {
  args: {
    className: 'custom-badge-class',
    children: 'Custom',
  },
  play: async ({ canvas }) => {
    const badge = canvas.getByText('Custom');
    await expect(badge).toHaveClass('custom-badge-class');
  },
};

export const HoverState: Story = {
  args: {
    children: 'Hover me',
  },
  play: async ({ canvas }) => {
    const badge = canvas.getByText('Hover me');
    await expect(badge).toHaveClass(/hover:bg-primary\/80/);
  },
};

export const StatusBadges: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="default">Active</Badge>
      <Badge variant="secondary">Pending</Badge>
      <Badge variant="destructive">Error</Badge>
      <Badge variant="outline">Draft</Badge>
    </div>
  ),
  play: async ({ canvas }) => {
    const active = canvas.getByText('Active');
    const pending = canvas.getByText('Pending');
    const error = canvas.getByText('Error');
    const draft = canvas.getByText('Draft');
    
    await expect(active).toHaveClass(/bg-primary/);
    await expect(pending).toHaveClass(/bg-secondary/);
    await expect(error).toHaveClass(/bg-destructive/);
    await expect(draft).toHaveClass(/text-foreground/);
  },
};

export const CountBadges: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge>1</Badge>
      <Badge>99+</Badge>
      <Badge variant="destructive">!</Badge>
    </div>
  ),
  play: async ({ canvas }) => {
    const one = canvas.getByText('1');
    const ninetyNine = canvas.getByText('99+');
    const exclamation = canvas.getByText('!');
    
    await expect(one).toBeInTheDocument();
    await expect(ninetyNine).toBeInTheDocument();
    await expect(exclamation).toBeInTheDocument();
    await expect(exclamation).toHaveClass(/bg-destructive/);
  },
};