# Golfitter

ゴルフのスイング分析と記録管理を行うWebアプリケーションです。

## 機能

- 🔐 **認証機能**: メール/パスワード認証とGoogle OAuth認証
- 📊 **スイング分析**: ゴルフスイングの動画アップロードと分析
- 🔄 **スイング比較分析**: 2つのスイング動画を比較して改善点を分析
- 📈 **記録管理**: スコアや練習記録の管理
- 👤 **プロフィール管理**: ユーザー情報とゴルフ設定の管理

## 技術スタック

- **フロントエンド**: Next.js 14, React, TypeScript
- **スタイリング**: Tailwind CSS, shadcn/ui
- **認証**: Supabase Auth
- **データベース**: Supabase (PostgreSQL)
- **OAuth**: Google OAuth 2.0

## セットアップ

### 前提条件

- Node.js 18以上
- npm, yarn, pnpm, または bun
- Supabaseアカウント
- Google Cloud Consoleアカウント

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd golfitter
```

### 2. 依存関係のインストール

```bash
npm install
# または
yarn install
# または
pnpm install
# または
bun install
```

### 3. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定：

```env
# Supabase Configuration
# Supabaseダッシュボードの「Settings」→「API」から取得
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# 開発環境の設定
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 本番環境の場合は以下に変更
# NODE_ENV=production
# NEXT_PUBLIC_APP_URL=https://your-domain.com
```

**注意**: Google OAuthの設定はSupabaseダッシュボードで行います。詳細は[Google認証セットアップガイド](docs/google-auth-setup.md)を参照してください。

### 4. データベースのセットアップ

Supabaseダッシュボードで以下のSQLスクリプトを実行：

```sql
-- 基本的なテーブル作成
\i scripts/create-tables.sql

-- スイング分析テーブルの追加
\i scripts/add-swing-analysis-table.sql
```

### 5. Google認証の設定

詳細な設定手順は[Google認証セットアップガイド](docs/google-auth-setup.md)を参照してください。

### 6. 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
# または
bun dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認してください。

## 認証機能

### 対応認証方式

- **メール/パスワード認証**: 従来の認証方式
- **Google OAuth認証**: Googleアカウントでのワンクリックログイン

### 認証フロー

1. ユーザーがログインページにアクセス
2. メール/パスワードまたはGoogle認証を選択
3. 認証成功後、アプリケーションにリダイレクト
4. ユーザーセッションの管理

## 設計思想

このプロジェクトは、スケーラブルな Web アプリケーション開発の実践例として設計されています。

### 開発プロセス

#### TDD + Storybook による体系的な開発サイクル

**🔴 RED Phase**: テストファーストで期待動作を定義
```bash
# 1. Storybook ファイル作成
touch ComponentName.stories.tsx

# 2. play 関数で失敗するテストを記述
npm run storybook  # 失敗確認
```

**🟢 GREEN Phase**: 最小実装でテストを通す
```bash
# 3. コンポーネント実装
touch ComponentName.tsx

# 4. テスト通過確認
npm run test -- ComponentName.stories
```

**🔵 REFACTOR Phase**: コード品質向上
```bash
# 5. リファクタリング実行
npm run lint && npm run typecheck
```

#### 実装されている開発支援の仕組み

**ファイル監視とホットリロード:**
- Next.js Turbopack: 高速な開発サーバー
- Storybook HMR: コンポーネント変更の即座反映
- Vitest watch mode: テスト自動実行

**開発効率化ツール:**
```bash
npm run test:ui        # Vitest UI でテスト状況を視覚化
npm run test:e2e:ui    # Playwright UI でE2Eテストをデバッグ
npm run storybook      # コンポーネント開発環境
```

**型安全性による開発支援:**
- Props インターフェースによる自動補完
- コンパイル時エラー検出
- リファクタリング時の影響範囲の自動検出

### アーキテクチャ

```
app/○○○○/page.tsx          # Server Components
app/○○○○/○○○○Page.tsx      # Client Components  
app/○○○○/_components/      # ページ固有のコンポーネント
components/                # 再利用可能なコンポーネント
```

**コンポーネント設計：**
- Atomic Design パターンによる階層化
- shadcn/ui をベースとした一貫性のある UI
- Props の型定義によるインターフェースの明確化

### 品質保証

#### 多層防御の品質チェック

```bash
# 静的解析（複数ツール）
npm run lint          # ESLint - コード品質とルール
npm run lint:biome    # Biome - フォーマット + Lint（自動修正）
npm run typecheck     # TypeScript - 型安全性

