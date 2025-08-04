import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, waitFor, userEvent } from 'storybook/test';
import { Input } from '@/components/ui/input';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'file'],
    },
    disabled: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
  play: async ({ canvas }) => {
    const input = canvas.getByPlaceholderText('Enter text...');
    await expect(input).toBeInTheDocument();
    await expect(input).toHaveAttribute('data-slot', 'input');
    await expect(input.tagName).toBe('INPUT');
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Type here',
    onChange: fn(),
  },
  play: async ({ canvas, args }) => {
    const input = canvas.getByPlaceholderText('Type here');
    
    // ユーザー入力をシミュレート
    await userEvent.clear(input);
    await userEvent.type(input, 'Hello World');
    
    await expect(input).toHaveValue('Hello World');
    await waitFor(() => expect(args.onChange).toHaveBeenCalled());
  },
};

export const EmailInput: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter email',
  },
  play: async ({ canvas }) => {
    const input = canvas.getByPlaceholderText('Enter email');
    await expect(input).toHaveAttribute('type', 'email');
  },
};

export const PasswordInput: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
  },
  play: async ({ canvas }) => {
    const input = canvas.getByPlaceholderText('Enter password');
    await expect(input).toHaveAttribute('type', 'password');
    
    // パスワード入力をテスト
    await userEvent.type(input, 'secretpassword');
    await expect(input).toHaveValue('secretpassword');
  },
};

export const NumberInput: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter number',
  },
  play: async ({ canvas }) => {
    const input = canvas.getByPlaceholderText('Enter number');
    await expect(input).toHaveAttribute('type', 'number');
    
    // 数値入力をテスト
    await userEvent.type(input, '123');
    await expect(input).toHaveValue(123);
  },
};

export const FileInput: Story = {
  args: {
    type: 'file',
  },
  play: async ({ canvas }) => {
    // Query the file input by its data-slot attribute
    const container = canvas.container as HTMLElement;
    const fileInput = container.querySelector('input[type="file"][data-slot="input"]');
    
    await expect(fileInput).toBeInTheDocument();
    await expect(fileInput).toHaveAttribute('type', 'file');
    await expect(fileInput).toHaveClass(/file:text-foreground/);
    await expect(fileInput).toHaveClass(/file:bg-transparent/);
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
    onChange: fn(),
  },
  play: async ({ canvas, args }) => {
    const input = canvas.getByPlaceholderText('Disabled input');
    
    await expect(input).toBeDisabled();
    await expect(input).toHaveClass(/disabled:opacity-50/);
    await expect(input).toHaveClass(/disabled:cursor-not-allowed/);
    
    // クリックしても反応しないことを確認
    await userEvent.click(input);
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

export const WithAriaInvalid: Story = {
  args: {
    'aria-invalid': true,
    placeholder: 'Invalid input',
  },
  play: async ({ canvas }) => {
    const input = canvas.getByPlaceholderText('Invalid input');
    
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveClass(/aria-invalid:border-destructive/);
  },
};

export const WithCustomClass: Story = {
  args: {
    className: 'custom-input-class',
    placeholder: 'Custom styled',
  },
  play: async ({ canvas }) => {
    const input = canvas.getByPlaceholderText('Custom styled');
    await expect(input).toHaveClass('custom-input-class');
  },
};

export const FocusAndBlur: Story = {
  args: {
    placeholder: 'Focus me',
    onFocus: fn(),
    onBlur: fn(),
  },
  play: async ({ canvas, args }) => {
    const input = canvas.getByPlaceholderText('Focus me');
    
    // フォーカスイベント
    await userEvent.click(input);
    await waitFor(() => expect(args.onFocus).toHaveBeenCalledTimes(1));
    
    // ブラーイベント
    await userEvent.tab();
    await waitFor(() => expect(args.onBlur).toHaveBeenCalledTimes(1));
  },
};

export const DefaultStyles: Story = {
  args: {
    placeholder: 'Check styles',
  },
  play: async ({ canvas }) => {
    const input = canvas.getByPlaceholderText('Check styles');
    
    // デフォルトのスタイルクラスを確認
    await expect(input).toHaveClass(/h-9/);
    await expect(input).toHaveClass(/rounded-md/);
    await expect(input).toHaveClass(/border/);
    await expect(input).toHaveClass(/px-3/);
    await expect(input).toHaveClass(/shadow-xs/);
  },
};