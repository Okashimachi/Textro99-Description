import { Nav } from "../layout/Nav";
import { RemoteNav } from "../layout/RemoteNav";
import { Disclosure } from "../layout/Disclosure";
import { sectionBody, sectionSubheading, tableScroll } from "../layout/prose";

const B = "backend" as const;

const coreLoop = [
  { num: "1", title: "DakenClearReport受信", note: "クライアントの打鍵判定を検証" },
  { num: "2", title: "Tick駆動の純関数", note: "コンボ・威力・相殺を計算" },
  { num: "3", title: "TargetingStrategy解決", note: "注入された作戦(0〜9)で対象決定" },
  { num: "4", title: "状態マージとKO判定", note: "横断的な状態機械(session)を更新" },
  { num: "5", title: "間引き配信 (S2C)", note: "差分や頻度を制御して全プレイヤーに送信" },
];

const highlights = [
  {
    tag: "なぜ／責務境界",
    title: "チート防止とクライアントの軽量化",
    body: "打鍵判定以外をすべてサーバーで確定させることで、不正を防ぎつつ重いクライアント計算を排除した。",
  },
  {
    tag: "なぜ／アーキ",
    title: "コアを外部環境から隔離したかった",
    body: "通信や時間を知らない純粋なTick駆動ロジックを作ることで、単体テストと高速シミュレーションを可能にした。",
  },
  {
    tag: "なぜ／Spine",
    title: "99人同時対戦の競合と負荷に耐えたい",
    body: "1部屋＝1Goroutine＋1Channel の設計で競合をなくし、PlayerListUpdatedの間引きで帯域の破綻を防いだ。",
  },
  {
    tag: "なぜ／テスト",
    title: "クライアント完成前に実戦負荷を見たい",
    body: "InMemory Connectionを用いたBot99体の自動入力テスト環境を作り、サーバー単体での負荷検証を実現した。",
  },
];

const ddElements = [
  ["層1: コア (game)", "✅ 戦闘の権威。純粋・Tick(dt)駆動。何もimportしない。"],
  ["層2: 継ぎ目 (ports)", "✅ コアが要求する interface (DIP)。凍結対象。"],
  ["層3: 部品 (strategies等)", "✅ 具体実装。作戦/お題/設定など。追加してもコアは無事。"],
  ["スパイン (room/transport)", "✅ ネットワークとコアを繋ぐ。1試合=1Goroutine。"],
  ["契約 (proto)", "✅ 全レイヤーが参照。クライアントとの唯一の結合点。"],
];

const strategyRows = [
  ["0", "SplitAttack（全体割り）", "生存者全員へ威力を均等分配"],
  ["1", "Counter（カウンター）", "自分に予告中の相手のうち最新の予告主"],
  ["2", "Finisher（とどめ）", "スタック比率が最大＝脱落に近い相手"],
  ["3", "BadgeHunter（バッジ狙い）", "バッジ獲得数が最大の相手"],
  ["4", "Random（ランダム・既定）", "生存者から一様ランダムに1名"],
  ["5", "Revenge（リベンジ）", "直近で自分に着弾させた相手"],
  ["6", "TallPoppy（出る杭）", "コンボ値が最大＝大技を溜めてる相手"],
  ["7", "Neighbor（隣狙い）", "PlayerId 昇順で自分の次の相手"],
  ["8", "PileOn（巻き添え）", "今いちばん狙われている相手"],
  ["9", "PacifistHunter（平和主義狩り）", "誰からも狙われていない相手からランダム"],
];

const bandwidthRows = [
  ["差分送信", "変化したプレイヤーだけを送る PlayerListDelta。全件スナップは低頻度のみ。"],
  ["ペイロード削減", "ミニ盤面に要る最小フィールドだけ。表示名(displayName)はMatchStart時のみ。"],
  ["量子化", "スタック量を生値でなく段階で送る。表示は段階で十分。"],
  ["送信頻度の間引き", "KO等の重要イベントは即時、細かな更新は間引いて送信。"],
];

