// 企画/仕様ページ。DESIGN_SPEC.md（Modernistデザインシステム）と Planning.dc.html を
// React + Tailwind でそのまま再現したもの。内容の正典は Textro99-Docs。
//
// DC版との対応: <x-dc> テンプレートの inline style / sc-for / sc-if を、そのまま
// React の style prop / map / 条件レンダーに変換しているだけで、構成・文言・データは
// Planning.dc.html のロジック（renderVals）と同一にしてある。
import type { CSSProperties } from "react";
import { Nav } from "../layout/Nav";
import { RemoteNav } from "../layout/RemoteNav";
import { Disclosure } from "../layout/Disclosure";

const coreLoop = [
  { num: "1", title: "ダケンをタイプ", note: "ノーミスでコンボ蓄積" },
  { num: "2", title: "攻撃が飛ぶ", note: "コンボを原資に相手へ" },
  { num: "3", title: "相手に予告", note: "着弾まで猶予1.5秒" },
  { num: "4", title: "相殺 or 被弾", note: "守る手段も「正確に打つ」こと" },
  { num: "5", title: "スタック上限20で脱落", note: "優劣がそのまま可視化される" },
];

const highlights = [
  {
    tag: "なぜ／単位設計",
    title: "1発即KOを二度と起こしたくなかった",
    body: "コンボ・威力・ダケン個数の単位を分離。「威力→個数」の変換漏れで起きていた事故を解消した。",
  },
  {
    tag: "なぜ／相殺",
    title: "守るだけの展開を退屈にしたくなかった",
    body: "余剰を消滅させず撃ち返しに転用し、攻防の駆け引きを残した（連鎖上限3回）。",
  },
  {
    tag: "なぜ／トラップダケン",
    title: "同じ不具合を二度直したくなかった",
    body: "過去の被弾履歴を持たず「到達済み最大値」だけを覚えるハイウォーターマーク方式に。",
  },
  {
    tag: "なぜ／作戦",
    title: "作り込みすぎて実装が止まるのを避けたかった",
    body: "メイン4作戦で完成させ、拡張6種はバランス調整用として優先度を切って追加した。",
  },
];

const unitExamples = [
  { scene: "序盤：5文字を3個クリアして攻撃", combo: "45", power: "45", count: "4", stack: "4/20。即KOにならない" },
  { scene: "中盤：10個ファームして溜め撃ち", combo: "150", power: "150", count: "15", stack: "15/20。大ダメージだが相殺可能" },
  {
    scene: "終盤：150コンボ＋バッジ10個",
    combo: "150",
    power: "300（×2.0）",
    count: "30",
    stack: "KO可。高コンボ＋最大バッジ＋無相殺が前提",
  },
];

const trapExamples = [
  { t: "1", stack: "3", floor: "0", milestone: "0", result: "何もなし" },
  { t: "2", stack: "6（被弾）", floor: "1", milestone: "0 → 1", result: "1 > 0 なのでトラップ発生（1個）" },
  { t: "3", stack: "4（打ち切り）", floor: "0", milestone: "1", result: "milestone は下げない。何もなし" },
  { t: "4", stack: "7（再被弾）", floor: "1", milestone: "1", result: "1は1を超えない → 発生しない（次は10到達）" },
];

const strategyRows = [
  { key: "1", name: "カウンター", target: "自分を狙っている相手", aim: "防御的。狙われた分を撃ち返す基本作戦" },
  { key: "2", name: "とどめ", target: "スタックが上限に近い相手", aim: "KO（バッジ）を拾いに行く漁夫の利型" },
  { key: "3", name: "バッジ狙い", target: "バッジ所持数が最多の相手", aim: "強者を叩いてバッジ総取りを狙うハイリターン型" },
  { key: "4", name: "ランダム", target: "無作為", aim: "既定値。迷ったらこれ／ヘイト分散" },
  { key: "5", name: "リベンジ", target: "直近で自分に着弾させた相手", aim: "実害を与えてきた相手への報復。感情的な納得感" },
  { key: "6", name: "出る杭", target: "コンボ最多の相手", aim: "溜めプレイへの牽制。バランス上も重要" },
  { key: "7", name: "隣狙い", target: "盤面上で自分の隣の相手", aim: "隣人と潰し合う分かりやすさ。配信・パーティ向け" },
  { key: "8", name: "巻き添え", target: "最も多くから狙われている相手", aim: "集中砲火に相乗り。とどめより早く便乗できる" },
  { key: "9", name: "平和主義", target: "誰も狙っていない相手", aim: "安全にファームしている相手を狩る。逃げ切りへの牽制" },
  { key: "0", name: "全体割り", target: "生存者全員に等分散布", aim: "終盤ほど相対的に強い特殊枠" },
];

