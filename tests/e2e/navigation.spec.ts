import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to swing comparison page with parameters', async ({ page }) => {
    // URLパラメータ付きでスイング比較ページにアクセス
    await page.goto('/swing-comparison?video2=test.mp4&proName=田中太郎');
    
    // ページが正しく読み込まれることを確認
    await expect(page.getByText('スイング比較分析')).toBeVisible();
    await expect(page.getByText('2つのスイング動画をアップロードして比較分析を行います')).toBeVisible();
    
    // プリセット動画が設定されていることを確認
    await expect(page.getByText('(プロのスイング)')).toBeVisible();
  });

  test('should show loading state on swing comparison page', async ({ page }) => {
    await page.goto('/swing-comparison');
    
    // 初期状態では分析ボタンが無効
    const analyzeButton = page.getByRole('button', { name: '比較分析開始' });
    await expect(analyzeButton).toBeDisabled();
    
    // 説明テキストが表示される
    await expect(page.getByText('2つの動画をアップロードしてください')).toBeVisible();
  });

  test('should have back button that works', async ({ page }) => {
    await page.goto('/swing-comparison');
    
    // 戻るボタンが表示される
    const backButton = page.getByRole('button', { name: '診断結果に戻る' });
    await expect(backButton).toBeVisible();
    await expect(backButton).toBeEnabled();
  });
});