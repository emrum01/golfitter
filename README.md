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

## 開発

### 利用可能なスクリプト

```bash
# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 本番サーバーの起動
npm start

# リンターの実行
npm run lint
```

### コードスタイル

- TypeScriptを使用
- ESLintとPrettierでコードフォーマット
- コンベンショナルコミットメッセージ

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
