# Golfitter Project Context

## 重要なワークフローガイド

### 実装タスクワークフロー
実装時は必ず `/tasks/implementation.md` のワークフローに従ってください。

このファイルには以下が定義されています：
- 新規機能開発のフロー
- 既存機能改修のフロー
- バグ修正のフロー
- リファクタリングのフロー
- UI/UX改善のフロー

各フローにはTDDサイクル（🔴RED → 🟢GREEN → 🔵REFACTOR）の具体的な手順が含まれています。

## プロジェクトルール

### フロントエンド実装
- `/docs/rules/frontend/` - フロントエンド実装の全ルール
- `/docs/rules/tdd-guideline.md` - TDDの基本ガイドライン

### スクリーン仕様
- `/docs/screen-specs/` - 各画面の仕様書
- `/screen-specs/` - 追加のスクリーン仕様

## 開発時の注意事項

1. **TDDの徹底**: 必ずテストファースト（Storybook）で実装を開始
2. **ディレクトリ構造の遵守**: `_components/`と`components/`の使い分け
3. **型定義の厳密性**: `any`型の使用禁止
4. **コミットの制限**: 明示的な指示がない限りコミットしない

## よく使うコマンド

```bash
# 開発サーバー
npm run dev

# Storybook
npm run storybook

# テスト
npm run test
npm run test -- ComponentName.stories  # 特定ファイルのみ

# 品質チェック
npm run lint
npm run build  # 型チェック
```