# テスト（各レイヤー）
npm run test          # Vitest - ユニット/統合テスト
npm run storybook     # Storybook - コンポーネントテスト
npm run test:e2e      # Playwright - E2Eテスト
```

#### Git フック（lefthook）による自動品質チェック

**pre-commit**: コミット前に自動実行
```yaml
parallel: true  # 並列実行で高速化
commands:
  lint: ESLint チェック
  typecheck: 型チェック  
  test: テスト実行（--run モード）
```

**commit-msg**: コミットメッセージ規約チェック
- Conventional Commits 形式の強制
- `feat:`, `fix:`, `docs:` 等の適切なプレフィックス

#### 品質基準

**コードスタイル統一:**
- Biome: 80文字幅、2スペースインデント、セミコロン最小化
- 未使用変数/インポートの自動削除
- import/export の型分離

**型安全性:**
- `--noEmit` での厳密な型チェック
- any型の禁止（実装ルールで明文化）

**テストカバレッジ:**
- コンポーネント単位の Storybook play 関数テスト
- ユーザージャーニーの E2E テスト
- 非同期処理とエラーハンドリングの検証

## プロジェクト構造

```
golfitter/
├── app/                    # Next.js App Router
│   ├── auth/              # 認証関連ページ
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # ホームページ
├── components/            # Reactコンポーネント
│   ├── ui/               # 基本UIコンポーネント
│   ├── auth-form.tsx     # 認証フォーム
│   └── protected-route.tsx # 保護されたルート
├── lib/                  # ユーティリティとライブラリ
│   ├── auth-context.tsx  # 認証コンテキスト
│   ├── supabase.ts       # Supabaseクライアント
│   └── types.ts          # TypeScript型定義
├── docs/                 # ドキュメント
│   └── google-auth-setup.md # Google認証セットアップガイド
└── scripts/              # データベーススクリプト
```

## 開発ワークフロー

### 新機能開発の標準フロー

#### 1. ブランチ作成とセットアップ
```bash
git checkout -b feat/feature-name
npm run dev  # 開発サーバー起動
```

#### 2. TDD サイクルでの実装
```bash
# 🔴 RED: テスト作成
touch components/FeatureName/FeatureName.stories.tsx
npm run storybook  # localhost:6006

# 🟢 GREEN: 実装
touch components/FeatureName/FeatureName.tsx
npm run test -- FeatureName.stories

# 🔵 REFACTOR: 品質向上
npm run lint:biome && npm run typecheck
```

#### 3. 品質チェックと統合
```bash
# 各種テスト実行
npm run test:e2e      # E2Eテスト
npm run build         # 本番ビルド確認

# Git フックで自動チェック
git add . && git commit -m "feat: 新機能を追加"
```

### スクリプト一覧

**開発用:**
```bash
npm run dev           # 開発サーバー（Turbopack）
npm run storybook     # コンポーネント開発環境
npm run test:watch    # テスト監視モード
npm run test:ui       # Vitest UI
```

**品質チェック:**
```bash
npm run lint          # ESLint
npm run lint:biome    # Biome（フォーマット+Lint）
npm run typecheck     # TypeScript型チェック
npm run test          # 全テスト実行
npm run test:e2e      # E2Eテスト（Playwright）
```

**ビルド:**
```bash
npm run build         # 本番ビルド
npm run start         # 本番サーバー起動
npm run build-storybook  # Storybook ビルド
```

## デプロイ

### Vercelでのデプロイ

1. Vercelアカウントを作成
2. GitHubリポジトリを接続
3. 環境変数を設定
4. デプロイ

詳細は[Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)を参照してください。

## トラブルシューティング

### よくある問題

1. **認証エラー**: 環境変数とSupabase設定を確認
2. **Google認証が動作しない**: [Google認証セットアップガイド](docs/google-auth-setup.md)を参照
3. **データベースエラー**: Supabaseのテーブル設定を確認

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 貢献

プルリクエストやイシューの報告を歓迎します。貢献する前に、コーディング規約を確認してください。
