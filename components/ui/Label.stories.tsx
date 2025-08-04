import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const meta = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Label Text',
  },
  play: async ({ canvas }) => {
    const label = canvas.getByText('Label Text');
    await expect(label).toBeInTheDocument();
    await expect(label).toHaveAttribute('data-slot', 'label');
  },
};

export const WithInput: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email-input">Email Address</Label>
      <Input id="email-input" type="email" placeholder="Enter your email" />
    </div>
  ),
  play: async ({ canvas }) => {
    const label = canvas.getByText('Email Address');
    const input = canvas.getByPlaceholderText('Enter your email');
    
    // ラベルがinputに関連付けられていることを確認
    await expect(label).toHaveAttribute('for', 'email-input');
    await expect(input).toHaveAttribute('id', 'email-input');
  },
};

export const WithIcon: Story = {
  render: () => (
    <Label>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        data-testid="icon"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
      Home
    </Label>
  ),
  play: async ({ canvas }) => {
    const label = canvas.getByText('Home');
    const icon = canvas.getByTestId('icon');
    
    await expect(label).toBeInTheDocument();
    await expect(icon).toBeInTheDocument();
    await expect(label).toHaveClass(/flex/);
    await expect(label).toHaveClass(/items-center/);
    await expect(label).toHaveClass(/gap-2/);
  },
};

export const DefaultStyles: Story = {
  args: {
    children: 'Styled Label',
  },
  play: async ({ canvas }) => {
    const label = canvas.getByText('Styled Label');
    
    await expect(label).toHaveClass(/text-sm/);
    await expect(label).toHaveClass(/font-medium/);
    await expect(label).toHaveClass(/select-none/);
  },
};

export const WithCustomClass: Story = {
  args: {
    children: 'Custom Label',
    className: 'custom-label-class text-lg',
  },
  play: async ({ canvas }) => {
    const label = canvas.getByText('Custom Label');
    await expect(label).toHaveClass('custom-label-class');
    await expect(label).toHaveClass('text-lg');
  },
};

export const DisabledGroup: Story = {
  render: () => (
    <div data-disabled="true" className="group space-y-2">
      <Label>Disabled Label</Label>
      <Input disabled placeholder="Disabled input" />
    </div>
  ),
  play: async ({ canvas }) => {
    const label = canvas.getByText('Disabled Label');
    const input = canvas.getByPlaceholderText('Disabled input');
    
    await expect(label).toHaveClass(/group-data-\[disabled=true\]:pointer-events-none/);
    await expect(label).toHaveClass(/group-data-\[disabled=true\]:opacity-50/);
    await expect(input).toBeDisabled();
  },
};

export const PeerDisabled: Story = {
  render: () => (
    <div className="space-y-2">
      <Input disabled className="peer" placeholder="Disabled peer" />
      <Label>Peer Disabled Label</Label>
    </div>
  ),
  play: async ({ canvas }) => {
    const label = canvas.getByText('Peer Disabled Label');
    const input = canvas.getByPlaceholderText('Disabled peer');
    
    await expect(input).toBeDisabled();
    await expect(label).toHaveClass(/peer-disabled:cursor-not-allowed/);
    await expect(label).toHaveClass(/peer-disabled:opacity-50/);
  },
};

export const Required: Story = {
  render: () => (
    <Label>
      Required Field
      <span className="text-red-500 ml-1">*</span>
    </Label>
  ),
  play: async ({ canvas }) => {
    const label = canvas.getByText(/Required Field/);
    const asterisk = canvas.getByText('*');
    
    await expect(label).toBeInTheDocument();
    await expect(asterisk).toBeInTheDocument();
    await expect(asterisk).toHaveClass('text-red-500');
  },
};