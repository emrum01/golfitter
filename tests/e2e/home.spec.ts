import { test, expect } from '@playwright/test';

test.describe('Home Page (Authenticated)', () => {
  test.skip('should display golf fitter form when authenticated', async ({ page }) => {
    // Skip this test as it requires authentication setup
    // TODO: Implement authentication state setup for tests
    
    await page.goto('/');
    
    // 認証後のメイン画面要素
    await expect(page.getByText('ゴルフフィッター')).toBeVisible();
    await expect(page.getByText('身体データ')).toBeVisible();
    await expect(page.getByText('プレイ情報')).toBeVisible();
    await expect(page.getByRole('button', { name: 'AI診断を開始' })).toBeVisible();
  });

  test.skip('should validate required fields', async ({ page }) => {
    // Skip this test as it requires authentication setup
    // TODO: Implement authentication state setup for tests
    
    await page.goto('/');
    
    // 必須フィールドが空の場合、ボタンが無効化される
    const diagnosisButton = page.getByRole('button', { name: 'AI診断を開始' });
    await expect(diagnosisButton).toBeDisabled();
    
    // 名前を入力
    await page.getByLabel('お名前').fill('テストユーザー');
    await expect(diagnosisButton).toBeDisabled();
    
    // 身長を入力
    await page.getByLabel('身長 (cm)').fill('175');
    await expect(diagnosisButton).toBeDisabled();
    
    // 体重を入力
    await page.getByLabel('体重 (kg)').fill('70');
    await expect(diagnosisButton).toBeEnabled();
  });
});