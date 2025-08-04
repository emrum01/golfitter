# Sync with GitHub Command

## Command
`sync-with-gh`

## Description
残りの変更を関連するものごとにブランチ作成→コミット→push→PR作成を行います。

## Usage
このコマンドを実行すると、以下の処理を自動的に行います：

1. 現在の変更を確認・分析
2. 関連する変更をグループ化
3. 各グループごとに以下を実行：
   - 新しいブランチを作成
   - 関連ファイルをステージング
   - 適切なコミットメッセージでコミット
   - GitHubにpush
   - プルリクエストを作成

## Prompt Template
```
残りの変更を関連するものごとにブランチ作成→コミット→push→PR作成を行なってください。

また、.claude/commands配下にsync-with-ghコマンドとして上記のプロンプトを作成してください。
```

## 実行例
変更がある場合の一般的な処理フロー：

### 1. 変更の確認
```bash
git status
```

### 2. 関連する変更のグループ化
- 機能追加
- バグ修正
- ドキュメント更新
- テスト追加
- 依存関係の更新

### 3. 各グループの処理
```bash
# ブランチ作成
git checkout -b feat/feature-name

# ファイル追加
git add relevant-files

# コミット
git commit -m "feat: 機能の説明

- 変更点1
- 変更点2
- 変更点3

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push
git push -u origin feat/feature-name

# PR作成
gh pr create --title "タイトル" --body "説明"
```

## Notes
- 各ブランチは`main`から作成されます
- コミットメッセージは[Conventional Commits](https://www.conventionalcommits.org/)形式に従います
- PRには適切なテストプランを含めます
- 大きな変更は複数のPRに分割されます

## Related Commands
- `git status` - 変更の確認
- `git checkout -b` - ブランチ作成
- `git add` - ファイルのステージング
- `git commit` - コミット作成
- `git push` - リモートへのpush
- `gh pr create` - PR作成