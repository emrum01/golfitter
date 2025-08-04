## テストルール

### Storybook の実装

**説明:**
Storybook の実装ルール

#### ファイル構造

- コンポーネントと同じディレクトリに配置
- ファイル名は{ComponentName}.stories.tsx の形式
- Mock データは next/apps/xxx/src/repositories/mocks に配置

#### モックデータ

**説明:**
モックデータの管理

**Rules:**

- モックデータは専用の関数として実装
- 関数名は create{Entity}Mock の形式
- パラメータでデータの一部を上書き可能に

**Example:**

```typescript
// next/apps/xxx/src/repositories/mocks/user.ts
export const createUserMock = ({ age }: { age: number }) => ({
  // モックの中身
});
```

#### ストーリーの実装

**説明:**
ストーリーの実装方法

**Rules:**

- @storybook/react から Meta, StoryObj をインポート
- コンポーネントの型を StoryObj で指定
- meta オブジェクトでデフォルト設定を定義
- 各ストーリーに JSDoc で説明を記述

**Example:**

```typescript
import { createUserMock } from '@xxx/repositories/mocks/user';
import { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

type Story = StoryObj<typeof ComponentName>;

const meta = {
  component: ComponentName,
  args: {
    user: createUserMock({ age: 40 }),
  },
} satisfies Meta<typeof ComponentName>;

export default meta;

/**
 * @description デフォルトのストーリー
 */
export const Default: Story = {};

/**
 * @description バリエーションのストーリー
  args: {
    user: createUserMock({ age: 1000 }),
  },
};
```

### コンポーネントテスト

**説明:**
コンポーネントのインタラクションテスト

**Rules:**

- @storybook/test から Vitest の API を使用（expect, fn 等）
- play 関数内でインタラクションをテスト
- step でテストをグループ化
- canvas を直接引数から取得可能

**Example:**

```typescript
import { userEvent, expect, fn } from '@storybook/test';
```

**アサーション:**

- expect を使用して要素の存在や状態を検証
- fn でモック関数を作成し、呼び出しを検証
- waitFor で非同期の状態変更を待機

**ステップ関数:**

- 関連する操作をグループ化
- テストの可読性を向上
- デバッグ時の階層的な表示をサポート

### ベストプラクティス

- ストーリーごとに明確な目的を持たせる
- 各ストーリーは独立して動作可能にする
- コンポーネントの主要なバリエーションをカバー
- エッジケースや特殊なケースも考慮
- JSDoc によるストーリーの説明を必須とする
- インタラクションテストは意図を明確に示す
- step を使用してテストを論理的にグループ化

### インタラクションテストのベストプラクティス

**説明:**
インタラクションテストの実装ベストプラクティス

**Rules:**

- テストの意図を明確に示すステップ名を使用
- 複雑なインタラクションは小さなステップに分割
- 非同期処理は適切に待機
- エラーケースも考慮したテスト実装

**Example:**

```typescript
export const ComplexInteraction: Story = {
  play: async ({ canvas, step }) => {
```

### テストデータの管理

**説明:**
テストデータの管理方法

**Rules:**

- モックデータは実際のデータ構造を反映
- 再利用可能なモックデータ生成関数の作成
- エッジケース用のデータセットも用意
- テストの意図が分かりやすいデータ設定
