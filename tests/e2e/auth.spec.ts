import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should redirect to login page when not authenticated', async ({ page }) => {
    await page.goto('/');
    
    // 認証されていない場合、ログイン画面にリダイレクトされる
    await expect(page.getByText('ログイン')).toBeVisible();
    await expect(page.getByText('Googleでログイン')).toBeVisible();
  });

  test('should show login form elements', async ({ page }) => {
    await page.goto('/');
    
    // ログインフォームの要素が表示される
    await expect(page.getByRole('button', { name: 'Googleでログイン' })).toBeVisible();
    await expect(page.getByText('Golfitter')).toBeVisible();
    await expect(page.getByText('あなたに最適なゴルフクラブとスイングを提案します')).toBeVisible();
  });
});