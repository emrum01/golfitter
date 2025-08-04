## 型定義とインポートの詳細ルール

### 基本ルール

**説明:**
型定義とインポートに関する基本ルール

**ルール:**

- 型定義は可能な限りコンポーネントファイル内で行う
- 複数のコンポーネントで共有する型は専用の型定義ファイルに定義する
- 型名は PascalCase を使用する
- インポートはアルファベット順に整理する

### API との型連携

**説明:**
バックエンド API から提供される型とフロントエンドの型の連携

**ルール:**

- Supabase の型定義は `types/supabase.ts` から取得する
- API レスポンスの型は適切に定義する
- Zod を使用してランタイム型検証を行う
- 型の重複を避け、一元管理する

### Supabase 型の使用

**説明:**
Supabase の型を安全に使用するためのルール

**ルール:**

- データベース型は `Database` 型から取得
- テーブルの Row/Insert/Update 型を適切に使い分ける
- オプショナルフィールドの null チェックを必ず行う
- 関係性の型は明示的に定義する

**例:**

```typescript
import { Database } from '@/types/supabase';

// テーブルの型を取得
type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// オプショナルフィールドの取り扱い
const getDisplayName = (profile: Profile): string => {
  return profile.display_name ?? '名前未設定';
};

// 関係性の型定義
type ProfileWithSwingData = Profile & {
  swing_analyses: Array<Database['public']['Tables']['swing_analyses']['Row']>;
};
```

### 型拡張とユーティリティ型

**説明:**
型の拡張とユーティリティ型の使用ルール

**ルール:**

- TypeScript の組み込みユーティリティ型を積極的に活用する（Partial, Pick, Omit, Record 等）
- 複雑な型は小さなユーティリティ型に分解する
- インデックスシグネチャは必要な場合のみ使用する
- ジェネリック型は複雑になりすぎないように注意する

**例:**

```typescript
import { Database } from '@/types/supabase';

// 基本の型
type User = Database['public']['Tables']['users']['Row'];

// Pickを使って必要なプロパティのみを選択
type UserSummary = Pick<User, 'id' | 'email' | 'created_at'>;

// Omitを使って特定のプロパティを除外
type UserWithoutTimestamps = Omit<User, 'created_at' | 'updated_at'>;

// Partialを使ってすべてのプロパティをオプショナルに
type UserUpdateRequest = Partial<UserSummary>;

// カスタム型の定義
interface SwingAnalysisResult {
  score: number;
  strengths: string[];
  improvements: Array<{
    point: string;
    suggestion: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}
```

### 型安全性の確保

**説明:**
型安全性を確保するためのルール

**ルール:**

- any の使用は避ける
- unknown を代わりに使用し、適切な型ガードを実装する
- 型アサーションは最小限に抑える
- 型ガードと型述語を活用する

**例:**

```typescript
// ❌ 避けるべき方法
const processAnyData = (data: any) => {
  return data.value; // 型安全でない
};

// ✅ 推奨される方法
const processData = (data: unknown) => {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  return '';
};

// 型述語を使用したより良い方法
interface DataWithValue {
  value: string;
}

const isDataWithValue = (data: unknown): data is DataWithValue => {
  return typeof data === 'object' && data !== null && 'value' in data;
};

const processDataSafely = (data: unknown) => {
  if (isDataWithValue(data)) {
    return data.value; // 型安全
  }
  return '';
};
```

### 型に関するベストプラクティス

**説明:**
型定義に関するベストプラクティス

**ルール:**

- 複雑な型は可能な限り分割する
- 連合型（Union）は慎重に使用し、絞り込み条件を明確にする
- 型定義のドキュメントを充実させる
- 繰り返し使用する型は名前付き型として定義する
- 型エイリアスとインターフェースの使い分けを適切に行う
  - 拡張する可能性があるオブジェクトの型には interface を使用
  - それ以外の型には type alias を使用
