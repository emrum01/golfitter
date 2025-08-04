# CLAUDE.md - Claude/Cursor 同期ファイル

このファイルは、ClaudeとCursor間で共有すべき重要な情報を記録します。

## 📋 プロジェクト概要

- **プロジェクト名**: Golfitter
- **説明**: ゴルフのスイング分析と記録管理を行うWebアプリケーション
- **技術スタック**: Next.js 14, React, TypeScript, Tailwind CSS, Supabase

## 🚀 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# Storybook起動
npm run storybook

# テスト実行
npm run test

# 型チェック
npm run typecheck

# Lint実行
npm run lint

# Lint自動修正
npm run lint:fix
```

## 📁 重要なドキュメント

- `/tasks/implementation.md` - 実装タスクワークフロー
- `/docs/rules/` - フロントエンド実装ルール
- `/docs/rules/tdd-guideline.md` - TDDガイドライン
- `/docs/rules/frontend/011_tdd_with_storybook.md` - StorybookでのTDD実装

## 🔄 実装フロー（概要）

### TDDサイクル
1. **🔴 RED** - 失敗するテストを書く（Storybook）
2. **🟢 GREEN** - テストを通す最小限の実装
3. **🔵 REFACTOR** - コードを改善

### ディレクトリ構造
- `app/○○○○/page.tsx` - サーバーコンポーネント
- `app/○○○○/○○○○Page.tsx` - クライアントコンポーネント
- `app/○○○○/_components/` - ページ固有のコンポーネント
- `components/` - 再利用可能なコンポーネント

## 📝 現在の作業状態

- 最新の作業: `tasks/implementation.md`の作成完了
- ブランチ: `feat/mobile-video-viewer`

## 🔧 よく使うパターン

### コンポーネント作成
```bash
# Storybookファイル作成（TDD開始）
touch components/ComponentName/ComponentName.stories.tsx

# コンポーネントファイル作成
touch components/ComponentName/ComponentName.tsx

# バレルファイル作成
touch components/ComponentName/index.ts
```

### ファイル検索
```bash
# コンポーネントの使用箇所を検索
grep -r "ComponentName" --include="*.tsx" --include="*.ts"

# 特定のパターンを含むファイルを検索
find . -name "*.tsx" -type f | xargs grep "pattern"
```

## ⚠️ 注意事項

- 実装前に必ず影響範囲を調査する
- TDDサイクルに従って実装を進める
- 型定義は適切に行い、`any`型は避ける

## 🔐 権限設定

以下のコマンドは承認なしで実行可能:
- `git add`
- `git commit`
- `git status`
- `git diff`
- `git log`

## 📊 プロジェクト状態

- Git Status: clean
- 最新コミット: `feat: モバイル動画ビューアーとスワイプナビゲーションを追加`

---

最終更新: 2025-08-04