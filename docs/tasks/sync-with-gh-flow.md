# sync-with-gh コマンドフロー図

AI agentが認識しやすいように構成されたsync-with-ghコマンドの作業フロー図です。

```mermaid
flowchart TD
    %% スタート
    START([sync-with-ghコマンド開始]) --> CHECK_STATUS

    %% 変更の確認フェーズ
    CHECK_STATUS[git status実行<br/>現在の変更を確認] --> HAS_CHANGES{変更が<br/>存在するか？}
    
    HAS_CHANGES -->|いいえ| NO_CHANGES[変更なし<br/>処理終了]
    HAS_CHANGES -->|はい| ANALYZE_CHANGES
    
    %% 変更の分析フェーズ
    ANALYZE_CHANGES[変更ファイルを分析<br/>関連性を評価] --> GROUP_CHANGES
    
    GROUP_CHANGES[変更をグループ化<br/>- 機能追加<br/>- バグ修正<br/>- ドキュメント更新<br/>- テスト追加<br/>- 依存関係更新] --> INIT_GROUPS
    
    %% グループ処理の初期化
    INIT_GROUPS[グループリスト作成<br/>処理カウンター初期化] --> SELECT_GROUP
    
    %% グループ処理ループ
    SELECT_GROUP{未処理の<br/>グループが<br/>あるか？} -->|いいえ| ALL_COMPLETE
    SELECT_GROUP -->|はい| CHECKOUT_MAIN
    
    %% ブランチ作成フェーズ
    CHECKOUT_MAIN[git checkout main<br/>mainブランチに移動] --> CREATE_BRANCH
    
    CREATE_BRANCH[git checkout -b branch-name<br/>新規ブランチ作成] --> BRANCH_CREATED{ブランチ作成<br/>成功？}
    
    BRANCH_CREATED -->|いいえ| BRANCH_ERROR[エラー処理<br/>ブランチ名を変更して再試行]
    BRANCH_ERROR --> CREATE_BRANCH
    BRANCH_CREATED -->|はい| STAGE_FILES
    
    %% ステージングフェーズ
    STAGE_FILES[git add relevant-files<br/>関連ファイルをステージング] --> VERIFY_STAGING{ステージング<br/>成功？}
    
    VERIFY_STAGING -->|いいえ| STAGING_ERROR[ステージングエラー<br/>ファイルを確認]
    STAGING_ERROR --> END_ERROR
    VERIFY_STAGING -->|はい| CREATE_COMMIT
    
    %% コミットフェーズ
    CREATE_COMMIT[git commit -m message<br/>Conventional Commits形式<br/>Claude署名を含む] --> COMMIT_SUCCESS{コミット<br/>成功？}
    
    COMMIT_SUCCESS -->|いいえ| COMMIT_ERROR[コミットエラー<br/>メッセージを確認]
    COMMIT_ERROR --> END_ERROR
    COMMIT_SUCCESS -->|はい| PUSH_BRANCH
    
    %% プッシュフェーズ
    PUSH_BRANCH[git push -u origin branch-name<br/>リモートにプッシュ] --> PUSH_SUCCESS{プッシュ<br/>成功？}
    
    PUSH_SUCCESS -->|いいえ| PUSH_ERROR[プッシュエラー<br/>認証・接続を確認]
    PUSH_ERROR --> END_ERROR
    PUSH_SUCCESS -->|はい| CREATE_PR
    
    %% PR作成フェーズ
    CREATE_PR[gh pr create<br/>--title タイトル<br/>--body 説明とテストプラン] --> PR_SUCCESS{PR作成<br/>成功？}
    
    PR_SUCCESS -->|いいえ| PR_ERROR[PR作成エラー<br/>権限・設定を確認]
    PR_ERROR --> END_ERROR
    PR_SUCCESS -->|はい| LOG_SUCCESS
    
    %% 成功記録と次のグループへ
    LOG_SUCCESS[処理成功を記録<br/>PR URLを保存] --> UPDATE_COUNTER
    UPDATE_COUNTER[処理済みカウンター更新] --> SELECT_GROUP
    
    %% 完了処理
    ALL_COMPLETE[すべてのグループ処理完了<br/>作成したPRリストを表示] --> FINAL_CHECK
    
    FINAL_CHECK{すべて<br/>正常完了？} -->|はい| SUCCESS_END
    FINAL_CHECK -->|いいえ| PARTIAL_SUCCESS
    
    SUCCESS_END([正常終了<br/>すべてのPR作成完了])
    PARTIAL_SUCCESS([部分的成功<br/>一部のPRのみ作成])
    NO_CHANGES([変更なしで終了])
    END_ERROR([エラー終了])
    
    %% スタイル定義
    classDef startEnd fill:#90EE90,stroke:#006400,stroke-width:3px
    classDef error fill:#FFB6C1,stroke:#8B0000,stroke-width:2px
    classDef decision fill:#87CEEB,stroke:#4682B4,stroke-width:2px
    classDef process fill:#F0E68C,stroke:#DAA520,stroke-width:2px
    
    class START,SUCCESS_END,PARTIAL_SUCCESS,NO_CHANGES startEnd
    class END_ERROR,BRANCH_ERROR,STAGING_ERROR,COMMIT_ERROR,PUSH_ERROR,PR_ERROR error
    class HAS_CHANGES,SELECT_GROUP,BRANCH_CREATED,VERIFY_STAGING,COMMIT_SUCCESS,PUSH_SUCCESS,PR_SUCCESS,FINAL_CHECK decision
```

## AI Agent向け最適化のポイント

このmermaid図は、AI agentが認識しやすいように以下の工夫をしています：

### 1. 視覚的な区別
- **開始・終了点**: 緑色（`startEnd`クラス）で明確に区別
- **エラー処理**: 赤色（`error`クラス）で異常系を明示
- **判断ポイント**: 青色（`decision`クラス）の菱形で条件分岐を表現
- **処理ステップ**: 黄色（`process`クラス）で通常処理を表現

### 2. 明確な処理フロー
- 各ステップで実行する具体的なgitコマンドを記載
- 判断基準を明確に記述（「成功？」「存在するか？」）
- エラー時の処理パスを明示

### 3. ループ構造の可視化
- グループごとの処理がループになることを明確に表現
- カウンター更新による進行管理を明示

### 4. 状態管理
- 処理の進行状況が追跡可能
- 部分的成功と完全成功を区別

### 5. エラーハンドリング
- 各フェーズでのエラー処理を明示
- リトライ可能な箇所（ブランチ作成）を表現

この構成により、AI agentは：
- どの段階で何を実行すべきか明確に理解できる
- エラー時の対処方法が分かる
- 全体の処理フローを俯瞰的に把握できる