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

- API の型定義は`@gen`パッケージから取得する
- 独自の型定義を作成せず、生成された型を使用する
- `next/api`からの型インポートは禁止
- Protocol Buffers のメッセージは PlainMessage を使用

### Protocol Buffers 型の使用

**説明:**
Protocol Buffers の型を安全に使用するためのルール

**ルール:**

- メッセージ型は PlainMessage として扱う
- 列挙型はそのまま使用する
- オプショナルフィールドは undefined チェックを行う
- 配列フィールドは必ず空の配列でチェックする

**例:**

```typescript
import { Customer, ExaminationStatus } from '@tenet-app/gen/admin/v1/customer_pb';
import type { PlainMessage } from '@bufbuild/protobuf';

// PlainMessageを使用してProto型を扱う
type CustomerProps = {
  customer: PlainMessage<Customer>;
  status: ExaminationStatus;
};

// オプショナルフィールドの取り扱い
const getName = (customer: PlainMessage<Customer>): string => {
  return customer.name ?? '名称未設定';
};

// 配列フィールドの取り扱い
const getExaminations = (customer: PlainMessage<Customer>) => {
  return customer.examinations ?? [];
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
import { Customer } from '@tenet-app/gen/admin/v1/customer_pb';
import type { PlainMessage } from '@bufbuild/protobuf';

// 基本の型
type CustomerBasic = PlainMessage<Customer>;

// Pickを使って必要なプロパティのみを選択
type CustomerSummary = Pick<CustomerBasic, 'id' | 'name' | 'phoneNumber'>;

// Omitを使って特定のプロパティを除外
type CustomerWithoutHistory = Omit<CustomerBasic, 'examinationHistory'>;

// Partialを使ってすべてのプロパティをオプショナルに
type CustomerUpdateRequest = Partial<CustomerSummary>;
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
