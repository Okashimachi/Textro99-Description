# AGENTS.md — textro99-description

このファイルは、AIコーディングエージェント（Claude Code / Codex / Cursor 等）が **textro99-description**（イベント来場者向け説明サイト）で作業する際に読む索引。ツールに依存しない共通の入口としてここに一本化する。

> Claude Code は `CLAUDE.md` からこのファイルを参照している。どのAIツールを使っても、実体はこの `AGENTS.md` を読むこと。

---

## 0. このリポジトリは何か

「テキストロ99」（99人バトルロイヤル型タイピングゲーム、開発チーム「おかしまち」制作）を、**イベント出展会場でエンジニアの参加者向けに紹介する説明サイト**。

- ゲーム本体（Textro99-WebFront）とは別の**独立したリポジトリ**。ゲーム本体のコードは import しない（別ビルド・別デプロイ）。見た目のトンマナだけを参考にして作り直す。
- 掲載する内容は「企画・仕様」「フロント」「バックエンド」それぞれで**何を頑張ったか・何を意識したか**の紹介。対象読者はエンジニアなので、技術的な設計判断を面白がってもらえる書き方を意識する。
- **簡単な静的ページの寄せ集め**なので、他のテキストロ系リポジトリのような厳密な Git 運用・レビュー体制・禁止コマンド一覧などは持たせない。このファイルは「このセッションで決まった設計」を記録することが主目的。

---

## 1. 関連リポジトリ（参考・依存しない）

