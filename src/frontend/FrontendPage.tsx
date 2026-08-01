// フロントページ（Modernist版）。DESIGN_SPEC.md と PlanningPage.tsx を型として、
// 旧デザイン版フロントページ（Textro99-Client-Docs / Textro99-WebFront を出典とする内容）を
// そのまま移植したもの。文言・データは変えていない。
import { Nav } from "../layout/Nav";
import { RemoteNav } from "../layout/RemoteNav";
import { Disclosure } from "../layout/Disclosure";
import { sectionBody, sectionSubheading, tableScroll } from "../layout/prose";

const F = "frontend" as const;

const coreLoop = [
  { num: "1", title: "MatchStart受信", note: "初期ダケン・パラメータ公開サブセット" },
  { num: "2", title: "打鍵判定（ローカル）", note: "表示用。勝敗の値はここで確定しない" },
  { num: "3", title: "DakenClearReport送信", note: "ダケン単位。1文字ごとに往復しない" },
  { num: "4", title: "サーバーが確定", note: "コンボ・実効難易度を計算" },
  { num: "5", title: "受信stateを描画", note: "ComboUpdated / DakenIssued を写すだけ" },
];

const highlights = [
  {
    tag: "なぜ／責務境界",
    title: "AIが気を利かせて事故るのを防ぎたかった",
    body: "打鍵判定以外は全部サーバーへの送受信に還元する、をレビュー観点にまで落とし込んだ。",
  },
  {
    tag: "なぜ／アーキ",
    title: "フルDDDで説明コストを増やしたくなかった",
    body: "ドメインロジックが打鍵判定しかないので、単方向データフロー（MVU）だけで足りると判断した。",
  },
  {
    tag: "なぜ／打鍵判定",
    title: "WebとUnityで判定がズレる事故を避けたかった",
    body: "既製ライブラリに頼らず、共有テーブル＋薄い変換オートマトンを自作した。",
  },
  {
    tag: "なぜ／Unity移行",
    title: "Unity側の作業を「見た目づくり」だけに減らしたかった",
    body: "接続・送受信・ディスパッチ層をWebで参照実装として確立し、そのままミラーできる契約にした。",
  },
];

const ddElements = [
  ["エンティティ / 集約", "❌ 戦闘ドメインはサーバーにある。クライアントは ViewModel のみ"],
  ["ドメインサービス", "❌ クライアントに戦闘計算がない"],
  ["リポジトリ", "❌ 永続化・DB取得をクライアントは持たない"],
  ["ユビキタス言語", "✅ 採用。用語集に従い変数名まで一貫させる"],
  ["値オブジェクト的な型の厳密さ", "✅ 部分採用。識別子を素の string で混同しない"],
];

const responsibilityRows = [
  ["WebSocket 接続・送受信・ディスパッチ層", "コンボ / 威力 / 相殺 / スタック / KO / ターゲティング / 難易度の計算"],
  ["受信 state を写す表示コンポーネント群", "ダケンの時間切れ判定・脱落判定"],
  ["打鍵判定（TypingJudge）", "ゲームパラメータの外部DB取得"],
  ["入力処理（文字キー / 0〜9）", "プロトコル契約そのものの決定・変更"],
];

const romajiReasons = [
  ["用途が違う", "既製品は「文章の一括変換」用。1キーごとの逐次判定・途中入力の前方一致を想定していない"],
  ["複数正解を扱えない", "し＝si/shi、じゃ＝zya/ja/jya のような表記ゆれを受理集合として持てない"],
  ["Web/Unity で判定がズレる", "C# に同等品が無い。両クライアントで判定差異が出るのは二重管理禁止・ミラー原則に反する"],
];

const romajiCases = [
  ["促音「っ」", "がっこう → gakkou / galtukou / gaxtukou", "次の打鍵単位の候補に子音重ねと ltu/xtu/ltsu を合成して吸収する"],
  ["撥音「ん」", "nn / n / xn", "前方一致フォールバック（bufferが候補に完全一致していれば単位を確定して次へ送る）で解消"],
  ["拗音「きゃ」", "kya / ki + lya", "拗音は2かなで1打鍵単位。分割入力も候補として持つ"],
];

