## スタイリングルール

### Tailwind CSS

**ルール:**

- avoid_invalid_class_names:
  - arbitrary_values: use_bracket_notation
  - example: w-[250px]
- use_tw_merge_for_dynamic_styles

**レスポンシブデザイン:**
ブレイクポイント:

- sm
- md
- lg
- xl

### 一般

- apply_only_essential_styles_to_generic_components
- use_gap_instead_of_margin_for_spacing

#### 余白

**説明:**
要素間の余白設定

**ルール:**

- FlexBox/Grid コンテナ内の要素間の余白には gap を使用すること
- 親要素に対する余白には padding を使用すること
- 要素同士の余白には space クラスを使用すること（space-x-_, space-y-_）

**例:**

- `<div class="flex gap-4">` # FlexBox 内の要素間に 16px の余白
- `<div class="grid gap-x-4 gap-y-6">` # Grid 内の要素間に横 16px、縦 24px の余白
- `<div class="space-y-4">` # 縦方向に 16px の余白
- `<div class="space-x-4">` # 横方向に 16px の余白

**注意:**

- 個別の margin の設定は避け、代わりに gap または space クラスを使用すること
- 要素間の一貫した余白を維持するために、4 の倍数の値を使用すること

#### レイアウトの選択

##### グリッド

**使用ケース:**

- complex_layouts
- clear_area_divisions
- equal_spacing_requirements

**例:**

- dashboards
- grid_designs
- header_sidebar_main_footer_layouts
コンテンツサイズに応じた柔軟なグリッドレイアウトが必要な場合

**ルール:**

- コンテンツに応じて高さや幅を自動調整する場合は auto-rows-auto または auto-cols-auto を使用すること

**例:**

- `<div class="grid auto-rows-auto">`
- `<div class="grid auto-cols-auto">`

##### フレックス

**使用ケース:**

- single_direction_item_alignment
- content_size_based_layout
- dynamic_order_changes
- center_alignment_needs

**例:**

- navigation_bars
- button_rows
- dynamic_content_adjustment

### アクセシビリティ

#### キーボードサポート

**説明:**
キーボード操作のサポート

**ルール:**

- フォーカス可能な要素には適切なタブインデックスを設定
- キーボードでの操作性を確保
- フォーカスの視覚的なフィードバックを提供

**例:**

```typescript
<button
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleAction();
    }
  }}
>
```

#### カラーコントラスト

**説明:**
色のコントラスト

**ルール:**

- テキストと背景のコントラスト比を確保（WCAG AA レベル以上）
- 色だけでなく、形状や記号でも情報を伝える
- ホバーやフォーカス時の視覚的なフィードバックを提供
