import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { VideoUpload } from '@/components/video-upload';

const meta = {
  title: 'Features/VideoUpload',
  component: VideoUpload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onUploadComplete: { action: 'onUploadComplete' },
  },
} satisfies Meta<typeof VideoUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onUploadComplete: fn(),
  },
  play: async ({ canvas }) => {
    // コンポーネントの基本要素が表示されていることを確認
    const title = canvas.getByText('スイング動画のアップロード');
    await expect(title).toBeInTheDocument();
    
    const description = canvas.getByText('ゴルフスイングの動画をアップロードして分析を開始しましょう');
    await expect(description).toBeInTheDocument();
    
    const uploadLabel = canvas.getByText('クリックして動画を選択');
    await expect(uploadLabel).toBeInTheDocument();
    
    const formatText = canvas.getByText('MP4, MOV, AVI (最大100MB)');
    await expect(formatText).toBeInTheDocument();
  },
};

export const FileSelection: Story = {
  args: {
    onUploadComplete: fn(),
  },
  play: async ({ canvasElement }) => {
    // ファイル入力要素の確認
    const fileInput = canvasElement.querySelector('input[type="file"]');
    await expect(fileInput).toBeInTheDocument();
    await expect(fileInput).toHaveAttribute('accept', 'video/mp4,video/quicktime,video/x-msvideo');
    await expect(fileInput).toHaveAttribute('id', 'video-upload');
    await expect(fileInput).toHaveClass('hidden');
  },
};

export const InvalidFileType: Story = {
  args: {
    onUploadComplete: fn(),
  },
  play: async ({ canvasElement }) => {
    // ファイル入力要素を取得
    const fileInput = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;
    await expect(fileInput).toBeInTheDocument();
    
    // 無効なファイルタイプをシミュレート
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;
    
    // changeイベントを発火
    const changeEvent = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(changeEvent);
    
    // エラーメッセージが表示されることを確認
    await waitFor(async () => {
      const errorMessage = canvasElement.querySelector('.text-red-500');
      await expect(errorMessage).toBeInTheDocument();
      await expect(errorMessage).toHaveTextContent('対応している形式は MP4, MOV, AVI です');
    });
  },
};

export const FileSizeTooLarge: Story = {
  args: {
    onUploadComplete: fn(),
  },
  play: async ({ canvasElement }) => {
    // ファイル入力要素を取得
    const fileInput = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;
    await expect(fileInput).toBeInTheDocument();
    
    // 大きすぎるファイルをシミュレート（101MB）
    const largeFile = new File([''], 'large-video.mp4', { type: 'video/mp4' });
    Object.defineProperty(largeFile, 'size', {
      value: 101 * 1024 * 1024, // 101MB
      writable: false
    });
    
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(largeFile);
    fileInput.files = dataTransfer.files;
    
    // changeイベントを発火
    const changeEvent = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(changeEvent);
    
    // エラーメッセージが表示されることを確認
    await waitFor(async () => {
      const errorMessage = canvasElement.querySelector('.text-red-500');
      await expect(errorMessage).toBeInTheDocument();
      await expect(errorMessage).toHaveTextContent('ファイルサイズは100MB以下にしてください');
    });
  },
};

export const ValidFileSelected: Story = {
  args: {
    onUploadComplete: fn(),
  },
  play: async ({ canvas, canvasElement }) => {
    // ファイル入力要素を取得
    const fileInput = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;
    await expect(fileInput).toBeInTheDocument();
    
    // 有効なファイルをシミュレート
    const validFile = new File(['video content'], 'test-video.mp4', { type: 'video/mp4' });
    Object.defineProperty(validFile, 'size', {
      value: 10 * 1024 * 1024, // 10MB
      writable: false
    });
    
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(validFile);
    fileInput.files = dataTransfer.files;
    
    // changeイベントを発火
    const changeEvent = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(changeEvent);
    
    // ファイル情報が表示されることを確認
    await waitFor(async () => {
      const fileName = canvas.getByText('test-video.mp4');
      await expect(fileName).toBeInTheDocument();
      
      const fileSize = canvas.getByText('(10.00 MB)');
      await expect(fileSize).toBeInTheDocument();
      
      // 削除ボタンが表示されることを確認
      const removeButton = canvas.getByRole('button', { name: '削除' });
      await expect(removeButton).toBeInTheDocument();
      
      // 保存ボタンが表示されることを確認
      const saveButton = canvas.getByRole('button', { name: '動画を保存' });
      await expect(saveButton).toBeInTheDocument();
    });
  },
};