const optimisticRows = [
  ["タイプした文字が消えていく表示", "✅", "—"],
  ["ミスの打鍵フィードバック（赤表示・打鍵音）", "✅", "—"],
  ["コンボ値", "❌", "✅ ComboUpdated"],
  ["ダケンスタック増減", "❌", "✅ DakenStackUpdated"],
  ["攻撃の威力・相殺結果", "❌", "✅ AttackIncoming / OffsetResolved"],
  ["KO・脱落・順位", "❌", "✅ KoNotified / GameOver"],
];

const dispatchRows = [
  ["接続確立 / 切断 / 指数バックオフの自動再接続", "state の畳み込み（Reducer の仕事）"],
  ["C2S を Envelope { type, payload } で送信", "UI・描画（View の仕事）"],
  ["受信 Envelope を type ごとにハンドラへ振り分け", "打鍵判定（TypingJudge の仕事）"],
  ["未知の type は無視してログ（前方互換）", "契約の解釈変更（Proto が正典）"],
];

const bugRows = [
  [
    "リザルトを眺めて放置していると、勝手に次の試合へ入ってしまう",
    "サーバーは「WebSocket 接続時にのみマッチング登録」する契約（1接続＝1試合）。自動再接続がそのまま次の試合への参加になっていた",
    "自分の GameOver を受け取った時点で参加意思を降ろし、自動再接続も止める。次の試合へ行くのはユーザーの明示操作だけにした",
  ],
  [
    "サーバーが次の試合を始めると、リザルト画面が勝手に消える",
    "次の MatchStart で reducer が gameOver を null に戻すため",
    "GameOver をローカルへ焼き付け、明示操作（再戦／タイトルへ）でしか解除しないようにした",
  ],
  [
    "タブを閉じても待機列に自分が残る",
    "サーバーが close を検知するまでのラグ",
    "pagehide で MatchmakingLeave を送る（bfcache 退避もあるので、接続が開いている時だけ送る）",
  ],
  [
    "数字を含むお題が打てない",
    "0〜9 は作戦選択（StrategySelect）専用のキーだったため",
    "お題に半角数字が含まれる間だけ 0〜9 を打鍵へ回す。判定はお題を知っている側が行い、入力層は渡されたとおりに振り分けるだけにした",
  ],
  [
    "離脱して入り直すと、前のセッションの待機者一覧や盤面が残る",
    "受信 state を持ち越していた",
    "S2C とは別のリセット action を用意し、セッションを張り直すときは受信 state を全部捨てる",
  ],
];

const bandwidthRows = [
  ["差分送信", "変化したプレイヤーだけを送る PlayerListDelta。全件スナップは低頻度のみ"],
  ["ペイロード削減", "ミニ盤面に要る最小フィールドだけ（スタック比・生存・バッジ数）。表示名は初回のみ"],
  ["量子化", "スタック量を生値でなく段階で送る。表示は段階で十分"],
  ["送信頻度の間引き", "KO等の重要イベントは即時、細かな更新は間引く"],
];

const devExperience = [
  "RawStateDebugPaneを最初に作った：受信JSONをそのまま整形表示するペイン。UIはAI生成なのでバグり得るが、正データを常にここで確認できるので「サーバー（ロジック）のバグか、表示のバグか」を即座に切り分けられる",
  "フロント完結のモックサーバー：サーバー未接続でも「出題→表示→タイピング→判定」のループを試せるローカル模擬サーバーをdev用に持つ。実通信と同じディスパッチ経路を通すので配線の検証としても機能する。ロジックの正典ではないと明記し、実挙動は必ず実サーバーで確認する運用にしている",
  "本番導線と開発導線を分けた：来場者が触る「プレイする」導線には開発ツールを一切出さず、?test=1 を付けたときだけテスト用入口（モード選択・練習モード・送信ログ・生state表示）が現れる",
  "試合開始のタイミングはフロントで持たない：カウントダウンもサーバー配信の残り時間を表示するだけで、ローカルで秒を数えて開始しない",
];

