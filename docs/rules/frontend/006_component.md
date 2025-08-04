## コンポーネント実装

### コンポーネントの構成

**説明:**
コンポーネントの構成と責務分担に関する必須のルール

#### コンポーネントの実装ルール

**説明:**
コンポーネントを実装する際の必須ルール

**Rules:**

1. 実装ルール
   - アロー関数で実装
   - FC で型定義を行う
2. ファイル構成
   - コンポーネントファイル: `ComponentName.tsx`
   - 型定義ファイル（出来うる限りこのファイルは作らず,コンポーネント内に型定義する）: `types.ts`
   - バレルファイル: `index.ts`
   - Storybook ファイル: `ComponentName.stories.tsx`

**Example:**

```
myComponent/
├── MyComponent.tsx        # コンポーネント実装
├── MyComponent.stories.tsx # Storybook実装
├── types.ts              # 型定義（出来うる限りこのファイルは作らず,コンポーネント内に型定義する）
└── index.ts             # バレルファイル
```

#### コンポーネントの責務

##### 親コンポーネント

**説明:**
親コンポーネントの責務

**Rules:**

- データの受け取りと下層コンポーネントへの受け渡し
- 全体のレイアウト管理
- 子コンポーネント間の連携

##### 子コンポーネント

**説明:**
子コンポーネントの責務

**Rules:**

- 受け取ったデータの加工・変換ロジック
- UI の詳細な実装
- コンポーネント固有のロジック

### 命名規則

**説明:**
コードの可読性と一貫性を保つための必須の命名規則

#### コンポーネント

- Pascal ケースを使用する（例: UserProfile）
- 意味のある名前を使用する
- 接頭辞や接尾辞は避ける（例: ×UserProfileComponent）

#### 関数

- キャメルケースを使用する（例: getUserData）
- 動詞で始める（例: get、set、update、create）
- boolean 値を返す場合は is、has、can などで始める
- 副作用を伴う関数には do、execute などを使用する

#### 変数

- キャメルケースを使用する
- 明確で説明的な名前を使用する
- 略語は一般的なもののみ使用する
- 配列の場合は複数形にする
- API レスポンスのデータは具体的な内容を示す名前をつける
- 抽象的な命名を避ける（例: ×data、info、content、item）
- 可能な限り const を使用する
- let の使用は最小限に抑える
- 状態変更が必要な場合でも、再代入を避ける工夫を優先する

#### 状態変数

**接頭辞:**

- is: ブール値（例: isActive）
- has: 所有フラグ（例: hasPermission）
- can: 能力フラグ（例: canEdit）
- should: 条件フラグ（例: shouldUpdate）
- on: イベントハンドラ（例: onClick、onSubmit）

### 不変性

**ルール:**

- 配列やオブジェクトに対して破壊的な操作を避ける
- 破壊的メソッド（push、pop、splice、sort、reverse など）の使用を禁止
- 非破壊的メソッド（map、filter、reduce、concat、slice、toSpliced、toSorted、toReversed など）を使用
- 状態管理では常に新しい状態オブジェクトを作成して返す

**例:**
❌ Bad:

```typescript
array.push(newItem);
array.sort();
```

✅ Good:

```typescript
const newArray = [...array, newItem];
const sortedArray = [...array].sort();
```

### コードの分割に関するルール

**ルール:**

- 関数やコンポーネントが複雑化した場合、責務ごとに小さく分割する
- 過剰な分割は避け、単一責務を超えた場合に分割する
- 分割したモジュール間の依存関係を単純に保つ
- 親子関係がわかる命名を使用する（例: UserList → UserListItem）
- 3 行以下のシンプルなイベントハンドラ関数は作成しない（DOM に直接処理を記述する）

### 条件分岐

**説明:**
条件分岐の簡略化

**ルール:**

- 条件分岐のネストを最小限に抑える
- 早期リターンを活用してネストを減らす

### イベントハンドラー

**ルール:**

- シンプルな処理は関数を作成せず DOM に直接記述する
- 以下の場合は関数として切り出す:
  - 複数の処理を組み合わせる場合
  - エラーハンドリングが必要な場合
  - 非同期処理を含む場合
  - 同じ処理を複数箇所で使用する場合
  - テストが必要な複雑なロジックを含む場合

**例:**
❌ Bad:

```typescript
const handleInputChange = (e) => {
  setValue(e.target.value);
};
return <input onChange={handleInputChange} />;
```

✅ Good:

```typescript
return <input onChange={(e) => setValue(e.target.value)} />;
```

### 画面遷移の最適化

**説明:**
画面遷移のパフォーマンス最適化に関するルール

**Rules:**

- 動的ルートでは必要に応じて明示的な prefetch を検討
- ページコンポーネントの適切な分割
- ルート単位でのコード分割

**Example:**

```typescript
const Component = ({ userId }: { userId: string }) => {
  const router = useRouter();
  useEffect(() => {
    if (userId) {
      router.prefetch(`/users/${userId}/profile`);
    }
  }, [userId, router]);
  return <div>...</div>;
};
```