const combatReworks = [
  {
    title: "誰も攻撃しなくなり、ゲームのテンポが死んだ",
    wall: "初期実装では「任意のタイミングでEnterキーを押して攻撃」でしたが、コンボを溜め込むメリットが強すぎたため、誰も攻撃せず黙々とタイピングするだけのゲームになりかけました。",
    solution: "Enterキーによる手動攻撃を廃止し、「お題をノーミスでクリアした瞬間に自動発火」へゲームルールを刷新しました。",
    reason: "「純粋なタイピングの連続（ノーミス継続）」自体が最大の攻撃になるようにゲーム性を根本から変え、テンポと駆け引きを生み出すためです。"
  },
  {
    title: "通信遅延でタイピングが「止まる」",
    wall: "1つのお題をクリアするたびにサーバーから次のお題が降ってくるのを待っていると、ネットワークのRTT（往復遅延）の分だけ毎回タイピングの手が止まってしまい、プレイ感が最悪でした。",
    solution: "お題を常に数件「先読み（Nextストック）」でクライアントに渡しつつ、他プレイヤーから被弾したお題（EnemySent）はキューの「3つ先」に割り込ませる複雑な制御を導入しました。",
    reason: "ローカルで即座に次のお題へ進める爽快感を維持しつつ、他者からの攻撃という「インタラプト（割り込み）」を自然な形で成立させるためです。"
  },
  {
    title: "クライアントごとに「自分の順位」が違う",
    wall: "99人がリアルタイムに脱落していく中、クライアントのローカル計算だけで順位を推測させた結果、画面上の順位と実際の順位がズレる（Desync）問題が多発しました。",
    solution: "クライアント側での近似計算を一切やめ、サーバー側で確実な rank（確定順位）を算出して毎フレーム配信するようにしました。",
    reason: "バトルロイヤルにおいて「順位」は最も重要な競技情報であり、ここがズレるとプレイヤーの納得感が失われるため、完全にサーバー権威へ移行しました。"
  }
];

const infraOps = [
  {
    title: "デプロイしないとゲームバランスがいじれない",
    wall: "「コンボ係数」や「スタック上限」といったバランス調整値がコードに直書き（ハードコード）されていたため、ハッカソン本番の限られた時間の中で調整するたびに再デプロイが必要でした。",
    solution: "Postgresデータベースと設定管理API（/api/params）を構築しました。",
    reason: "サーバーを落とさずに稼働中のパラメータを動的に書き換えられるようにし、本番中のリアルタイムなバランス調整（LiveOps）を可能にするためです。"
  },
  {
    title: "ハッカソン特有の「99人も人が集まらない」問題",
    wall: "99人対戦ゲームを作っても、テスト時や本番の過疎帯に99人も人が集まらず、そもそも試合が始まらないという致命的なリスクがありました。",
    solution: "InMemory接続を活用した「Botの自動補完」機能を実装し、足りない人数を自動でBotが埋めるフォールバックを用意しました。Botの強さも外部設定から変更可能です。",
    reason: "人間が1人でも確実に試合を成立させ、かつ適度な歯ごたえ（Botの強さ制御）を提供してゲームとして成立させるためです。"
  }
];

const obsessions = [
  {
    title: "純粋関数コアとヘッドレスシミュレーション",
    wall: "戦闘の権威である `internal/game` ロジックから「通信」と「時間」の概念を完全に排除しました。すべては外部から渡される `Tick(dt)` という入力だけで進むステートマシンになっています。",
    solution: "実ネットワークを介さず「メモリ上だけで99体のBotを戦わせる」超高速の負荷テスト（InMemory Connection）の土台になりました。",
    reason: "クライアント側の完成を待たずに、サーバー単体で「99人が実際に打ち合う負荷」の安全性を早期に証明するためです。"
  },
  {
    title: "1試合 = 1Goroutineのロックフリー設計",
    wall: "99人からの同時打鍵報告を、都度 Mutex（排他制御）でロックして状態更新すると、競合によるバグ（Race Condition）の温床になりがちです。",
    solution: "1試合につき1つの Goroutine と Channel だけを用意し、すべてのネットワークイベント（報告）をそのChannelに流し込んで直列処理（Actorモデル風）にしました。",
    reason: "競合状態を構造的に排除し、99人スケールでの安定性を極限まで高めるためです。ゲームのコアロジック内にロックは一切存在しません。"
  },
  {
    title: "depguardによる「後輩からコアを守る」機械強制",
    wall: "プロジェクトには後輩エンジニアも参加しており、彼らが自由にお題や作戦のコード（層3）を追加できるようにしつつ、心臓部の戦闘ロジック（層1）を絶対に壊されないようにする必要がありました。",
    solution: "依存関係が常に「外から内」へ向かうようにインターフェース（DIP）を切り出し、層1への不要な import をCIツール（golangci-lint の depguard）で機械的に弾く設定にしました。",
    reason: "口頭のルールではなく、CIによる機械的なブロックによって「安全な砂場」を提供し、チーム全体が安心して並行開発できるようにするためです。"
  }
];