const difficultyTargets = [
  {
    target: "ダケンプール",
    detail: "難易度段階0〜10ごとに単語リストを用意。文字数→濁音/促音/拗音の混在率→記号・数字混じり、の順で難しくする",
  },
  { target: "制限時間", detail: "基準5.0秒から1段階ごとに−0.3秒（下限2.0秒）" },
  { target: "時間切れ", detail: "即座に打ち切り、通常ダケン1個分の積み残しとしてスタックへ加算" },
];

const matchingParams = [
  {
    param: "matching.minPlayers",
    value: "20（仮）",
    note: "カウントダウン開始に必要な最低人数。当日の入りに応じてリモートコンフィグで変更可能",
  },
  { param: "matching.maxPlayers", value: "99", note: "到達したら即開始" },
  { param: "matching.startCountdownMs", value: "15000", note: "「今から始まる」感と駆け込み参加の猶予の両立" },
];

const transitionSteps = ["タイトル", "マッチング待機", "試合中", "観戦", "リザルト"];

const resultRows = [
  { label: "最終順位", detail: "脱落順（後に脱落したほど上位）。最後の1人が1位" },
  { label: "KO数 / バッジ", detail: "自分が脱落させた人数と、その時点の所持バッジ数" },
  { label: "タイプ統計", detail: "総タイプ数・ミス率・平均クリア速度・最大コンボ" },
  { label: "再マッチング導線", detail: "「もう一度」を常設し、即座に次のキューへ再投入する" },
];

const decisionRows = [
  { decision: "コンボはミスで一部減衰", rejected: "全消し（ゼロリセット）は、積み上げた成功を1ミスで失う理不尽さが勝つため却下" },
  { decision: "正確性ボーナスに上限なし", rejected: "頭打ちは、正確性というタイピングの核となる価値を損なうため却下" },
  { decision: "コンボの時間自然減衰なし", rejected: "プレイヤーへの認知負荷が高いため却下" },
  { decision: "逃げ切り対策は全体難易度の時間上昇", rejected: "タイムリミット方式ではなく、だんだん苦しくなる圧として実装" },
  { decision: "勝利条件は最終生存のみ", rejected: "クリア数等を勝敗に加味する案は達成感を薄めるため却下" },
  { decision: "被弾＝ダケン送付・スタック上限で脱落", rejected: "HP制は絶望感が無く淡白。制限時間削り型は調整が困難で両方却下" },
  { decision: "相殺の余剰は撃ち返しに転用", rejected: "「消滅」案は簡単だが、攻防の駆け引きが失われるため却下" },
  { decision: "時間切れは即座に積み残し扱い", rejected: "猶予を与える案は見送り。実装を単純化する狙い" },
];

const changeRows = [
  {
    before: "Enterキーで能動的に攻撃を発動",
    after: "サーバーがノーミスクリアを起点に自動発火",
    reason: "操作を文字キー＋0〜9の2種だけに絞り切れるため",
  },
  {
    before: "戦闘判定もクライアントで行う共有Core",
    after: "サーバー権威に転換。役割ごとに置き場所を再設計",
    reason: "サーバー権威にした時点でクライアント共有の理由が消えたため",
  },
  {
    before: "99人分を全員へ定期配信",
    after: "変化した分だけ送るPlayerListDeltaを追加",
    reason: "99人×99人で毎tick約1万件相当が飛ぶため",
  },
  {
    before: "ダケンは常にキュー末尾へ追加",
    after: "被弾ダケンは途中（既定3手先）へ割り込ませる",
    reason: "末尾追加だと被弾の圧を体感するまでが遅いため",
  },
];

const todoItems = [
  "数値はすべて実測調整前の仮値。優先順位も決めてある（①予告猶予 → ②威力→個数の変換率 → ③スタック上限と難易度上昇間隔 → ④コンボ加算と減衰）",
  "ダケンプールの実データ（単語リスト・煽り文リスト）はテーマ確定後に着手",
  "コンボ→威力の逓増カーブは等倍のまま保留",
  "切断・再接続の扱い。まずは即脱落の割り切りで開始し、Bot実装後に段階的拡張予定",
  "タイトル名・テーマの正式決定",
];

const bodyMuted: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.7,
  color: "color-mix(in srgb, var(--color-text) 78%, transparent)",
  margin: "0 0 12px",
};
const subheading: CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontWeight: 800,
  fontSize: 16,
  margin: "0 0 8px",
};