const crossLangRows = [
  ["型・メッセージ名", "DakenClearReport", "DakenClearReport", "Proto の名称をそのまま使い、言語ごとに言い換えない"],
  ["メソッド", "send", "Send", "大文字小文字の慣習差のみ許容。語幹は同一"],
  ["インターフェース", "Renderer", "IRenderer", "接頭辞は各言語の慣習でよいが語幹を一致させる"],
  ["on-wire JSON", "camelCase", "camelCaseへマッピング", "Proto の JSON タグが正典。C# は属性で合わせる"],
];

const techStackRows = [
  ["フレームワーク", "React 18 + TypeScript", "AI生成の精度・修正耐性が高い。ファイル分割＋型がそのままAIへのガードレールになる"],
  ["ビルド", "Vite", "セットアップ最小・起動高速"],
  ["状態管理", "なし（useState / useReducer）", "状態の実体はサーバー側。受信stateを写すだけなのでRedux等は不要"],
  ["スタイル", "Tailwind CSS", "クラス指定だけで見た目の指示が通り、AIと相性が良い"],
  ["通信", "WebSocket / JSON", "Proto の DTO と同一。Unity も同じエンドポイントに接続する"],
  ["契約", "Proto パッケージ（版固定）", "送受信する型と共有ローマ字データの正典。更新は人間が責任を持って版を上げる"],
  ["デプロイ", "静的ホスティング", "pushごとに自動デプロイ。PRプレビューURLが自動発行されるので複数人テストが楽"],
];

const remainingItems = [
  "ローマ字テーブルはWebローカル実装のまま。Protoの共有データへ移す作業は未着手（差し替えても判定エンジンは触らずに済む形にはしてある）",
  "Unity（C#）側のミラー実装はこれから。Webは「Unityへ移行するまでの検証ハーネス」という位置づけ",
  "PlayerListDelta等の帯域対策は契約済みだが、実測でのチューニングはこれから",
  "サーバーのテスト環境をWebからUnityへ切り替えるタイミングは、unityroomへのデプロイ後",
];