| リポジトリ | 関係 |
|---|---|
| [Textro99-Docs](https://github.com/Okashimachi/Textro99-Docs) | 企画・仕様の正典。「企画/仕様」ページの内容ソース |
| [Textro99-Client-Docs](https://github.com/Okashimachi/Textro99-Client-Docs) | Web/Unity共通クライアント設計。「フロント」ページの内容ソース |
| [Textro99-Server](https://github.com/Okashimachi/Textro99-Server) | ゲームサーバー(Go)。「バックエンド」ページの内容ソース |
| [Textro99-WebFront](https://github.com/Okashimachi/Textro99-WebFront) | ゲーム本体（テストフロント）。デザインの参照元（試合画面のトンマナ）。トップページから「遊んでみる」導線でここへ飛ばす |

いずれも**内容を参照するだけ**で、コード上の依存（import・パッケージ参照）は持たない。

---

## 2. 担当分担

- **企画・仕様ページ／フロントページ**：プランナー（本人）が作成
- **バックエンドページ**：サーバーマネージャーに委譲。**依存を切ってあるので `src/backend/` の中だけ見れば書ける**（3章）

---

## 3. 画面遷移

```
トップ
 ├─ 企画/仕様ページ
 ├─ フロントページ
 └─ バックエンドページ
```

- トップは3枚のカードで3ページに分岐する（「戦況コンソール」ではなく、テキストロ本体の `ModeSelectScreen` と同じ「カード選択」UIパターンを踏襲）。この3カードは `.card-link`（5.1節）でホバー時に枠線・影・背景色が変わり、押せることを示す。
- 全4画面に共通の「リモコン」（`layout/RemoteNav.tsx`、Modernist版）を**右下に固定表示**する。既定は折りたたみ（56pxの丸ボタン）で、クリックで展開する。展開時の中身は以下：
  - 4画面の相互ナビ（トップ／企画|仕様／フロント／バックエンド）。バックエンドは Modernist 未移行の間 `disabled`（5.3節）
  - 「遊んでみる」CTA（テキストロ本体のプレイ画面へのリンク、再生アイコン）
- **加えて、ヘッダー右上にも常設の「遊んでみる」ボタンを置く**（`layout/Nav.tsx`、Modernist版のトップ／企画仕様ページで使用）。DESIGN_SPEC.md の原則は「ヘッダーはロゴのみ、CTAはリモコンに集約」だったが、リモコンを開かないとプレイ導線に気づきにくいという指摘を受けて追加した（リモコン側のCTAは残したまま、両方に置く）。frontend/backend（旧デザイン、`layout/Layout.tsx` のヘッダー）にも同じボタンを追加済み。
- 各詳細ページの末尾に、内容に対応するリポジトリへのリンクを置く（1章の表）。
- トップページの**先頭**（3カードより上）に開発チーム紹介を置く。チーム名・チームアイコン・各メンバーのアイコン／担当／X／GitHub を載せる。
  - チーム おかしまち — https://github.com/Okashimachi
  - カシュー（リーダー、企画・仕様・フロントエンド） — https://x.com/game_game_nuts / https://github.com/kdix-23-240
  - りーせ（バックエンド） — https://x.com/ri_se_yu / https://github.com/ru-se
  - たまちゃ（トップシークレット） — https://x.com/tamtya_joho / https://github.com/tamtya
  - アイコン画像は `public/team/` に置く（`Okashimachi-Icon.png` / `Cashew-Icon.jpg` / `ri-se-Icon.jpg` / `tamatya-Icon.jpg`）。未配置でも壊れた画像が出ないよう、`TopPage.tsx` の `TeamImage` が読み込み失敗時に無地プレースホルダへ落とす。

最終的な公開URLパス（テキストロ本体のドメインのどのパス配下に置くか）はインフラ側の決定待ち。このリポジトリ内では `/`＝トップ、`/planning` `/frontend` `/backend` の4画面という素朴な構成で進める。

**「遊んでみる」CTA の遷移先**：`https://textro99-web-front.vercel.app/`（Textro99-WebFront の Vercel デプロイ）で確定。`layout/Nav.tsx` `layout/RemoteNav.tsx` `layout/Layout.tsx` の3箇所にある `PLAY_URL`（またはハードコード箇所）はこの値で統一し、別オリジンなので `target="_blank" rel="noreferrer"` を付けている。

---

## 4. ディレクトリ構造・依存ルール

```
src/
  layout/
    Nav.tsx            … トップ／企画仕様／フロントページ共通のヘッダー（ロゴ＋常設「遊んでみる」CTA）。Modernist版（3章）
    RemoteNav.tsx      … 全4画面共通の右下フローティングリモコン（相互ナビ＋プレイCTA）。Modernist版（5.3節）
    Disclosure.tsx     … 折りたたみ（Modernist版）。開閉トグル＋シェブロン回転。1ページ2〜3個まで
    prose.ts           … Disclosure内の見出し・本文・表ラッパーの共通インラインスタイル（Modernist版）
    Layout.tsx         … 【旧デザイン・backendのみ使用】3詳細ページ共通テンプレート
    Panel.tsx          … 【旧デザイン・backendのみ使用】白カード＋色チップ＋見出しの汎用パーツ
    accentTheme.ts     … ページ別アクセントカラーの対応表 兼 RemoteNav の `current` prop 型（`AccentId`）
  top/
    TopPage.tsx        … トップ（Modernist版）
  planning/
    PlanningPage.tsx   … 企画/仕様（Modernist版。DESIGN_SPEC.md + Planning.dc.html の再現）
  frontend/
    FrontendPage.tsx   … フロント（Modernist版。Textro99-Client-Docs / Textro99-WebFront が出典）
  backend/             … サーバーマネージャー担当領域【旧デザインのまま・未着手】
    BackendPage.tsx
  Router.tsx / App.tsx … 4画面の配線層（唯一の合成点）
```

**旧デザインの図表コンポーネント（`Figure.tsx` `Table.tsx` `Flow.tsx` `Sequence.tsx` `Callout.tsx`）は frontend の Modernist 移行に伴い削除済み。** `Layout.tsx` / `Panel.tsx` は backend がまだ Modernist へ移行していないため残す。backend を Modernist 化したらこの2つも用済みになり削除してよい（5章）。`accentTheme.ts` は `RemoteNav.tsx` の型（`AccentId`）としても使うため、backend 移行後も残る。

**依存ルール（意図的にテキストロ本体サーバーの層アーキ思想を踏襲）**
- `top/` `planning/` `frontend/` `backend/` の4画面ディレクトリは**互いに一切importしない**（横依存禁止）
- 4画面が依存してよいのは `layout/` の共通テンプレートのみ。依存は常に「画面 → layout」の一方向
- `Router.tsx`（or `App.tsx`）が4画面を束ねる唯一の合成点

この形にしておくことで、`backend/BackendPage.tsx` は `planning/` `frontend/` を一切知らずに独立して書き換えられる。サーバーマネージャーには「`src/backend/` の中だけ見ればいい」と渡せる。

---

## 5. デザイン方針【2026-08-01 に方針転換】

**デザインは ClaudeDesign（DC）で作った「Modernist」システムに一本化した。正典は [`DESIGN_SPEC.md`](./DESIGN_SPEC.md)（リポジトリ直下）。**
旧方針（Tailwind標準パレットのzinc/red/amber/emerald/skyのみ・ページごとにアクセントカラーを変える「戦況コンソール」風）は**トップ／企画仕様／フロントページでは廃止済み**。バックエンドページはまだ移行できていないため、旧方針のまま残っている（4章を参照）。**バックエンドを書く時は、この5章と `DESIGN_SPEC.md` の方に合わせること（旧Panelパターンを新規に増やさない）。**

### 5.1 トークンと基本パーツ
- DC 本来は `_ds/modernist-.../styles.css` + `_ds_bundle.js` を読み込む前提だが、このリポジトリは DC ランタイムを持たない素の Vite+React なので、そこで使われる `var(--color-*)` / `var(--font-*)` トークンと最小限のクラス（`.card` `.tag` `.tag-outline` `.tag-neutral` `.table` `.hr` `.nav` `.nav-brand`）を `src/index.css` に自前定義して再現している。
- 色の正確な値は元の `styles.css` が手元に無いため近似（確定値はアクセント `#ec3013` のみ）。トークンを変えたくなったら `:root` 側の値だけ触ればよい。
- フォントは Archivo（`index.html` で Google Fonts から読み込み）。見出し・本文とも Archivo。
- 独自カラートークンを増やさない・ハードコードした hex を書かない・インライン `style` で色/フォント/余白を指定する時は必ず `var(--color-*)` 等のトークン経由にする、という DC 側のルールをそのまま踏襲する。

### 5.2 ページ構成パターン（DESIGN_SPEC.md 3章、`PlanningPage.tsx` が参照実装）
1. `<nav>` はロゴ＋サイト名のみ。ページ間リンクやCTAはここに置かない
2. Hero — kicker → h1 → 要約1〜2文 → 関連リンク（`.tag.tag-outline`）
3. （任意）赤い一文バナー — そのページの核心的な「なぜ」を1文で、全幅の `background:var(--color-accent)`
4. コアとなる情報をアイコン付きステップ／カードで見せる（テーブルの羅列にしない）
5. 「頑張ったポイント（Why）」を `.card` グリッドで3〜4枚。具体的な数字は書かない
6. 詳細セクション（`layout/Disclosure.tsx` で2〜3個まで。数値・テーブル・却下ログはここに逃がす）
7. `<RemoteNav current="...">` を設置（全ページ共通、右下固定）
8. 必要なら `<footer>` に外部リポジトリ等のリンク

### 5.3 RemoteNav（`layout/RemoteNav.tsx`）
- 全ページ共通の右下フローティングナビ。ヘッダーにはページ間リンクを置かず、画面遷移と「遊んでみる」導線はすべてここに集約する
- 見た目だけ Modernist のフラット原則から意図的に外れた例外（角丸22px・赤い2px枠線・影）
- `current` prop の型は既存の `AccentId`（`"brand"|"planning"|"frontend"|"backend"`）をそのまま使う。DC側の `"top"` ではなくこちらの語彙に合わせてある
- **backend は Modernist へ未移行の間、`enabled: false` のまま**（`ITEMS` 配列で管理）。移行が終わったら該当項目を `enabled: true` に変える（トップ／企画仕様／フロントは移行済みで既に `enabled: true`）

### 5.4 図
- Modernist版では専用の図コンポーネントを持たない。単位変換フロー・レイヤー依存の向き等の「一本道の図」は、`PlanningPage.tsx` / `FrontendPage.tsx` の Disclosure 内で使っている
  `border:1px solid var(--color-divider); background:var(--color-surface)` の等幅フォント箱（矢印は `→` / 改行の地の文）で足りている。シーケンス図・凝った図が必要になったら、そのときに Modernist トークン準拠の新規コンポーネントを検討する（**mermaid はランタイムに載せない**方針は維持）。

---

## 6. 技術スタックの目安（厳密な縛りではない）

このリポジトリは「簡単なページ作成」なので、技術選定に厳密なルールは設けない。目安として、テキストロ本体（Textro99-WebFront）と同じ **React + TypeScript + Vite + Tailwind CSS** に揃えておくと、デザインパターンの流用・比較がしやすい。ルーティングは4画面程度の単純な構成なのでライブラリを新規導入せず、`window.location.pathname` を素朴に見て出し分ければ十分（本体側もこの方針）。

---

## 7. Git運用・コーディングルールについて

このリポジトリでは、他のテキストロ系リポジトリのような厳密なGit運用ルール・禁止コマンド一覧・レビュー体制は定めない。簡単な説明ページの寄せ集めであり、複雑な設計判断や事故のリスクが小さいため。
