import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardAction
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content can be any React component</p>
      </CardContent>
      <CardFooter>
        <p>Card footer</p>
      </CardFooter>
    </Card>
  ),
  play: async ({ canvas }) => {
    const card = canvas.getByText('Card Title').closest('[data-slot="card"]');
    const title = canvas.getByText('Card Title');
    const description = canvas.getByText('Card description goes here');
    const content = canvas.getByText('Card content can be any React component');
    const footer = canvas.getByText('Card footer');
    
    // カード要素の確認
    await expect(card).toBeInTheDocument();
    await expect(card).toHaveAttribute('data-slot', 'card');
    
    // 各サブコンポーネントの確認
    await expect(title).toBeInTheDocument();
    await expect(description).toBeInTheDocument();
    await expect(content).toBeInTheDocument();
    await expect(footer).toBeInTheDocument();
  },
};

export const CardOnly: Story = {
  render: () => (
    <Card className="w-[350px] p-6">
      <p>Simple card with just content</p>
    </Card>
  ),
  play: async ({ canvas }) => {
    const card = canvas.getByText('Simple card with just content').closest('[data-slot="card"]');
    
    await expect(card).toBeInTheDocument();
    await expect(card).toHaveClass(/rounded-xl/);
    await expect(card).toHaveClass(/border/);
    await expect(card).toHaveClass(/bg-card/);
    await expect(card).toHaveClass(/text-card-foreground/);
    await expect(card).toHaveClass(/shadow-sm/);
  },
};

export const HeaderOnly: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account settings and preferences.</CardDescription>
      </CardHeader>
    </Card>
  ),
  play: async ({ canvas }) => {
    const header = canvas.getByText('Settings').closest('[data-slot="card-header"]');
    const title = canvas.getByText('Settings');
    const description = canvas.getByText('Manage your account settings and preferences.');
    
    await expect(header).toBeInTheDocument();
    await expect(header).toHaveClass(/px-6/);
    await expect(header).toHaveClass(/grid/);
    await expect(header).toHaveClass(/gap-1\.5/);
    
    await expect(title).toHaveClass(/font-semibold/);
    await expect(title).toHaveClass(/leading-none/);
    
    await expect(description).toHaveClass(/text-sm/);
    await expect(description).toHaveClass(/text-muted-foreground/);
  },
};

export const WithAction: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardFooter>
        <CardAction>
          <Button>Mark all as read</Button>
        </CardAction>
      </CardFooter>
    </Card>
  ),
  play: async ({ canvas }) => {
    const action = canvas.getByText('Mark all as read').closest('[data-slot="card-action"]');
    const button = canvas.getByRole('button', { name: 'Mark all as read' });
    
    await expect(action).toBeInTheDocument();
    await expect(action).toHaveClass(/col-start-2/);
    await expect(action).toHaveClass(/row-span-2/);
    await expect(action).toHaveClass(/row-start-1/);
    await expect(action).toHaveClass(/self-start/);
    await expect(action).toHaveClass(/justify-self-end/);
    await expect(button).toBeInTheDocument();
  },
};

export const ComplexCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-4 rounded-md border p-4">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">Push to deploy</p>
            <p className="text-sm text-muted-foreground">
              Your project will be deployed automatically
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  ),
  play: async ({ canvas }) => {
    const content = canvas.getByText('Push to deploy').closest('[data-slot="card-content"]');
    const footer = canvas.getByRole('button', { name: 'Deploy' }).closest('[data-slot="card-footer"]');
    
    // コンテンツセクションの確認
    await expect(content).toHaveClass(/px-6/);
    
    // フッターセクションの確認
    await expect(footer).toHaveClass(/flex/);
    await expect(footer).toHaveClass(/items-center/);
    await expect(footer).toHaveClass(/px-6/);
    
    // ボタンの確認
    const cancelButton = canvas.getByRole('button', { name: 'Cancel' });
    const deployButton = canvas.getByRole('button', { name: 'Deploy' });
    
    await expect(cancelButton).toBeInTheDocument();
    await expect(deployButton).toBeInTheDocument();
  },
};

export const CustomClasses: Story = {
  render: () => (
    <Card className="w-[350px] custom-card-class">
      <CardHeader className="custom-header-class">
        <CardTitle className="custom-title-class">Custom Styled</CardTitle>
        <CardDescription className="custom-description-class">
          All components with custom classes
        </CardDescription>
      </CardHeader>
      <CardContent className="custom-content-class">
        <p>Content with custom class</p>
      </CardContent>
      <CardFooter className="custom-footer-class">
        <p>Footer with custom class</p>
      </CardFooter>
    </Card>
  ),
  play: async ({ canvas }) => {
    const card = canvas.getByText('Custom Styled').closest('[data-slot="card"]');
    const header = canvas.getByText('Custom Styled').closest('[data-slot="card-header"]');
    const title = canvas.getByText('Custom Styled');
    const description = canvas.getByText('All components with custom classes');
    const content = canvas.getByText('Content with custom class').closest('[data-slot="card-content"]');
    const footer = canvas.getByText('Footer with custom class').closest('[data-slot="card-footer"]');
    
    await expect(card).toHaveClass('custom-card-class');
    await expect(header).toHaveClass('custom-header-class');
    await expect(title).toHaveClass('custom-title-class');
    await expect(description).toHaveClass('custom-description-class');
    await expect(content).toHaveClass('custom-content-class');
    await expect(footer).toHaveClass('custom-footer-class');
  },
};

export const NoShadow: Story = {
  render: () => (
    <Card className="w-[350px] shadow-none">
      <CardHeader>
        <CardTitle>No Shadow Card</CardTitle>
      </CardHeader>
    </Card>
  ),
  play: async ({ canvas }) => {
    const card = canvas.getByText('No Shadow Card').closest('[data-slot="card"]');
    await expect(card).toHaveClass('shadow-none');
  },
};

export const MultipleCards: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>First Card</CardTitle>
          <CardDescription>This is the first card</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Second Card</CardTitle>
          <CardDescription>This is the second card</CardDescription>
        </CardHeader>
      </Card>
    </div>
  ),
  play: async ({ canvas }) => {
    const firstCard = canvas.getByText('First Card').closest('[data-slot="card"]');
    const secondCard = canvas.getByText('Second Card').closest('[data-slot="card"]');
    
    await expect(firstCard).toBeInTheDocument();
    await expect(secondCard).toBeInTheDocument();
    
    // 両方のカードが同じ基本スタイルを持つことを確認
    await expect(firstCard).toHaveClass(/rounded-xl/);
    await expect(secondCard).toHaveClass(/rounded-xl/);
  },
};