export function BackendPage() {
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
          バックエンド
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
          純関数コアと 99人同期の Spine
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
          99人同時対戦の戦闘ロジックを確定させる Goサーバー。層アーキテクチャによる「変わらないコア」の隔離と、大量の通信を捌く負荷対策。
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a href="https://github.com/Okashimachi/Textro99-Server" target="_blank" rel="noreferrer" className="tag tag-outline">
            Textro99-Server（Go実装）
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
          戦闘の権威はすべてサーバー側にある——
          <br />
          クライアントには計算を一切許さない。
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
          サーバーの処理フロー（Tick駆動）
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
          サーバーは時間経過（Tick）とクライアントからの報告（DakenClearReport）のみをトリガーに状態機械を進める。攻撃はノーミスクリアのたびにサーバーが自動発火する。
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
          バックエンドのこだわり
        </span>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: "color-mix(in srgb, var(--color-text) 55%, transparent)" }}>
          より深い実装詳細は「設計の仕組みをもっと見る」にまとめてあります。
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

      {/* ── 詳細1：極限へのこだわり ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "24px 24px" }}>
        <Disclosure
          title="実装の極限へのこだわり"
          summary="純粋関数コア／ロックフリー設計／depguard機械強制"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <p style={sectionSubheading}>サーバーエンジニアとしての狂気</p>
            {obsessions.map((obs, idx) => (
              <div key={idx} style={{ paddingLeft: 16, borderLeft: "4px solid var(--color-accent-200)" }}>
                <h4 style={{ margin: "0 0 8px", fontSize: 18, color: "var(--color-accent)" }}>{obs.title}</h4>
                <p style={{ margin: "0 0 8px", fontSize: 14, lineHeight: 1.6 }}><strong>直面した課題:</strong> {obs.wall}</p>
                <p style={{ margin: "0 0 8px", fontSize: 14, lineHeight: 1.6 }}><strong>解決策:</strong> {obs.solution}</p>
                <p style={{ margin: "0", fontSize: 14, lineHeight: 1.6, color: "color-mix(in srgb, var(--color-text) 70%, transparent)" }}><strong>なぜやったか:</strong> {obs.reason}</p>
              </div>
            ))}
          </div>
        </Disclosure>
      </section>

      {/* ── 詳細2：実運用の壁 ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 24px" }}>
        <Disclosure
          title="実運用の壁と戦闘ルールの刷新"
          summary="DemoStageに向けた抜本改修／Enter攻撃の廃止／先読みと割り込み"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <p style={sectionSubheading}>ゲーム性と通信の課題への対応</p>
            <p style={sectionBody}>
              実際に動かして発覚したゲームテンポの悪さや、通信遅延による硬直に対処するため、DemoStage直前に大規模な「戦闘刷新」を行いました。
            </p>
            {combatReworks.map((rw, idx) => (
              <div key={idx} style={{ paddingLeft: 16, borderLeft: "4px solid var(--color-accent-200)" }}>
                <h4 style={{ margin: "0 0 8px", fontSize: 18, color: "var(--color-accent)" }}>{rw.title}</h4>
                <p style={{ margin: "0 0 8px", fontSize: 14, lineHeight: 1.6 }}><strong>直面した壁:</strong> {rw.wall}</p>
                <p style={{ margin: "0 0 8px", fontSize: 14, lineHeight: 1.6 }}><strong>解決策:</strong> {rw.solution}</p>
                <p style={{ margin: "0", fontSize: 14, lineHeight: 1.6, color: "color-mix(in srgb, var(--color-text) 70%, transparent)" }}><strong>なぜやったか:</strong> {rw.reason}</p>
              </div>
            ))}
          </div>
        </Disclosure>
      </section>

      {/* ── 詳細3：インフラと運用体制 ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 24px" }}>
        <Disclosure
          title="安定運用のためのインフラと設定管理"
          summary="PostgresとAPI／Bot補完／ゴースト接続対策"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <p style={sectionSubheading}>サービスを止めずに調整する工夫</p>
            <p style={sectionBody}>
              99人対戦を止めずにゲームバランスを調整したり、ハッカソン特有の「人が集まらない」問題に対処するためのバックエンドの工夫です。
            </p>
            {infraOps.map((op, idx) => (
              <div key={idx} style={{ paddingLeft: 16, borderLeft: "4px solid var(--color-accent-200)" }}>
                <h4 style={{ margin: "0 0 8px", fontSize: 18, color: "var(--color-accent)" }}>{op.title}</h4>
                <p style={{ margin: "0 0 8px", fontSize: 14, lineHeight: 1.6 }}><strong>直面した壁:</strong> {op.wall}</p>
                <p style={{ margin: "0 0 8px", fontSize: 14, lineHeight: 1.6 }}><strong>解決策:</strong> {op.solution}</p>
                <p style={{ margin: "0", fontSize: 14, lineHeight: 1.6, color: "color-mix(in srgb, var(--color-text) 70%, transparent)" }}><strong>なぜやったか:</strong> {op.reason}</p>
              </div>
            ))}
          </div>
        </Disclosure>
      </section>

      {/* ── 詳細4：設計の仕組み ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 40px" }}>
        <Disclosure
          title="アーキテクチャの仕組みをもっと見る"
          summary="層アーキテクチャ／DIPと依存の方向／TargetingStrategy／Spine設計"
        >
          <div>
            <p style={sectionSubheading}>層アーキテクチャ：コアを侵食から守る</p>
            <p style={sectionBody}>
              「変わらないもの（コア）を、変わるもの（部品）から守る」ことを目的に設計しました。中心の <code>game</code> パッケージ（層1）は戦闘の権威として時計も通信も持たず、部品からの依存は常に一方通行です。これを <code>depguard</code> で機械的に強制しています。
            </p>
            <div style={tableScroll}>
              <table className="table">
                <thead>
                  <tr>
                    <th>アーキテクチャ階層</th>
                    <th>役割と特徴</th>
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
            <p style={sectionSubheading}>柔軟なターゲティング戦略（TargetingStrategy）</p>
            <p style={sectionBody}>
              「誰を撃つか（ターゲット選択）」と「どれだけダメージを与えるか（威力計算）」を明確に分離しました。作戦（0〜9）はインターフェース越しに注入（DIP）されるため、新しい作戦を追加する際もコアロジックを一切触らずに済みます（Open/Closedの原則）。
            </p>
            <div style={tableScroll}>
              <table className="table">
                <thead>
                  <tr>
                    <th>作戦ID</th>
                    <th>作戦名</th>
                    <th>ターゲットの選び方</th>
                  </tr>
                </thead>
                <tbody>
                  {strategyRows.map((r) => (
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
            <p style={sectionSubheading}>99人同期を支えるスパイン（Spine）設計</p>
            <p style={sectionBody}>
              ネットワークとコアを繋ぐ <code>room</code> と <code>transport</code> では、1部屋＝1Goroutine＋1Channel の設計で競合を排除しつつTickループを駆動しています。99人分の状態を毎フレーム全員へ送ると破綻するため、間引き配信を行っています。
            </p>
            <div style={tableScroll}>
              <table className="table">
                <thead>
                  <tr>
                    <th>帯域対策</th>
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
        <a href="https://github.com/Okashimachi/Textro99-Server" target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
          Textro99-Server
        </a>
        <a href="https://github.com/Okashimachi/Textro99-Proto" target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
          Textro99-Proto
        </a>
      </footer>

      <RemoteNav current={B} />
    </div>
  );
}