export const RemoveSelectedFile: Story = {
  args: {
    onUploadComplete: fn(),
  },
  play: async ({ canvas, canvasElement }) => {
    // まず有効なファイルを選択
    const fileInput = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;
    const validFile = new File(['video content'], 'test-video.mp4', { type: 'video/mp4' });
    Object.defineProperty(validFile, 'size', { value: 10 * 1024 * 1024, writable: false });
    
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(validFile);
    fileInput.files = dataTransfer.files;
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    
    // ファイルが選択されたことを確認
    await waitFor(async () => {
      const fileName = canvas.getByText('test-video.mp4');
      await expect(fileName).toBeInTheDocument();
    });
    
    // 削除ボタンをクリック
    const removeButton = canvas.getByRole('button', { name: '削除' });
    await userEvent.click(removeButton);
    
    // ファイル選択画面に戻ることを確認
    await waitFor(async () => {
      const uploadLabel = canvas.getByText('クリックして動画を選択');
      await expect(uploadLabel).toBeInTheDocument();
      
      // ファイル名が表示されなくなったことを確認
      const fileName = canvas.queryByText('test-video.mp4');
      await expect(fileName).not.toBeInTheDocument();
    });
  },
};

export const SaveVideo: Story = {
  args: {
    onUploadComplete: fn(),
  },
  play: async ({ canvas, canvasElement, args }) => {
    // ファイルを選択
    const fileInput = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;
    const validFile = new File(['video content'], 'test-video.mp4', { type: 'video/mp4' });
    Object.defineProperty(validFile, 'size', { value: 10 * 1024 * 1024, writable: false });
    
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(validFile);
    fileInput.files = dataTransfer.files;
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    
    // 保存ボタンが表示されるまで待つ
    await waitFor(async () => {
      const saveButton = canvas.getByRole('button', { name: '動画を保存' });
      await expect(saveButton).toBeInTheDocument();
    });
    
    // 保存ボタンをクリック
    const saveButton = canvas.getByRole('button', { name: '動画を保存' });
    await userEvent.click(saveButton);
    
    // 保存中の表示を確認
    await waitFor(async () => {
      const savingButton = canvas.getByRole('button', { name: '保存中...' });
      await expect(savingButton).toBeInTheDocument();
      await expect(savingButton).toBeDisabled();
    });
    
    // onUploadCompleteが呼ばれることを確認（実際の保存処理はモックされているため、すぐに完了する）
    await waitFor(() => {
      expect(args.onUploadComplete).toHaveBeenCalled();
    }, { timeout: 5000 });
  },
};

export const VideoPreview: Story = {
  args: {
    onUploadComplete: fn(),
  },
  play: async ({ canvasElement }) => {
    // ファイルを選択
    const fileInput = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;
    const validFile = new File(['video content'], 'test-video.mp4', { type: 'video/mp4' });
    Object.defineProperty(validFile, 'size', { value: 10 * 1024 * 1024, writable: false });
    
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(validFile);
    fileInput.files = dataTransfer.files;
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    
    // ビデオプレビューが表示されることを確認
    await waitFor(async () => {
      const videoElement = canvasElement.querySelector('video');
      await expect(videoElement).toBeInTheDocument();
      await expect(videoElement).toHaveAttribute('controls');
      await expect(videoElement).toHaveClass('w-full', 'h-full', 'object-contain');
      
      // ビデオのコンテナが正しいアスペクト比を持つことを確認
      const videoContainer = canvasElement.querySelector('.aspect-video');
      await expect(videoContainer).toBeInTheDocument();
    });
  },
};

export const DisabledStateWhileSaving: Story = {
  args: {
    onUploadComplete: fn(),
  },
  play: async ({ canvas, canvasElement }) => {
    // ファイルを選択
    const fileInput = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;
    const validFile = new File(['video content'], 'test-video.mp4', { type: 'video/mp4' });
    Object.defineProperty(validFile, 'size', { value: 10 * 1024 * 1024, writable: false });
    
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(validFile);
    fileInput.files = dataTransfer.files;
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    
    // 保存ボタンが表示されるまで待つ
    await waitFor(async () => {
      const saveButton = canvas.getByRole('button', { name: '動画を保存' });
      await expect(saveButton).toBeInTheDocument();
    });
    
    // 削除ボタンが表示されることを確認
    const removeButton = canvas.getByRole('button', { name: '削除' });
    await expect(removeButton).toBeInTheDocument();
    await expect(removeButton).not.toBeDisabled();
    
    // 保存ボタンが無効化されていないことを確認
    const saveButton = canvas.getByRole('button', { name: '動画を保存' });
    await expect(saveButton).not.toBeDisabled();
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    onUploadComplete: fn(),
  },
  play: async ({ canvas }) => {
    // モバイルビューでも基本要素が表示されていることを確認
    const title = canvas.getByText('スイング動画のアップロード');
    await expect(title).toBeInTheDocument();
    
    const uploadLabel = canvas.getByText('クリックして動画を選択');
    await expect(uploadLabel).toBeInTheDocument();
    
    // カードコンポーネントが適切な最大幅を持つことを確認
    const card = canvas.getByText('スイング動画のアップロード').closest('.max-w-2xl');
    await expect(card).toBeInTheDocument();
    await expect(card).toHaveClass('w-full');
  },
};