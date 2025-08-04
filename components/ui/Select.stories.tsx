import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox');
    
    await expect(trigger).toBeInTheDocument();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveTextContent('Select a fruit');
    
    // トリガーのスタイル確認
    await expect(trigger).toHaveClass(/flex/);
    await expect(trigger).toHaveClass(/h-9/);
    await expect(trigger).toHaveClass(/w-full/);
    await expect(trigger).toHaveClass(/items-center/);
    await expect(trigger).toHaveClass(/justify-between/);
  },
};

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
          <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
          <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
          <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Europe & Africa</SelectLabel>
          <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
          <SelectItem value="cet">Central European Time (CET)</SelectItem>
          <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox');
    
    // セレクトを開く
    await userEvent.click(trigger);
    
    await waitFor(async () => {
      // グループラベルの確認
      const northAmericaLabel = canvas.getByText('North America');
      const europeLabel = canvas.getByText('Europe & Africa');
      
      await expect(northAmericaLabel).toBeInTheDocument();
      await expect(northAmericaLabel).toHaveClass(/py-1\.5/);
      await expect(northAmericaLabel).toHaveClass(/text-sm/);
      await expect(northAmericaLabel).toHaveClass(/font-semibold/);
      
      await expect(europeLabel).toBeInTheDocument();
      
      // アイテムの確認
      const estOption = canvas.getByText('Eastern Standard Time (EST)');
      await expect(estOption).toBeInTheDocument();
    });
  },
};

export const WithDefaultValue: Story = {
  render: () => (
    <Select defaultValue="banana">
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox');
    
    // デフォルト値が表示されていることを確認
    await expect(trigger).toHaveTextContent('Banana');
    
    // セレクトを開く
    await userEvent.click(trigger);
    
    await waitFor(async () => {
      // 選択されたアイテムにチェックマークがあることを確認
      const bananaOption = canvas.getByRole('option', { name: 'Banana' });
      const checkIcon = bananaOption.querySelector('svg');
      
      await expect(bananaOption).toHaveAttribute('aria-selected', 'true');
      await expect(checkIcon).toBeInTheDocument();
    });
  },
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Disabled select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox');
    
    await expect(trigger).toBeDisabled();
    await expect(trigger).toHaveClass(/disabled:cursor-not-allowed/);
    await expect(trigger).toHaveClass(/disabled:opacity-50/);
    
    // クリックしても開かないことを確認
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};

export const DisabledItem: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana" disabled>Banana (Out of stock)</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox');
    
    // セレクトを開く
    await userEvent.click(trigger);
    
    await waitFor(async () => {
      const bananaOption = canvas.getByText('Banana (Out of stock)');
      
      await expect(bananaOption).toHaveAttribute('aria-disabled', 'true');
      await expect(bananaOption).toHaveClass(/text-muted-foreground/);
      await expect(bananaOption).toHaveClass(/pointer-events-none/);
    });
  },
};

export const WithOnValueChange: Story = {
  args: {
    onValueChange: fn(),
  },
  render: ({ onValueChange }) => (
    <Select onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas, args }) => {
    const trigger = canvas.getByRole('combobox');
    
    // セレクトを開く
    await userEvent.click(trigger);
    
    await waitFor(async () => {
      const appleOption = canvas.getByRole('option', { name: 'Apple' });
      
      // アイテムを選択
      await userEvent.click(appleOption);
      
      // コールバックが呼ばれたことを確認
      await waitFor(() => {
        expect(args.onValueChange).toHaveBeenCalledWith('apple');
      });
      
      // 値が更新されたことを確認
      await expect(trigger).toHaveTextContent('Apple');
    });
  },
};

export const CustomTriggerWidth: Story = {
  render: () => (
    <div className="space-y-4">
      <Select>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Small" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>
      
      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Medium" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>
      
      <Select>
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Large" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  play: async ({ canvas }) => {
    const triggers = canvas.getAllByRole('combobox');
    
    await expect(triggers[0]).toHaveClass('w-[100px]');
    await expect(triggers[1]).toHaveClass('w-[200px]');
    await expect(triggers[2]).toHaveClass('w-[300px]');
  },
};

export const TriggerStyles: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Check trigger styles" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="test">Test</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox');
    const chevron = trigger.querySelector('svg');
    
    // トリガーのスタイル確認
    await expect(trigger).toHaveClass(/rounded-md/);
    await expect(trigger).toHaveClass(/border/);
    await expect(trigger).toHaveClass(/bg-transparent/);
    await expect(trigger).toHaveClass(/px-3/);
    await expect(trigger).toHaveClass(/py-1/);
    await expect(trigger).toHaveClass(/shadow-xs/);
    
    // シェブロンアイコンの確認
    await expect(chevron).toBeInTheDocument();
    await expect(chevron).toHaveClass(/h-4/);
    await expect(chevron).toHaveClass(/w-4/);
    await expect(chevron).toHaveClass(/opacity-50/);
  },
};

export const ItemStyles: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Open to check item styles" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="test">Test Item</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox');
    
    // セレクトを開く
    await userEvent.click(trigger);
    
    await waitFor(async () => {
      const item = canvas.getByRole('option', { name: 'Test Item' });
      
      // アイテムのスタイル確認
      await expect(item).toHaveClass(/relative/);
      await expect(item).toHaveClass(/flex/);
      await expect(item).toHaveClass(/w-full/);
      await expect(item).toHaveClass(/cursor-pointer/);
      await expect(item).toHaveClass(/select-none/);
      await expect(item).toHaveClass(/items-center/);
      await expect(item).toHaveClass(/rounded-sm/);
      await expect(item).toHaveClass(/py-1\.5/);
      await expect(item).toHaveClass(/pl-2/);
      await expect(item).toHaveClass(/pr-8/);
      await expect(item).toHaveClass(/text-sm/);
    });
  },
};

export const LongContent: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[300px]">
        <SelectValue placeholder="Select a very long option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">This is a very long option that might overflow</SelectItem>
        <SelectItem value="2">Another extremely long option with lots of text</SelectItem>
        <SelectItem value="3">Short</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('combobox');
    
    // セレクトを開く
    await userEvent.click(trigger);
    
    await waitFor(async () => {
      const longOption = canvas.getByText('This is a very long option that might overflow');
      await expect(longOption).toBeInTheDocument();
    });
    
    // 長いオプションを選択
    const longOption = canvas.getByRole('option', { name: 'This is a very long option that might overflow' });
    await userEvent.click(longOption);
    
    // トリガーに省略された形で表示されることを確認
    await waitFor(() => {
      expect(trigger).toHaveTextContent('This is a very long option that might overflow');
    });
  },
};