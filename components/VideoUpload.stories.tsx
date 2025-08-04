import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
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
    onUploadComplete: (videoId: string) => console.log('Video uploaded:', videoId),
  },
  play: async ({ canvas }) => {
    // カードの確認
    const card = canvas.getByText('スイング動画のアップロード').closest('[data-slot="card"]');
    await expect(card).toBeInTheDocument();

    // タイトルとサブタイトルの確認
    const title = canvas.getByText('スイング動画のアップロード');
    await expect(title).toBeInTheDocument();
    
    const description = canvas.getByText('ゴルフスイングの動画をアップロードして分析を開始しましょう');
    await expect(description).toBeInTheDocument();

    // アップロードエリアの確認
    const uploadArea = canvas.getByText('クリックして動画を選択');
    await expect(uploadArea).toBeInTheDocument();
    
    const fileTypes = canvas.getByText('MP4, MOV, AVI (最大100MB)');
    await expect(fileTypes).toBeInTheDocument();
  },
};

export const FileSelection: Story = {
  args: {
    onUploadComplete: (videoId: string) => console.log('Video uploaded:', videoId),
  },
  play: async ({ canvas, mount }) => {
    // ファイル入力要素を探す
    const fileInput = canvas.getByLabelText('クリックして動画を選択').parentElement?.querySelector('input[type="file"]') as HTMLInputElement;
    await expect(fileInput).toBeInTheDocument();
    
    // accept属性の確認
    await expect(fileInput).toHaveAttribute('accept', 'video/mp4,video/quicktime,video/x-msvideo');
  },
};

export const InvalidFileType: Story = {
  args: {
    onUploadComplete: (videoId: string) => console.log('Video uploaded:', videoId),
  },
  play: async ({ canvas }) => {
    const fileInput = canvas.getByLabelText('クリックして動画を選択').parentElement?.querySelector('input[type="file"]') as HTMLInputElement;
    
    // 無効なファイルタイプのファイルを作成
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    // ファイルを設定
    await userEvent.upload(fileInput, file);
    
    // エラーメッセージの確認
    await waitFor(async () => {
      const errorMessage = canvas.getByText('対応している形式は MP4, MOV, AVI です');
      await expect(errorMessage).toBeInTheDocument();
    });
  },
};

export const FileSizeTooLarge: Story = {
  args: {
    onUploadComplete: (videoId: string) => console.log('Video uploaded:', videoId),
  },
  play: async ({ canvas }) => {
    const fileInput = canvas.getByLabelText('クリックして動画を選択').parentElement?.querySelector('input[type="file"]') as HTMLInputElement;
    
    // 100MBを超えるファイルを作成（実際には小さいがsizeプロパティを偽装）
    const largeFile = new File(['test'], 'large-video.mp4', { type: 'video/mp4' });
    Object.defineProperty(largeFile, 'size', { value: 101 * 1024 * 1024 });
    
    // ファイルを設定
    await userEvent.upload(fileInput, largeFile);
    
    // エラーメッセージの確認
    await waitFor(async () => {
      const errorMessage = canvas.getByText('ファイルサイズは100MB以下にしてください');
      await expect(errorMessage).toBeInTheDocument();
    });
  },
};

export const ValidFileSelected: Story = {
  args: {
    onUploadComplete: (videoId: string) => console.log('Video uploaded:', videoId),
  },
  play: async ({ canvas }) => {
    const fileInput = canvas.getByLabelText('クリックして動画を選択').parentElement?.querySelector('input[type="file"]') as HTMLInputElement;
    
    // 有効なファイルを作成
    const validFile = new File(['video content'], 'golf-swing.mp4', { type: 'video/mp4' });
    Object.defineProperty(validFile, 'size', { value: 10 * 1024 * 1024 }); // 10MB
    
    // ファイルを設定
    await userEvent.upload(fileInput, validFile);
    
    // ファイル選択後のUIの確認
    await waitFor(async () => {
      // ファイル名の表示
      const fileName = canvas.getByText('golf-swing.mp4');
      await expect(fileName).toBeInTheDocument();
      
      // ファイルサイズの表示
      const fileSize = canvas.getByText('(10.00 MB)');
      await expect(fileSize).toBeInTheDocument();
      
      // 削除ボタンの表示
      const removeButton = canvas.getByRole('button', { name: '削除' });
      await expect(removeButton).toBeInTheDocument();
      
      // 保存ボタンの表示
      const saveButton = canvas.getByRole('button', { name: '動画を保存' });
      await expect(saveButton).toBeInTheDocument();
    });
  },
};