export function PlanningPage() {
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
          企画 / 仕様
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
          寿司打 × テトリス99 × ぷよぷよ通
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
          タイピングという行為自体には一切手を入れず、その周囲に「攻撃」「防御」「ターゲティング」という薄い対戦レイヤーだけを乗せて99人バトルロイヤル化する。
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a href="https://github.com/Okashimachi/Textro99-Docs" target="_blank" rel="noreferrer" className="tag tag-outline">
            Textro99-Docs（正典）
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
          「速く打ちたい、でもミスしたくない」——
          <br />
          そのタイピングの根源的なジレンマを、そのまま攻撃力と生存に直結させた。
        </p>
      </section>

      <hr className="hr" style={{ maxWidth: 960, margin: "0 auto" }} />

      {/* ── コアループ ── */}
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
          コアループ（1試合5〜10分）
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", rowGap: 16 }}>
          {coreLoop.map((step, i) => (
            <div key={step.num} style={{ display: "flex", alignItems: "flex-start", gap: 4 }}>
              <div
                style={{
                  width: 150,
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
          操作は文字キー＋数字キー（0〜9・作戦切替）だけ。タイピングのフロー状態を壊さないための制約。
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
          具体的な数値・対処は「仕組みをもっと見る」にまとめてあります
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

      {/* ── 詳細1：仕組み ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "24px 24px" }}>
        <Disclosure title="仕組みをもっと見る" summary="単位変換の数値例／トラップダケン／全10作戦／難易度／マッチング／画面遷移">
          <div>
            <p style={subheading}>単位の設計（コンボ→威力→ダケン個数）</p>
            <p style={bodyMuted}>
              旧仕様は「威力→ダケン個数」の変換が抜けており、コンボ数がそのまま送付個数になって1発即KOしていた。相殺を威力で行い、相殺後に残った威力だけを個数へ変換すると決めたことで、以降は各数値を自由に調整しても破綻しなくなった。
            </p>
            <div style={{ overflowX: "auto" }}>
<table className="table">
              <thead>
                <tr>
                  <th>場面</th>
                  <th>コンボ</th>
                  <th>威力</th>
                  <th>送るダケン数</th>
                  <th>相手スタック（上限20）</th>
                </tr>
              </thead>
              <tbody>
                {unitExamples.map((r) => (
                  <tr key={r.scene}>
                    <td>{r.scene}</td>
                    <td>{r.combo}</td>
                    <td>{r.power}</td>
                    <td>{r.count}</td>
                    <td>{r.stack}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          <div>
            <p style={subheading}>トラップダケン：ハイウォーターマーク方式</p>
            <p style={bodyMuted}>
              スタックが5個溜まるごとに長文の煽りダケンが届く。「5を超えた→減った→また超えた」で連発する問題を、到達済みの最大マイルストーンを整数1個だけ持つ方式で解消した。
            </p>
            <div style={{ overflowX: "auto" }}>
<table className="table">
              <thead>
                <tr>
                  <th>時刻</th>
                  <th>スタック</th>
                  <th>floor(/5)</th>
                  <th>milestone</th>
                  <th>判定</th>
                </tr>
              </thead>
              <tbody>
                {trapExamples.map((r) => (
                  <tr key={r.t}>
                    <td>{r.t}</td>
                    <td>{r.stack}</td>
                    <td>{r.floor}</td>
                    <td>{r.milestone}</td>
                    <td>{r.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          <div>
            <p style={subheading}>ターゲティング作戦（数字キー 0〜9 で10種）</p>
            <p style={bodyMuted}>
              メイン4種はテトリス99準拠。拡張6種はバランス調整の役割を持たせて設計（報復の納得感／溜めプレイの牽制／安全ファームの牽制）。初期実装は1〜4だけでも成立する。
            </p>
            <div style={{ overflowX: "auto" }}>
<table className="table">
              <thead>
                <tr>
                  <th>キー</th>
                  <th>作戦</th>
                  <th>対象</th>
                  <th>狙い</th>
                </tr>
              </thead>
              <tbody>
                {strategyRows.map((r) => (
                  <tr key={r.key}>
                    <td>{r.key}</td>
                    <td>{r.name}</td>
                    <td>{r.target}</td>
                    <td>{r.aim}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          <div>
            <p style={subheading}>難易度：全体の圧と個人の圧を合成</p>
            <p style={{ ...bodyMuted, marginBottom: 8 }}>
              全体難易度（30秒ごとに+1段階）と個人難易度（コンボ20ごとに+1、上限+5）を合成し、上限でクリップする。
            </p>
            <div
              style={{
                border: "1px solid var(--color-divider)",
                background: "var(--color-surface)",
                padding: "10px 12px",
                fontFamily: "ui-monospace,monospace",
                fontSize: 13,
                marginBottom: 12,
              }}
            >
              実効難易度 = min( 全体難易度段階 + 個人コンボ連動段階, 10 )
            </div>
            <div style={{ overflowX: "auto" }}>
<table className="table">
              <thead>
                <tr>
                  <th>効かせる先</th>
                  <th>内容</th>
                </tr>
              </thead>
              <tbody>
                {difficultyTargets.map((r) => (
                  <tr key={r.target}>
                    <td>{r.target}</td>
                    <td>{r.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          <div>
            <p style={subheading}>マッチング：99人を厳密に待たない</p>
            <p style={bodyMuted}>
              「99人ちょうどを待つ」方式は出展規模だと試合が始まらない事故に直結するため、人数下限に達したらカウントダウンして開始する方式にした。
            </p>
            <div style={{ overflowX: "auto" }}>
<table className="table">
              <thead>
                <tr>
                  <th>パラメータ</th>
                  <th>初期仮値</th>
                  <th>備考</th>
                </tr>
              </thead>
              <tbody>
                {matchingParams.map((r) => (
                  <tr key={r.param}>
                    <td>
                      <code>{r.param}</code>
                    </td>
                    <td>{r.value}</td>
                    <td>{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          <div>
            <p style={subheading}>画面遷移とリザルト</p>
            <p style={bodyMuted}>
              アートが未確定なので、見た目ではなく状態と遷移だけを先に決めた。脱落しても即座に次の試合へ再マッチングできる回転の良さを重視。
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {transitionSteps.map((s) => (
                <span key={s} className="tag tag-neutral">
                  {s}
                </span>
              ))}
            </div>
            <div style={{ overflowX: "auto" }}>
<table className="table">
              <thead>
                <tr>
                  <th>リザルトに出す項目</th>
                  <th>内容</th>
                </tr>
              </thead>
              <tbody>
                {resultRows.map((r) => (
                  <tr key={r.label}>
                    <td>{r.label}</td>
                    <td>{r.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </Disclosure>
      </section>

      <hr className="hr" style={{ maxWidth: 960, margin: "0 auto" }} />

      {/* ── 詳細2：意思決定ログ ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "24px 24px" }}>
        <Disclosure title="意思決定ログを見る" summary="却下した代替案／実装しながら変わった仕様">
          <div>
            <p style={subheading}>却下した代替案と理由</p>
            <p style={{ fontSize: 13, color: "color-mix(in srgb, var(--color-text) 60%, transparent)", margin: "0 0 12px" }}>
              仕様に迷ったときに同じ議論を二度しないよう、決定だけでなく却下した代替案も残している。
            </p>
            <div style={{ overflowX: "auto" }}>
<table className="table">
              <thead>
                <tr>
                  <th>決定</th>
                  <th>却下した代替案と理由</th>
                </tr>
              </thead>
              <tbody>
                {decisionRows.map((r) => (
                  <tr key={r.decision}>
                    <td>{r.decision}</td>
                    <td>{r.rejected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
          <div>
            <p style={subheading}>実装しながら仕様が変わったところ</p>
            <div style={{ overflowX: "auto" }}>
<table className="table">
              <thead>
                <tr>
                  <th>当初の仕様</th>
                  <th>現在</th>
                  <th>理由</th>
                </tr>
              </thead>
              <tbody>
                {changeRows.map((r) => (
                  <tr key={r.before}>
                    <td>{r.before}</td>
                    <td>{r.after}</td>
                    <td>{r.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </Disclosure>
      </section>

      <hr className="hr" style={{ maxWidth: 960, margin: "0 auto" }} />

      {/* ── 詳細3：現在地 ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "24px 24px" }}>
        <Disclosure title="現在地・まだ決めていないこと" summary="テーマ非依存の構造／未確定の数値と仕様">
          <div>
            <p style={subheading}>テーマを差し替えても仕様が壊れない構造</p>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "color-mix(in srgb, var(--color-text) 78%, transparent)", margin: 0 }}>
              「テキストロ99」は仮称で、寿司モチーフ自体も変更予定。そこで仕様書・コードではテーマ非依存の抽象名（ダケン／ダケンスタック／トラップダケン）を概念名として使い、表示名とアートだけを差し替えれば済む構造にしている。日本語の会話用語とコード上の名称の対応を用語集で正典化し、企画・サーバー(Go)・Web(TS)・Unity(C#)の4リポジトリすべてで同じ語を使う。
            </p>
          </div>
          <div>
            <p style={{ ...subheading, marginBottom: 10 }}>まだ決めていないこと</p>
            <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              {todoItems.map((t) => (
                <li key={t} style={{ fontSize: 14, lineHeight: 1.7, color: "color-mix(in srgb, var(--color-text) 78%, transparent)" }}>
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
        <a href="https://github.com/Okashimachi/Textro99-Docs" target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
          Textro99-Docs
        </a>
        <a href="https://github.com/Okashimachi/Textro99-Proto" target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
          Textro99-Proto
        </a>
      </footer>

      <RemoteNav current="planning" />
    </div>
  );
}
