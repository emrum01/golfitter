## TDDとStorybookを活用したコンポーネント開発

### TDDの基本原則

**説明:**
TDDの基本原則とメリットについては、[TDDとTidy First開発ガイド](/docs/development/tdd-guide.md)を参照してください。

このドキュメントでは、Storybookのplay関数を使用したTDDの具体的な実装方法に焦点を当てます。

### StorybookでのTDD実装フロー

**説明:**
[TDDの基本サイクル](/docs/development/tdd-guide.md#tddの基本サイクル)をStorybookで実践する方法

#### 各フェーズの実装とコマンド

**Rules:**

1. **🔴 RED Phase - Storybookでテストを書く**
   ```bash
   # 1. Storybookファイルを作成
   touch ComponentName.stories.tsx
   
   # 2. play関数で失敗するテストを記述（下記テンプレート参照）
   
   # 3. Storybookを起動して失敗を確認
   pnpm storybook:crm  # または pnpm storybook:cus
   ```

2. **🟢 GREEN Phase - 最小限の実装**
   ```bash
   # 1. コンポーネントファイルを作成
   touch ComponentName.tsx
   
   # 2. テストを通す最小限の実装を記述
   
   # 3. 変更したファイルのテストが通ることを確認（--runで一度だけ実行）
   pnpm vitest:crm ComponentName.stories --run  # CRM用
   # または
   pnpm vitest:cus ComponentName.stories --run  # Customer用
   
   # 注: vitestはファイル名のパターンマッチングを使用
   # より具体的に指定する場合:
   # pnpm vitest:crm src/components/ComponentName/ComponentName.stories --run
   ```

3. **🔵 REFACTOR Phase - 構造の改善**
   ```bash
   # 1. コードの品質を改善
   
   # 2. 各変更後に該当ファイルのテストを実行（--runで一度だけ実行）
   pnpm vitest:crm ComponentName.stories --run  # CRM用
   # または
   pnpm vitest:cus ComponentName.stories --run  # Customer用
   
   # 3. 全体の品質チェック
   pnpm validate  # lint:fix + fix:prettier + check-types
   ```

**注意:** 各フェーズの詳細な説明は[TDDガイド](/docs/development/tdd-guide.md)を参照

### Figmaからのコード生成

**説明:**
FigmaデザインからMCPツールを使用してコードを生成する方法

**Rules:**

1. FigmaのnodeIdを使用してコードを生成
   ```typescript
   // mcp__figma-mcp__get_code でコンポーネントのコードを生成
   // mcp__figma-mcp__get_variable_defs で変数定義を取得
   // mcp__figma-mcp__get_code_connect_map でコードマッピングを確認
   ```

2. 生成コードの調整
   - 006_component.mdのコンポーネント実装ルールに準拠
   - 009_styling.mdのスタイリングルールに準拠
   - 003_type_definitions.mdの型定義ルールに準拠

### Play関数によるテスト実装

**説明:**
Storybookのplay関数を使用したテスト実装パターン（🔴 RED Phase用）

#### Storybookテンプレート（RED Phase）

**説明:**
コンポーネントが存在しない状態で書くテストテンプレート

**Example:**

```typescript
// ComponentName.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect, waitFor, fn } from '@storybook/test';
// まだ存在しないコンポーネントをインポート（RED Phase）
import { ComponentName } from './ComponentName';

const meta = {
  title: 'Category/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // Props の型定義
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // デフォルトのprops
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // テストを書く（最初は失敗する）
    await expect(canvas.getByText('期待するテキスト')).toBeInTheDocument();
  },
};
```

#### モックの扱い方

**説明:**
play関数でのモック関数とデータの管理方法

**Rules:**

1. イベントハンドラのモック
   ```typescript
   import { fn } from '@storybook/test';
   
   const handleClick = fn();
   
   export const WithMockHandler: Story = {
     args: {
       onClick: handleClick,
     },
     play: async ({ canvasElement, args }) => {
       const canvas = within(canvasElement);
       await userEvent.click(canvas.getByRole('button'));
       await expect(args.onClick).toHaveBeenCalledTimes(1);
     },
   };
   ```

2. APIレスポンスのモック
   - モックデータは`repositories/mocks`に配置（`010_testing.md`参照）
   - MSWを使用する場合は`.storybook/preview.tsx`で設定

3. 非同期処理のモック
   ```typescript
   play: async ({ canvasElement }) => {
     const canvas = within(canvasElement);
     
     // 非同期処理の完了を待つ
     await waitFor(() => {
       expect(canvas.getByText('データ')).toBeInTheDocument();
     }, { timeout: 3000 });
   },
   ```

#### テストパターン集

**説明:**
頻出するテストパターンのリファレンス

##### 1. 表示・レンダリングテスト

```typescript
play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  
  // 基本的な存在確認
  await expect(canvas.getByRole('button')).toBeInTheDocument();
  await expect(canvas.getByText('送信')).toBeInTheDocument();
  
  // 属性の確認
  await expect(canvas.getByRole('button')).toHaveAttribute('type', 'submit');
  await expect(canvas.getByRole('button')).toBeDisabled();
  
  // スタイルの確認
  await expect(canvas.getByRole('button')).toHaveClass('primary-button');
  
  // アクセシビリティの確認
  await expect(canvas.getByRole('button')).toHaveAccessibleName('送信ボタン');
},
```

##### 2. ユーザーインタラクション

```typescript
play: async ({ canvasElement, args }) => {
  const canvas = within(canvasElement);
  
  // クリックイベント
  await userEvent.click(canvas.getByRole('button'));
  await expect(args.onClick).toHaveBeenCalledTimes(1);
  
  // キーボードイベント
  await userEvent.type(canvas.getByRole('textbox'), 'Hello{enter}');
  await expect(args.onSubmit).toHaveBeenCalled();
  
  // ホバー・フォーカス
  await userEvent.hover(canvas.getByRole('button'));
  await userEvent.tab(); // フォーカス移動
},
```

##### 3. フォーム操作

```typescript
play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  
  // テキスト入力
  const emailInput = canvas.getByLabelText('メールアドレス');
  await userEvent.clear(emailInput);
  await userEvent.type(emailInput, 'test@example.com');
  await expect(emailInput).toHaveValue('test@example.com');
  
  // セレクトボックス
  await userEvent.selectOptions(canvas.getByRole('combobox'), '東京');
  
  // チェックボックス
  await userEvent.click(canvas.getByRole('checkbox'));
  await expect(canvas.getByRole('checkbox')).toBeChecked();
},
```

##### 4. 非同期処理と状態遷移

```typescript
play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  
  // 初期ローディング状態
  await expect(canvas.getByRole('progressbar')).toBeInTheDocument();
  
  // データ取得完了を待つ
  await waitFor(() => {
    expect(canvas.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(canvas.getByText('データ')).toBeInTheDocument();
  }, { timeout: 3000 });
  
  // エラー状態の確認
  await userEvent.click(canvas.getByText('再試行'));
  await waitFor(() => {
    expect(canvas.getByRole('alert')).toHaveTextContent('エラーが発生しました');
  });
},
```

### ストーリーの整理

**説明:**
複数のストーリーでテストケースを効果的に整理する方法

#### 状態別のストーリー

**Rules:**

```typescript
export const Default: Story = {
  play: async ({ canvasElement }) => {
    // デフォルト状態のテスト
  },
};

export const Loading: Story = {
  args: { isLoading: true },
  play: async ({ canvasElement }) => {
    // ローディング状態のテスト
  },
};

export const Error: Story = {
  args: { error: 'エラーメッセージ' },
  play: async ({ canvasElement }) => {
    // エラー状態のテスト
  },
};
```

#### シナリオベースのストーリー

**Rules:**

```typescript
export const UserJourney: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Step 1: 初期表示
    await expect(canvas.getByText('ステップ1')).toBeInTheDocument();
    
    // Step 2: 次へボタンをクリック
    await userEvent.click(canvas.getByRole('button', { name: '次へ' }));
    
    // Step 3: 次のステップが表示される
    await expect(canvas.getByText('ステップ2')).toBeInTheDocument();
  },
};
```

### 品質チェック

**説明:**
実装完了後の品質確認プロセス

#### 実行コマンド

**Rules:**

```bash
# 型チェック
pnpm check-types

# Lint
pnpm lint

# Lint自動修正
pnpm lint:fix

# Prettierチェック
pnpm lint:prettier

# Prettier自動修正
pnpm fix:prettier

# 一括検証（lint:fix + fix:prettier + check-types）
pnpm validate

# Storybookの起動（CRM用）
pnpm storybook:crm

# Storybookの起動（Customer用）
pnpm storybook:cus

# テストの実行（特定ファイルのみ、--runで一度だけ実行）
pnpm vitest:crm ComponentName.stories --run  # CRM用（ファイル名パターンマッチング）
pnpm vitest:cus ComponentName.stories --run  # Customer用（ファイル名パターンマッチング）

# 全テストの実行
pnpm test  # すべてのテストを実行する場合（CI環境では自動的に--runモード）
```

#### チェックリスト

**Rules:**

- [ ] すべてのStorybook play関数のテストが通過
- [ ] 型エラーがない
- [ ] Lintエラーがない
- [ ] フォーマットが整っている
- [ ] Storybookで正しく表示される
- [ ] インタラクションが正しく動作する

### ベストプラクティス

**説明:**
Storybookを使用したTDD実践時の推奨事項

**注意:** TDDの一般的なベストプラクティスは[TDDガイド](/docs/development/tdd-guide.md#実践チェックリスト)を参照

#### Storybook固有のベストプラクティス

**Rules:**

1. **play関数の適切な使用**
   - 1つのplay関数で1つの振る舞いをテスト
   - ユーザー視点でのテストを心がける
   - 実装詳細ではなくインターフェースをテスト

2. **クエリの選択**
   - `getByRole`を優先使用（アクセシビリティも確保）
   - `getByLabelText`でフォーム要素を取得
   - `getByText`は表示テキストの確認に使用

3. **非同期処理の扱い**
   - `waitFor`で条件を待つ（固定時間の待機は避ける）
   - `findBy*`クエリで要素の出現を待つ
   - タイムアウト時間は適切に設定

### トラブルシューティング

**説明:**
よくある問題と対策

#### 要素が見つからない

**Rules:**

- `screen.debug()`でDOM構造を確認
- 適切なクエリ（getByRole, getByLabelText等）を使用
- 非同期レンダリングの場合は`waitFor`を使用

#### タイミングの問題

**Rules:**

- `waitFor`で要素の出現を待つ
- `userEvent`の各操作の間に適切な待機
- `delay`オプションで入力速度を調整

#### 状態の初期化

**Rules:**

- 各テストの前に状態をリセット
- モックのクリア
- 必要に応じて`beforeEach`相当の処理

#### Storybookテストのエラー

**Rules:**

- `@storybook/test`から必要な関数をインポート
- play関数内での非同期処理に注意
- 型定義の整合性を確認

### 実装完了チェックリスト

**説明:**
各フェーズのコマンド実行を含む確認項目

#### TDDサイクルの確認

**Rules:**

- [ ] **🔴 RED Phase**
  - [ ] Storybookファイル（.stories.tsx）を作成した
  - [ ] play関数でテストを書いた
  - [ ] `pnpm storybook:crm`でテストが失敗することを確認した

- [ ] **🟢 GREEN Phase**
  - [ ] コンポーネントファイル（.tsx）を作成した
  - [ ] 最小限の実装をした
  - [ ] `pnpm vitest:crm ComponentName.stories --run`でテストが通ることを確認した

- [ ] **🔵 REFACTOR Phase**
  - [ ] コードの品質を改善した
  - [ ] `pnpm validate`で品質チェックを実行した
  - [ ] すべてのテストが通ることを確認した

#### 最終確認

- [ ] Figmaデザインと一致している
- [ ] アクセシビリティが考慮されている
- [ ] 他のルールファイルに準拠している

### 関連ドキュメント

**説明:**
参照すべき関連ドキュメント

**TDD関連:**
- [TDDとTidy First開発ガイド](/docs/development/tdd-guide.md) - TDDの基本原則とサイクル

**実装ルール:**
- `006_component.md` - コンポーネントの基本構造
- `010_testing.md` - Storybookの基本設定とモックデータ管理
- `003_type_definitions.md` - 型定義のルール
- `009_styling.md` - スタイリングのルール

**外部資料:**
- [Storybook Play Functions](https://storybook.js.org/docs/react/writing-tests/interaction-testing)
- [Testing Library Query Priority](https://testing-library.com/docs/queries/about#priority)