export const RemoveSelectedFile: Story = {
  args: {
    onUploadComplete: (videoId: string) => console.log('Video uploaded:', videoId),
  },
  play: async ({ canvas }) => {
    const fileInput = canvas.getByLabelText('クリックして動画を選択').parentElement?.querySelector('input[type="file"]') as HTMLInputElement;
    
    // ファイルを選択
    const file = new File(['video'], 'test.mp4', { type: 'video/mp4' });
    await userEvent.upload(fileInput, file);
    
    // 削除ボタンを待つ
    await waitFor(async () => {
      const removeButton = canvas.getByRole('button', { name: '削除' });
      await expect(removeButton).toBeInTheDocument();
    });
    
    // 削除ボタンをクリック
    const removeButton = canvas.getByRole('button', { name: '削除' });
    await userEvent.click(removeButton);
    
    // UIが初期状態に戻ることを確認
    await waitFor(async () => {
      const uploadText = canvas.getByText('クリックして動画を選択');
      await expect(uploadText).toBeInTheDocument();
    });
  },
};

export const SaveVideo: Story = {
  args: {
    onUploadComplete: (videoId: string) => console.log('Video uploaded:', videoId),
  },
  play: async ({ canvas, args }) => {
    const fileInput = canvas.getByLabelText('クリックして動画を選択').parentElement?.querySelector('input[type="file"]') as HTMLInputElement;
    
    // ファイルを選択
    const file = new File(['video content'], 'my-swing.mp4', { type: 'video/mp4' });
    await userEvent.upload(fileInput, file);
    
    // 保存ボタンを待つ
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
  },
};

export const VideoPreview: Story = {
  args: {
    onUploadComplete: (videoId: string) => console.log('Video uploaded:', videoId),
  },
  play: async ({ canvas }) => {
    const fileInput = canvas.getByLabelText('クリックして動画を選択').parentElement?.querySelector('input[type="file"]') as HTMLInputElement;
    
    // ビデオファイルを選択
    const videoFile = new File(['video content'], 'preview-test.mp4', { type: 'video/mp4' });
    await userEvent.upload(fileInput, videoFile);
    
    // ビデオプレビューの確認
    await waitFor(async () => {
      const videoElement = canvas.getByRole('application') as HTMLVideoElement; // video要素はapplicationロールを持つ
      await expect(videoElement).toBeInTheDocument();
      await expect(videoElement).toHaveAttribute('controls');
    });
  },
};

export const DisabledStateWhileSaving: Story = {
  args: {
    onUploadComplete: (videoId: string) => console.log('Video uploaded:', videoId),
  },
  play: async ({ canvas }) => {
    const fileInput = canvas.getByLabelText('クリックして動画を選択').parentElement?.querySelector('input[type="file"]') as HTMLInputElement;
    
    // ファイルを選択
    const file = new File(['video'], 'test.mp4', { type: 'video/mp4' });
    await userEvent.upload(fileInput, file);
    
    // 削除ボタンが有効であることを確認
    await waitFor(async () => {
      const removeButton = canvas.getByRole('button', { name: '削除' });
      await expect(removeButton).toBeEnabled();
    });
    
    // 保存ボタンをクリック
    const saveButton = canvas.getByRole('button', { name: '動画を保存' });
    await userEvent.click(saveButton);
    
    // 保存中は削除ボタンが無効になることを確認
    await waitFor(async () => {
      const removeButton = canvas.getByRole('button', { name: '削除' });
      await expect(removeButton).toBeDisabled();
    });
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    onUploadComplete: (videoId: string) => console.log('Video uploaded:', videoId),
  },
  play: async ({ canvas }) => {
    // モバイルビューでも同様に動作することを確認
    const title = canvas.getByText('スイング動画のアップロード');
    await expect(title).toBeInTheDocument();
    
    const uploadArea = canvas.getByText('クリックして動画を選択');
    await expect(uploadArea).toBeInTheDocument();
  },
};