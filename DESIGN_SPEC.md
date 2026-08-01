# TEXTRO99 説明サイト — デザイン仕様書

Top / Planning ページで確定したデザイン方針。フロント / バックエンドページを追加する際は、この仕様に合わせて実装すること。

## 0. 技術基盤

- 各ページは `<Name>.dc.html`（Design Component）。`<x-dc>` 内テンプレート + `<script data-dc-script>` 内ロジッククラス（`class Component extends DCLogic`）の構成。**CDATAラッパーは絶対に使わない**（`<![CDATA[` を書くとブラウザは素通しでテキストとして扱い、JSがそのまま構文エラーになる — 過去に2度これで壊れた）。
- 全ページ `<helmet>` で以下2つを読み込む（相対パスはプロジェクトルート基準）:
  ```html
  <link rel="stylesheet" href="_ds/modernist-8d6f34c3-0c5a-4626-9836-357fb72aa821/styles.css">
  <script src="_ds/modernist-8d6f34c3-0c5a-4626-9836-357fb72aa821/_ds_bundle.js"></script>
  ```
- 色・フォント・余白は全て `var(--color-*)` `var(--font-*)` `var(--space-*)` トークンを使う。ハードコードした hex や px は使わない。
- スタイルはインライン `style="…"` のみ。`<style>` ブロックは `body{margin:0}` 等のリセットのみ許可。

## 1. デザインシステム（Modernist）の使い方

- ベースはフラットで直線的（`--radius-md: 0`、赤アクセント `--color-accent #ec3013`、Archivo フォント、2px の `.hr` 罫線）。
- **例外**: 右下の「リモコン」ナビだけは意図的に丸め・アウトライン付きの「かわいい」見た目にしている（ユーザー承認済みの例外）。ページ本体（カード、テーブル、ボタン等）は Modernist の角丸なし・フラットなルールを守ること。
- `.card` `.btn` `.tag` `.table` などは `_ds_bundle.js` / `styles.css` のクラスをそのまま使う。独自に模倣した見た目を作らない。

## 2. 情報設計の原則（認知負荷を下げる３つの武器）

1. **優先順位を可視化する**: 「なぜやりたかったか（Why）」を常に目立たせ、「具体的にどう対処したか（How / 数値）」は折りたたみ（後述の disclosure パターン）に格納する。ページを開いて最初のスクロールで趣旨が伝わることを最優先にする。
2. **視覚的な区切りを使う**: セクション見出しの前に `10px` の赤い四角マーカー（`<i style="width:10px;height:10px;background:var(--color-accent);display:inline-block">`）を置き、スキャンしやすくする。セクション間は `.hr`（2px罫線）で区切る。
3. **一箇所だけ強い赤面を使う**: ページ中に１箇所だけ、コンセプトの核となる一文を `background:var(--color-accent);color:var(--color-bg)` の全幅バナーで見せる（ポスター的な強調）。多用しない。

## 3. ページ構成パターン（Planning.dc.html を参照実装とする）

上から順に:
1. `<nav class="nav">` — ロゴ＋サイト名のみ。ページ間リンクやCTAはここに置かない（リモコンの役目）。
2. Hero — kicker（12px, uppercase, `--color-accent-700`）→ h1 → 1〜2文の要約 → 関連リンク（`.tag.tag-outline`）。
3. （任意）赤い一文バナー — そのページの核心的な「なぜ」を1文で。
4. コアとなる情報を視覚的に（テーブルや文章の羅列ではなく、アイコン付きのステップ／カードで）見せる。
5. 「頑張ったポイント（Why）」を `.card` のグリッドで3〜4枚。具体的な数字は書かない。
6. 詳細セクション（下記4章）。
7. `<dc-import name="RemoteNav" current="<ページID>" hint-size="220px,400px"></dc-import>` を `</div>` の直前に設置。
8. 必要なら `<footer>` に外部リポジトリ等のリンク。

## 4. 折りたたみ（disclosure）パターン

具体的な数値・テーブル・却下ログなど「読みたい人だけが読む」情報はクリックで開閉するセクションに入れる。実装は `<details>` ではなく、状態を持つ独自トグル（クリックイベント＋開閉アイコン回転）:

```html
<div onClick="{{ toggleX }}" style="display:flex;align-items:center;justify-content:space-between;cursor:pointer;padding:16px 0">
  <div>
    <p style="margin:0;font-family:var(--font-heading);font-weight:800;font-size:20px">見出し</p>
    <p style="margin:4px 0 0;font-size:13px;color:color-mix(in srgb, var(--color-text) 55%, transparent)">中身の要約</p>
  </div>
  <svg ... style="transform:{{ chevX }};transition:transform .15s"><path d="m9 18 6-6-6-6"/></svg>
</div>
<sc-if value="{{ openX }}" hint-placeholder-val="{{ false }}">
  ... 詳細（テーブル・リストなど） ...
</sc-if>
```
ロジック側で `state.openX`、`chevX`（`rotate(90deg)`/`rotate(0deg)`）、`toggleX` を用意する。**1ページにつき折りたたみは2〜3個まで**（多すぎるとまた選択疲れになる）。

## 5. RemoteNav（全ページ共通の右下リモコン）

`RemoteNav.dc.html` は独立した子DC。全ページで同じものを import する:
```html
<dc-import name="RemoteNav" current="planning" hint-size="220px,400px"></dc-import>
```
- `current` prop はそのページのID: `"top" | "planning" | "frontend" | "backend"`。**新しいページを追加したら、この prop の値を増やし、RemoteNav.dc.html 内の該当リンクを有効化する**（現在 frontend/backend は `disabled` 扱いで opacity .35 + クリック不可）。
- 見た目: 白背景・角丸22px・赤い2px枠線・影（Modernist本来のフラット角ゼロの例外）。デフォルトは折りたたみ状態（56px の丸いアイコンボタンのみ表示）。クリックで展開し、各ページへのアイコン＋ラベル＋一言説明、最後に一番大きい「遊んでみる」ボタン（プレイ導線を兼ねる最重要ボタン）。
- ページ側の実装を変える必要は無い。フロント/バックエンドページを追加する際は、そのページの `<nav>` にはページ間リンクを置かず、必ずこの RemoteNav を設置するだけでよい。

## 6. コピーのトーン

- 「何をしたか」より「なぜそうしたか / 何を防ぎたかったか」を主語にする。例: 「破綻を1つの決定で解消」→「1発即KOを二度と起こしたくなかった」。
- 一文は短く。値や仕組みの詳細は本文ではなく折りたたみ内のテーブルに逃がす。
- チーム紹介やゲーム紹介と同じ熱量で扱うセクション（例: 開発チーム）は、カードを大きく・アイコンボタンで導線を明確にする（テキストリンクだけで済まさない）。

## 7. 新規ページ追加チェックリスト（フロント / バックエンド用）

- [ ] `<helmet>` に Modernist の stylesheet + bundle を読み込んだか
- [ ] CDATAラッパーを使っていないか（テンプレート・ロジック両方）
- [ ] `<nav>` はロゴのみか（ページ内リンクを置いていないか）
- [ ] Hero → (赤バナー) → Why中心のハイライトカード → 折りたたみ詳細、の順になっているか
- [ ] 折りたたみは2〜3個までか
- [ ] `<dc-import name="RemoteNav" current="frontend|backend" ...>` を設置したか
- [ ] `RemoteNav.dc.html` 側でそのページの項目を disabled から有効に変更したか
- [ ] 色・フォント・余白はすべて Modernist のトークン経由か
