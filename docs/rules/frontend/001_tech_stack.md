## 技術スタック

### プロジェクト構成

本プロジェクトはNext.jsを使用した単一アプリケーションです。

### 主要な技術スタック

| カテゴリ | 技術 | 説明 |
| --- | --- | --- |
| フレームワーク | Next.js 15.x | React フレームワーク |
| UI ライブラリ | React 19.x | UI コンポーネントライブラリ |
| 言語 | TypeScript 5.x | 型安全な JavaScript |
| スタイリング | Tailwind CSS | ユーティリティファーストの CSS フレームワーク |
| データベース | Supabase | PostgreSQL ベースの BaaS |
| テスト | Vitest | 単体テスト・統合テスト |
| コンポーネント開発 | Storybook 8.x | コンポーネントカタログ・ビジュアルテスト |
| コード品質 | ESLint 9.x | コード品質チェック |

### 参照先

技術スタックの詳細は、以下のファイルを参照してください：

- `package.json` - プロジェクトの依存関係と npm スクリプト
- `eslint.config.mjs` - ESLint の設定
- `vitest.config.ts` - Vitest の設定
- `.storybook/` - Storybook の設定

### パッケージ管理

- npm を使用してパッケージを管理
- `package-lock.json` でバージョンを固定
