## アーキテクチャルール

### ディレクトリ構造

**説明:**
プロジェクトの一貫性を保つための必須のディレクトリ構造規則

#### 基本構造

- ○○○○/\_components/: ページ固有のコンポーネント
- ○○○○/\_hooks/: ページ固有のフック
- ○○○○/page.tsx: サーバーコンポーネント（prefetch 用）
- ○○○○Page.tsx: クライアントコンポーネント実装
- components/: 再利用可能なコンポーネント
  - ui/: 基本的な UI コンポーネント（Button, Input など）
  - features/: 機能別コンポーネント（VideoPlayer, SwingAnalysis など）
  - layouts/: レイアウトコンポーネント（Header, Footer など）

**実装例:**

```
# 推奨されるディレクトリ構造の例
# /app/dashboard/analysis/

mypage/
├── page.tsx          # サーバーコンポーネント（prefetch用）
├── MypagePage.tsx    # クライアントコンポーネント実装
└── _components/      # ページ固有のコンポーネントを格納
    └── someComponent/
        ├── index.ts　# バレルファイルからエクスポート
        ├── SomeComponent.tsx
        └── SomeComponent.stories.tsx

# 各ファイルの役割:
# - page.tsx: サーバーサイドの処理やデータフェッチを担当
# - MypagePage.tsx: クライアントサイドのロジックとUIを実装
# - _components/: ページ固有のコンポーネントを格納
#   - 各コンポーネントは独自のディレクトリを持ち、その中にStorybookファイルも配置、外から呼び出されるファイルはindex.tsからエクスポートする
```

**禁止事項**

- `index.tsx`という命名のファイルを作成しない。必ず実装されている内容の実態をファイル名に含める( バレルファイルとしての index.ts を除く )

### ルーティング

**説明:**
Next.js のルーティングに関する必須のルール

#### ルール

- Link コンポーネントの使用

  - 静的な遷移には next/link の Link コンポーネントを使用
  - import Link from 'next/link'
  - <Link href={Routes.to.Page()}>...</Link>

- ダイナミックルーティング
  - [id]や[slug]などのダイナミックセグメントを使用する場合は、型安全性のために、params の型を定義すること
  ```typescript
  type Props = {
    params: {
      id: string;
    };
  };
  ```
- window.location.href の直接操作は避け、useRouter を使用すること
  - import { useRouter } from 'next/navigation'
  - const router = useRouter()
  - router.push(Routes.to.Page())を使用

### バレルファイル

**説明:**
コンポーネントのエクスポートに関するルール

**ルール:**

- バレルファイルは必ず`index.ts`という名前で作成
- ワイルドカードエクスポート（`export * from './Component'`）は禁止
- 個別エクスポートを使用すること

**例:**

```typescript
// ❌ 禁止
export * from './CustomerTable';

// ✅ 推奨
export { CustomerTable } from './CustomerTable';
export type { CustomerTableProps } from './CustomerTable';
```

### 型定義とインポート

**説明:**
型定義とインポートに関するルール

**ルール:**

- 型定義は TypeScript の interface または type を使用
- コンポーネントの Props は明示的に定義
- API レスポンスの型は適切に定義
- `any` 型の使用は避ける

**型定義の配置:**

1. コンポーネント固有の型: 同じファイル内に定義
2. 共有される型: `types/` ディレクトリに配置
3. API レスポンスの型: `types/api/` に配置

**例:**

```typescript
// コンポーネントの Props
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

// API レスポンスの型
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// Supabase の型
import { Database } from '@/types/supabase';
type Profile = Database['public']['Tables']['profiles']['Row'];
```
