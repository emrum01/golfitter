# テスト修正ワークフロー

## 概要
TDDサイクルから逸脱して複数のテストが失敗している状況での体系的な修正手順。

## 適用基準

### このワークフローを使う場合
- CI/CDがブロックされている
- 他の開発者の作業に影響が出ている
- 複数の機能領域でテストが失敗している
- 単純な修正では解決できない

### 使わない場合
- 失敗が特定の機能に限定されている
- 原因が明確で即座に修正可能
- 通常のTDDサイクルで対応可能

## 緊急対応フロー

```mermaid
graph TD
    Start([テスト大量失敗]) --> Emergency{緊急度判定}
    
    Emergency -->|開発停止レベル| Rollback[ロールバック検討]
    Emergency -->|対応可能| Initial[初期分析]
    
    Rollback --> RollbackDecision{ロールバック可能?}
    RollbackDecision -->|Yes| DoRollback[ロールバック実行]
    RollbackDecision -->|No| TimeBox[タイムボックス設定]
    
    DoRollback --> Analyze[原因分析]
    TimeBox --> Initial
    
    Initial --> Triage[トリアージ]
    Triage --> Fix[段階的修正]
    Fix --> Verify[検証]
    
    Verify --> Complete{修正完了?}
    Complete -->|No| TimeCheck{制限時間内?}
    TimeCheck -->|Yes| Fix
    TimeCheck -->|No| Escalate[エスカレーション]
    
    Complete -->|Yes| Prevention[再発防止]
    Escalate --> Prevention
    Analyze --> Prevention
    
    Prevention --> End([TDDサイクル復帰])
    
    style Start fill:#ff6b6b
    style Rollback fill:#ff6b6b
    style TimeBox fill:#ffd43b
    style End fill:#51cf66
```

## Phase 0: 緊急判断（5分以内）

### 0.1 影響度の確認

```bash
# CIの状態確認
git log --oneline -1 # 最新コミット確認
npm run test 2>&1 | grep -c "FAIL" # 失敗数カウント

# 影響範囲の特定
npm run test 2>&1 | grep "FAIL" | cut -d' ' -f2 | sort | uniq
```

### 0.2 ロールバック判断

```mermaid
graph TD
    A[失敗確認] --> B{本番影響あり?}
    
    B -->|Yes| C[即座にロールバック]
    B -->|No| D{CI/CDブロック?}
    
    D -->|Yes| E{30分で修正可能?}
    D -->|No| F[通常フローで対応]
    
    E -->|No| G[ロールバック推奨]
    E -->|Yes| H[タイムボックス修正]
    
    C --> I[ロールバック実行]
    G --> I
    
    I --> J[git revert/reset]
    J --> K[原因分析開始]
    
    style C fill:#ff6b6b
    style I fill:#ff6b6b
    style H fill:#ffd43b
```

### 0.3 タイムボックスの設定

| 状況 | 制限時間 | アクション |
|------|----------|------------|
| 本番デプロイ前 | 30分 | 修正 or ロールバック |
| 開発ブロック | 2時間 | 段階的修正 |
| 低影響 | 1日 | 計画的修正 |

## Phase 1: 初期分析（15分）

### 1.1 失敗パターンの特定

```bash
# テスト失敗の詳細取得
npm run test -- --reporter=json > test-results.json 2>&1

# 失敗の種類別集計
npm run test 2>&1 | grep -E "Error:|Expected|Received" | sort | uniq -c | sort -nr

# 最近の変更確認
git log --since="2 hours ago" --name-only --oneline
```

### 1.2 原因の分類と対応

```mermaid
graph TD
    Failure[テスト失敗] --> Type{失敗タイプ}
    
    Type --> Env[環境要因]
    Type --> Code[コード変更]
    Type --> Test[テスト品質]
    Type --> External[外部要因]
    
    Env --> EnvFix[キャッシュクリア<br/>依存関係更新]
    Code --> CodeFix[変更箇所特定<br/>インターフェース確認]
    Test --> TestFix[セレクタ修正<br/>非同期処理改善]
    External --> ExtFix[API確認<br/>モック更新]
    
    EnvFix --> QuickWin{即座に解決?}
    CodeFix --> QuickWin
    TestFix --> QuickWin
    ExtFix --> QuickWin
    
    QuickWin -->|Yes| Apply[適用]
    QuickWin -->|No| Prioritize[優先順位付け]
```

## Phase 2: トリアージ（30分）

### 2.1 優先順位マトリクス

```mermaid
graph TD
    subgraph "優先順位マトリクス"
        A[高影響・高緊急<br/>🔴 P0: 即座に修正]
        B[高影響・低緊急<br/>🟠 P1: 4時間以内]
        C[低影響・高緊急<br/>🟡 P2: 当日中]
        D[低影響・低緊急<br/>🟢 P3: 計画的]
    end
    
    A --> A1[本番機能]
    A --> A2[CI/CDブロック]
    
    B --> B1[重要機能のエッジケース]
    B --> B2[パフォーマンステスト]
    
    C --> C1[開発効率に影響]
    C --> C2[特定環境のみ]
    
    D --> D1[リファクタリング関連]
    D --> D2[将来機能のテスト]
```

### 2.2 並行作業の調整

```typescript
// テストを一時的に分離
describe.skip('修正中: #issue-123', () => {
  // 修正中のテスト
});

// 代替テストの提供
describe('暫定テスト', () => {
  test('最小限の動作確認', () => {
    // クリティカルな機能のみ確認
  });
});
```

## Phase 3: 段階的修正

### 3.1 修正戦略