export function FrontendPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", color: "var(--color-text)" }}>
      <Nav />

      {/* ── HERO ── */}
      <header style={{ maxWidth: 800, margin: "0 auto", padding: "56px 24px 32px" }}>
        <span
          style={{
            display: "block",
            fontSize: 12,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: "var(--color-accent-700)",
            fontWeight: 800,
            marginBottom: 14,
          }}
        >
          フロント
        </span>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            fontSize: "clamp(28px,4.6vw,44px)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            margin: "0 0 16px",
          }}
        >
          サーバー権威 × 薄いクライアント
        </h1>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.7,
            maxWidth: "60ch",
            color: "color-mix(in srgb, var(--color-text) 78%, transparent)",
            margin: "0 0 20px",
          }}
        >
          サーバー権威を前提に、クライアントの責務を「打鍵判定」と「送受信」だけに絞る。Unity がそのままミラーできる薄さを保つための設計。
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a href="https://github.com/Okashimachi/Textro99-WebFront" target="_blank" rel="noreferrer" className="tag tag-outline">
            Textro99-WebFront（実装）
          </a>
          <a href="https://github.com/Okashimachi/Textro99-Client-Docs" target="_blank" rel="noreferrer" className="tag tag-outline">
            Textro99-Client-Docs（共通設計の正典）
          </a>
          <a href="https://github.com/Okashimachi/Textro99-Proto" target="_blank" rel="noreferrer" className="tag tag-outline">
            Textro99-Proto（共有契約）
          </a>
        </div>
      </header>

      <section style={{ background: "var(--color-accent)", color: "var(--color-bg)", padding: "40px 24px" }}>
        <p
          style={{
            maxWidth: 800,
            margin: "0 auto",
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            fontSize: "clamp(22px,3.2vw,34px)",
            lineHeight: 1.4,
          }}
        >
          クライアントが自前で行うのは打鍵判定だけ——
          <br />
          それ以外は全部、サーバーへの送受信に還元する。
        </p>
      </section>

      <hr className="hr" style={{ maxWidth: 960, margin: "0 auto" }} />

      {/* ── 通信ループ ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: "color-mix(in srgb, var(--color-text) 55%, transparent)",
            fontWeight: 800,
            marginBottom: 24,
          }}
        >
          <i style={{ width: 10, height: 10, background: "var(--color-accent)", display: "inline-block", flexShrink: 0 }} />
          通信ループ（ダケン単位で報告する）
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", rowGap: 16 }}>
          {coreLoop.map((step, i) => (
            <div key={step.num} style={{ display: "flex", alignItems: "flex-start", gap: 4 }}>
              <div
                style={{
                  width: 168,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: "var(--color-surface)",
                    color: "var(--color-accent)",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 800,
                    fontSize: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {step.num}
                </span>
                <p style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 15 }}>
                  {step.title}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12.5,
                    lineHeight: 1.5,
                    color: "color-mix(in srgb, var(--color-text) 65%, transparent)",
                  }}
                >
                  {step.note}
                </p>
              </div>
              {i < coreLoop.length - 1 && (
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    flexShrink: 0,
                    color: "color-mix(in srgb, var(--color-text) 30%, transparent)",
                    marginTop: 16,
                  }}
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              )}
            </div>
          ))}
        </div>
        <p style={{ margin: "24px 0 0", fontSize: 13, color: "color-mix(in srgb, var(--color-text) 55%, transparent)" }}>
          1文字ごとにサーバーと往復するのはレイテンシ・負荷の両面で非現実的。打鍵はローカルで判定し、1ダケン打ち切った結果だけを送る。時間切れ・脱落の報告は存在しない（サーバーが自律確定する）。
        </p>
      </section>

      <hr className="hr" style={{ maxWidth: 960, margin: "0 auto" }} />

      {/* ── 頑張ったポイント ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: "color-mix(in srgb, var(--color-text) 55%, transparent)",
            fontWeight: 800,
            marginBottom: 6,
          }}
        >
          <i style={{ width: 10, height: 10, background: "var(--color-accent)", display: "inline-block", flexShrink: 0 }} />
          頑張ったポイント（何をしたかったか）
        </span>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: "color-mix(in srgb, var(--color-text) 55%, transparent)" }}>
          具体的な仕組み・対処は「設計の仕組みをもっと見る」にまとめてあります
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
          {highlights.map((h) => (
            <div
              key={h.title}
              className="card"
              style={{ boxShadow: "var(--shadow-sm)", border: "1px solid var(--color-divider)", padding: 20, gap: 10 }}
            >
              <span className="card-kicker" style={{ fontSize: 11 }}>
                {h.tag}
              </span>
              <span className="card-title" style={{ fontSize: 19 }}>
                {h.title}
              </span>
              <p className="card-body" style={{ fontSize: 13.5 }}>
                {h.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <hr className="hr" style={{ maxWidth: 960, margin: "0 auto" }} />

      {/* ── 詳細1：設計の仕組み ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "24px 24px" }}>
        <Disclosure
          title="設計の仕組みをもっと見る"
          summary="責務境界／MVUアーキテクチャ／モジュール分割／打鍵判定の詳細／状態管理／ディスパッチ層"
        >
          <div>
            <p style={sectionSubheading}>絶対原則：クライアントはタイピング以外の処理を持たない</p>
            <p style={sectionBody}>
              クライアントが自前で行う処理は<strong>打鍵判定（ローカル）だけ</strong>。それ以外はすべて
              <strong>サーバーへの送受信</strong>に還元する。例外を作らない。フロントのコードはAIに書かせる前提のため、レビューは「打鍵判定以外のロジックが混入していないか」の一点に絞っている。AIは放っておくと気を利かせてコンボ加算をローカルで実装してしまうので、規約コメントと禁止事項チェックリストをリポジトリに常設して事故を防いでいる。
            </p>
            <div style={tableScroll}>
              <table className="table">
                <thead>
                  <tr>
                    <th>クライアントが持つもの</th>
                    <th>クライアントが持たないもの</th>
                  </tr>
                </thead>
                <tbody>
                  {responsibilityRows.map((r) => (
                    <tr key={r[0]}>
                      <td>{r[0]}</td>
                      <td>{r[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <p style={sectionSubheading}>アーキテクチャ：MVU（単方向データフロー）</p>
            <p style={sectionBody}>
              クライアントが薄いという非対称性が、そのままアーキ選定を決めた。ドメインロジックが打鍵判定しかない以上、フルDDDの戦術パターン（集約・リポジトリ・ドメインサービス）は過剰。「イベント受信→state更新→再描画」という性質に最も素直に一致するMVU（Model-View-Update）を採った。
            </p>
            <div
              style={{
                border: "1px solid var(--color-divider)",
                background: "var(--color-surface)",
                padding: "10px 12px",
                fontFamily: "ui-monospace,monospace",
                fontSize: 12.5,
                marginBottom: 12,
              }}
            >
              S2Cメッセージ → Dispatcher（振り分けるだけ） → Reducer（純関数で畳み込む） → ViewModel（single source of truth） → View（読むだけ）
            </div>
            <div style={tableScroll}>
              <table className="table">
                <thead>
                  <tr>
                    <th>DDDの要素</th>
                    <th>本作での判断</th>
                  </tr>
                </thead>
                <tbody>
                  {ddElements.map((r) => (
                    <tr key={r[0]}>
                      <td>{r[0]}</td>
                      <td>{r[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <p style={sectionSubheading}>モジュール分割と依存の向き</p>
            <p style={sectionBody}>
              依存は常に「プラットフォーム固有→共通コア→契約」の一方向。共通コアがReact/Unityを知らないので、ViewとInputだけ差し替えればUnity版になる。共通コアのモジュール同士も<strong>インターフェース越しにしか参照しない</strong>。モジュールが2つ以上の関心を持ち始めたら分割する（例：Dispatcherが描画最適化を始めたらRenderer側へ寄せる）という、分割のトリガーまで規約に書いてある。
            </p>
            <div
              style={{
                border: "1px solid var(--color-divider)",
                background: "var(--color-surface)",
                padding: "10px 12px",
                fontFamily: "ui-monospace,monospace",
                fontSize: 12.5,
              }}
            >
              View / InputSource（固有：Reactコンポーネント・keydown。Unityでは Prefab / Input System）
              <br />
              ↓ 依存
              <br />
              共通コア：Store / Dispatcher / TypingJudge / NetworkClient(抽象)（言語非依存インターフェースでTS/C#が1:1ミラー）
              <br />
              ↓ 依存
              <br />
              Proto（型・契約：全リポジトリ唯一の結合点。DTO・メッセージ・ローマ字テーブル）
            </div>
          </div>

          <div>
            <p style={sectionSubheading}>打鍵判定：ローマ字オートマトンを自作した</p>
            <p style={sectionBody}>
              クライアント唯一のローカルドメイン。ここは既製ライブラリ（wanakana等）を<strong>意図的に使わず</strong>、共有テーブル＋薄い変換オートマトンを自作している。
            </p>
            <div style={tableScroll}>
              <table className="table">
                <thead>
                  <tr>
                    <th>ライブラリを使わなかった理由</th>
                    <th>内容</th>
                  </tr>
                </thead>
                <tbody>
                  {romajiReasons.map((r) => (
                    <tr key={r[0]}>
                      <td>{r[0]}</td>
                      <td>{r[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ ...sectionBody, marginTop: 12 }}>
              実装は「お題（かな）を打鍵単位に分割し、各単位に受理ローマ字の候補列を持たせる」形。キー入力は候補への<strong>前方一致</strong>で進み、どの枝にも合わなければミス、終端に達したら確定。特に詰まりやすい3ケースは、ロジックではなく<strong>テーブル側</strong>に吸収させている。
            </p>
            <div style={tableScroll}>
              <table className="table">
                <thead>
                  <tr>
                    <th>ケース</th>
                    <th>受理する綴り</th>
                    <th>扱い</th>
                  </tr>
                </thead>
                <tbody>
                  {romajiCases.map((r) => (
                    <tr key={r[0]}>
                      <td>{r[0]}</td>
                      <td>{r[1]}</td>
                      <td>{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.6, color: "color-mix(in srgb, var(--color-text) 55%, transparent)", margin: "12px 0 0" }}>
              ローマ字テーブルは最終的にProtoの共有データへ移す前提なので、<strong>変換テーブルのファイル1枚を差し替えれば判定エンジンは触らずに移行できる</strong>よう、戻り値の形（打鍵単位＋候補列）だけを契約として固定してある。カタカナのお題はひらがなへ正規化し、英数字は1文字＝1単位のリテラルとして同じ経路で処理する。
            </p>
          </div>

          <div>
            <p style={sectionSubheading}>状態管理：ライブラリを入れない</p>
            <p style={sectionBody}>
              状態の実体はサーバー側にあり、フロントは受信stateを写すだけ。だから状態管理ライブラリを入れず、<code>useState</code> / <code>useReducer</code> のみで組んでいる。reducerは「サーバーが言ったことを写す」だけの純関数で、派生計算をここに書かないことをコメントで明示している。そのうえで、<strong>楽観的更新の境界を表として厳密に定義</strong>した。「見た目の即応」だけローカル、「勝敗に関わる値」は必ずサーバー確定を待つ。
            </p>
            <div style={tableScroll}>
              <table className="table">
                <thead>
                  <tr>
                    <th>事象</th>
                    <th>ローカル即時反映</th>
                    <th>サーバー確定待ち</th>
                  </tr>
                </thead>
                <tbody>
                  {optimisticRows.map((r) => (
                    <tr key={r[0]}>
                      <td>{r[0]}</td>
                      <td>{r[1]}</td>
                      <td>{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.6, color: "color-mix(in srgb, var(--color-text) 55%, transparent)", margin: "12px 0 0" }}>
              試合中の順位表示も同じ考え方で、当初あったクライアント側の近似順位算出は廃止し、サーバー確定順位（<code>PlayerSummary.rank</code>）で並べ替えるだけにした。「クライアントが順位を推定する」と、サーバーの確定値とズレた瞬間に不信感が出る。
            </p>
          </div>

          <div>
            <p style={sectionSubheading}>ディスパッチ層：Unityがミラーする参照実装</p>
            <p style={sectionBody}>
              本番クライアントはUnityだが、実装・イテレーション・サーバー結合テストのコストが高い。そこでまずWebで<strong>「遊べて・複数人でテストできる状態」を最速で作る</strong>方針を取った。Webの接続・送受信・ディスパッチ層は、後からUnityがC#で同じ構造をミラーするための<strong>参照実装</strong>を兼ねる。だからこの層には独自解釈もゲームロジックも一切置かない。
            </p>
            <div style={tableScroll}>
              <table className="table">
                <thead>
                  <tr>
                    <th>この層がやること</th>
                    <th>この層がやらないこと</th>
                  </tr>
                </thead>
                <tbody>
                  {dispatchRows.map((r) => (
                    <tr key={r[0]}>
                      <td>{r[0]}</td>
                      <td>{r[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.6, color: "color-mix(in srgb, var(--color-text) 55%, transparent)", margin: "12px 0 0" }}>
              接続先URLは環境変数で切り替える（ローカル／デプロイ版／当日会場）。コードには直書きしない。Protoの型は<strong>バージョン固定で参照</strong>し、勝手に最新を追わない。
            </p>
          </div>
        </Disclosure>
      </section>

      <hr className="hr" style={{ maxWidth: 960, margin: "0 auto" }} />

      {/* ── 詳細2：実運用の罠 ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "24px 24px" }}>
        <Disclosure
          title="実運用でぶつかった罠を見る"
          summary="仕様どおりに書くだけでは出てこなかった問題／99人盤面の帯域対策／開発体験の工夫"
        >
          <div>
            <p style={sectionSubheading}>実際にぶつかった、契約と実装の噛み合わせ</p>
            <p style={sectionBody}>仕様どおりに書くだけでは出てこない、作って動かして初めて分かった問題と、その対処。</p>
            <div style={tableScroll}>
              <table className="table">
                <thead>
                  <tr>
                    <th>起きたこと</th>
                    <th>原因</th>
                    <th>対処</th>
                  </tr>
                </thead>
                <tbody>
                  {bugRows.map((r) => (
                    <tr key={r[0]}>
                      <td>{r[0]}</td>
                      <td>{r[1]}</td>
                      <td>{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <p style={sectionSubheading}>99人ぶんの盤面をどう受けて、どう描くか</p>
            <p style={sectionBody}>
              99人分のサマリを99人へ毎tick送ると、単純計算で毎回 O(99×99) ≒ 約1万件相当が飛ぶ。契約側で<strong>差分メッセージ</strong>を追加し、フロントは全件スナップショットと差分マージの<strong>両方に対応できるreducer</strong>にしてある。
            </p>
            <div style={tableScroll}>
              <table className="table">
                <thead>
                  <tr>
                    <th>対策</th>
                    <th>内容</th>
                  </tr>
                </thead>
                <tbody>
                  {bandwidthRows.map((r) => (
                    <tr key={r[0]}>
                      <td>{r[0]}</td>
                      <td>{r[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.6, color: "color-mix(in srgb, var(--color-text) 55%, transparent)", margin: "12px 0 0" }}>
              描画側は7×14の98マス（＝自分を除く相手の数）で固定し、サーバーから届いていない席は「欠席」として描く。少人数でも盤面の形が変わらないので、当日の人数に左右されず「99人と戦っている画」を保てる。
            </p>
          </div>

          <div>
            <p style={sectionSubheading}>開発体験：切り分けを最初に作る</p>
            <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              {devExperience.map((t) => (
                <li key={t.slice(0, 12)} style={{ fontSize: 14, lineHeight: 1.7, color: "color-mix(in srgb, var(--color-text) 78%, transparent)" }}>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Disclosure>
      </section>

      <hr className="hr" style={{ maxWidth: 960, margin: "0 auto" }} />

      {/* ── 詳細3：現在地 ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "24px 24px" }}>
        <Disclosure title="現在地・技術スタック" summary="Unityへ渡すための約束事／技術選定の理由／まだ終わっていないこと">
          <div>
            <p style={sectionSubheading}>Unityへ渡すための約束事</p>
            <p style={sectionBody}>
              Webは恒久的な本番ではなく<strong>「Unityへ移行するまでの検証ハーネス」</strong>。Unityがunityroomにデプロイできる状態になったら、サーバーの結合テスト相手もWebからUnityへ切り替える。その移行を「見た目を作るだけ」に近づけるため、クロス言語の規約を先に決めてある。
            </p>
            <div style={tableScroll}>
              <table className="table">
                <thead>
                  <tr>
                    <th>対象</th>
                    <th>TS</th>
                    <th>C#</th>
                    <th>規約</th>
                  </tr>
                </thead>
                <tbody>
                  {crossLangRows.map((r) => (
                    <tr key={r[0]}>
                      <td>{r[0]}</td>
                      <td>{r[1]}</td>
                      <td>{r[2]}</td>
                      <td>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.6, color: "color-mix(in srgb, var(--color-text) 55%, transparent)", margin: "12px 0 0" }}>
              片方の言語だけ名前を変えない。名前を変えるときは対応表と両言語を同時に更新する——という運用まで含めて規約にしている。
            </p>
          </div>

          <div>
            <p style={sectionSubheading}>技術スタックと、その選定理由</p>
            <div style={tableScroll}>
              <table className="table">
                <thead>
                  <tr>
                    <th>項目</th>
                    <th>選定</th>
                    <th>理由</th>
                  </tr>
                </thead>
                <tbody>
                  {techStackRows.map((r) => (
                    <tr key={r[0]}>
                      <td>{r[0]}</td>
                      <td>{r[1]}</td>
                      <td>{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <p style={{ ...sectionSubheading, marginBottom: 10 }}>まだ終わっていないこと</p>
            <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              {remainingItems.map((t) => (
                <li key={t.slice(0, 12)} style={{ fontSize: 14, lineHeight: 1.7, color: "color-mix(in srgb, var(--color-text) 78%, transparent)" }}>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Disclosure>
      </section>

      <footer
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "24px 24px 48px",
          borderTop: "2px solid var(--color-divider)",
          fontSize: 12,
          color: "color-mix(in srgb, var(--color-text) 55%, transparent)",
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <a href="https://github.com/Okashimachi/Textro99-WebFront" target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
          Textro99-WebFront
        </a>
        <a href="https://github.com/Okashimachi/Textro99-Client-Docs" target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
          Textro99-Client-Docs
        </a>
        <a href="https://github.com/Okashimachi/Textro99-Proto" target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
          Textro99-Proto
        </a>
      </footer>

      <RemoteNav current={F} />
    </div>
  );
}