```mermaid
graph LR
    subgraph "修正アプローチ"
        A[単体修正] --> A1[個別に修正]
        B[一括修正] --> B1[パターン置換]
        C[段階修正] --> C1[機能単位で修正]
        D[一時回避] --> D1[条件付きスキップ]
    end
    
    A1 --> Time1[5分/テスト]
    B1 --> Time2[30分/パターン]
    C1 --> Time3[1時間/機能]
    D1 --> Time4[1分/テスト]
```

### 3.2 共通パターンの修正

#### セレクタの改善
```typescript
// 🔴 Bad: 実装詳細に依存
const element = container.querySelector('.btn-primary');

// 🟢 Good: アクセシブルなセレクタ
const element = screen.getByRole('button', { name: /submit/i });
```

#### 非同期処理の改善
```typescript
// 🔴 Bad: 固定時間待機
await new Promise(r => setTimeout(r, 1000));

// 🟢 Good: 条件待機
await waitFor(() => expect(screen.getByText('完了')).toBeInTheDocument());
```

#### モックの改善
```typescript
// 🔴 Bad: グローバルモック
jest.mock('./api');

// 🟢 Good: テスト単位のモック
const mockApi = jest.fn();
jest.mock('./api', () => ({ api: mockApi }));

beforeEach(() => {
  mockApi.mockClear();
});
```

## Phase 4: 検証と安定化

### 4.1 段階的検証

```bash
# Level 1: クリティカルパスの確認
npm run test -- --testPathPattern="critical|core"

# Level 2: 機能単位の確認
npm run test -- --testPathPattern="features"

# Level 3: 全体確認
npm run test

# Level 4: 関連チェック
npm run lint && npm run typecheck && npm run build
```

### 4.2 修正品質の確認

```mermaid
graph TD
    Test[修正したテスト] --> Check{チェック項目}
    
    Check --> Stable[安定性]
    Check --> Maintain[保守性]
    Check --> Perf[パフォーマンス]
    
    Stable --> S1[環境非依存]
    Stable --> S2[タイミング非依存]
    
    Maintain --> M1[意図が明確]
    Maintain --> M2[DRY原則]
    
    Perf --> P1[実行時間 < 1秒]
    Perf --> P2[並列実行可能]
```

## Phase 5: 根本原因分析

### 5.1 なぜTDDから逸脱したか

```mermaid
graph TD
    Root[TDD逸脱] --> Why{なぜ？}
    
    Why --> Pressure[時間的プレッシャー]
    Why --> Knowledge[知識不足]
    Why --> Process[プロセス不備]
    Why --> Tool[ツール問題]
    
    Pressure --> P1[非現実的な締切]
    Knowledge --> K1[TDD未経験]
    Process --> Pr1[レビュー不足]
    Tool --> T1[テスト環境不安定]
    
    P1 --> Action1[スケジュール見直し]
    K1 --> Action2[チーム教育]
    Pr1 --> Action3[プロセス改善]
    T1 --> Action4[環境整備]
```

### 5.2 再発防止策

| 原因 | 短期対策 | 長期対策 |
|------|----------|----------|
| 時間不足 | ペアプロ/モブプロ | スプリント計画改善 |
| スキル不足 | メンター制度 | TDD研修実施 |
| プロセス | PR必須化 | CI/CD強化 |
| 環境問題 | Docker化 | テスト基盤刷新 |

## Phase 6: チーム連携

### 6.1 コミュニケーション

```markdown
## 🚨 テスト修正状況

### 現状
- 失敗数: 45 → 12件（残り12件）
- 影響: CI/CDパイプライン停止中
- 推定修正時間: 2時間

### 対応中
- @user1: 認証系テスト修正中（P0）
- @user2: UIコンポーネント修正中（P1）

### ブロッカー
- [ ] APIモックの更新が必要（@backend-team）

### 次のステップ
- 14:00 状況確認MTG
- 16:00 修正完了予定
```

### 6.2 エスカレーション基準

```mermaid
graph TD
    Issue[問題発生] --> Severity{深刻度}
    
    Severity -->|低| Dev[開発チーム内で解決]
    Severity -->|中| Lead[テックリード相談]
    Severity -->|高| Manager[マネージャーエスカレーション]
    
    Manager --> Decision{判断}
    Decision --> Rollback[ロールバック]
    Decision --> Resource[リソース追加]
    Decision --> Descope[スコープ縮小]
```

## まとめ

### Do's ✅
- タイムボックスを設定する
- ロールバックを恐れない
- 小さな成功を積み重ねる
- チームとコミュニケーションを取る
- 根本原因を分析する

### Don'ts ❌
- すべてを一度に修正しようとする
- 原因分析をスキップする
- 一人で抱え込む
- テストの品質を犠牲にする
- 同じ失敗を繰り返す

## コマンドリファレンス

```bash
# 緊急対応
git revert HEAD                # 直前のコミットを取り消し
git reset --hard HEAD~1        # 直前のコミットを削除（注意）

# 分析
npm run test -- --listTests    # テストファイル一覧
npm run test -- --findRelatedTests [file] # 関連テスト実行

# 修正
npm run test -- --watch        # 変更監視モード
npm run test -- --bail         # 最初のエラーで停止

# 検証
npm run test -- --changedSince=main # mainとの差分のみテスト
npm run test -- --coverage     # カバレッジ確認
```

## 関連ドキュメント

- `/docs/rules/tdd-guideline.md` - TDDの基本原則
- `/docs/rules/frontend/011_tdd_with_storybook.md` - StorybookでのTDD
- `/tasks/implementation.md` - 通常の実装フロー
- `.github/ISSUE_TEMPLATE/test-failure.md` - テスト失敗時のイシューテンプレート