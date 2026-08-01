// フロントページ。内容の正典は Textro99-Client-Docs（Web/Unity 共通設計）と
// Textro99-WebFront（実装）。読者はエンジニアなので、
// 「サーバー権威の下でクライアントをどこまで薄くできるか」という設計判断を主題にしている。
import { Layout } from "../layout/Layout";
import { Panel } from "../layout/Panel";
import { Figure } from "../layout/Figure";
import { Table } from "../layout/Table";
import { Flow } from "../layout/Flow";
import { Sequence } from "../layout/Sequence";
import { Callout } from "../layout/Callout";

const F = "frontend" as const;

export function FrontendPage() {
  return (
    <Layout
      accent={F}
      title="フロント"
      description="サーバー権威を前提に、クライアントの責務を「打鍵判定」と「送受信」だけに絞る。Unity がそのままミラーできる薄さを保つための設計。"
      repos={[
        {
          label: "Textro99-WebFront（Webフロント実装）",
          href: "https://github.com/Okashimachi/Textro99-WebFront",
        },
        {
          label: "Textro99-Client-Docs（Web/Unity共通設計の正典）",
          href: "https://github.com/Okashimachi/Textro99-Client-Docs",
        },
        {
          label: "Textro99-Proto（共有契約）",
          href: "https://github.com/Okashimachi/Textro99-Proto",
        },
      ]}
    >
      {/* ── 責務境界 ───────────────────────────────── */}
      <Panel accent={F} label="絶対原則：クライアントはタイピング以外の処理を持たない">
        <Callout kind="rule" label="この1行が全設計の起点">
          クライアントが自前で行う処理は<strong>打鍵判定（ローカル）だけ</strong>。
          それ以外はすべて<strong>サーバーへの送受信</strong>に還元する。例外を作らない。
        </Callout>
        <div className="mt-3">
          <Table
            head={["クライアントが持つもの", "クライアントが持たないもの"]}
            rows={[
              [
                "WebSocket 接続・送受信・ディスパッチ層",
                "コンボ / 威力 / 相殺 / スタック / KO / ターゲティング / 難易度の計算",
              ],
              ["受信 state を写す表示コンポーネント群", "ダケンの時間切れ判定・脱落判定"],
              ["打鍵判定（TypingJudge）", "ゲームパラメータの外部DB取得"],
              ["入力処理（文字キー / 0〜9）", "プロトコル契約そのものの決定・変更"],
            ]}
          />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-zinc-700">
          この境界を「気をつける」ではなく<strong>レビュー観点</strong>にまで落としているのがポイントで、
          フロントのコードは AI に書かせる前提のため、レビューは
          <strong>「打鍵判定以外のロジックが混入していないか」</strong>
          の一点に絞っている。AIは放っておくと気を利かせてコンボ加算をローカルで実装してしまうので、
          規約コメントと禁止事項チェックリストをリポジトリに常設して事故を防いでいる。
        </p>
      </Panel>

      {/* ── アーキ ───────────────────────────────── */}
      <Panel accent={F} label="アーキテクチャ：MVU（単方向データフロー）" right="Client-Docs 第2章">
        <p className="text-sm leading-relaxed text-zinc-700">
          クライアントが薄いという非対称性が、そのままアーキ選定を決めた。ドメインロジックが打鍵判定しかない以上、
          <strong>フルDDDの戦術パターン（集約・リポジトリ・ドメインサービス）は過剰</strong>。
          「イベント受信 → state 更新 → 再描画」という性質に最も素直に一致する MVU（Model-View-Update）を採った。
        </p>
        <Figure caption="採らなかったのは戦術パターンだけで、ユビキタス言語と識別子型の厳密さ（DakenId を素の string と混同しない）は取り入れている。">
          <Flow
            accent={F}
            direction="horizontal"
            nodes={[
              { title: "S2C メッセージ", note: "WebSocket / JSON" },
              { title: "Dispatcher", note: "type で振り分けるだけ" },
              { title: "Reducer", note: "純関数で畳み込む" },
              { title: "ViewModel", note: "single source of truth" },
              { title: "View", note: "読むだけ" },
            ]}
          />
        </Figure>
        <Table
          head={["DDDの要素", "本作での判断"]}
          colClassName={["w-40", ""]}
          rows={[
            ["エンティティ / 集約", "❌ 戦闘ドメインはサーバーにある。クライアントは ViewModel のみ"],
            ["ドメインサービス", "❌ クライアントに戦闘計算がない"],
            ["リポジトリ", "❌ 永続化・DB取得をクライアントは持たない"],
            ["ユビキタス言語", "✅ 採用。用語集に従い変数名まで一貫させる"],
            ["値オブジェクト的な型の厳密さ", "✅ 部分採用。識別子を素の string で混同しない"],
          ]}
        />
      </Panel>

      {/* ── モジュール分割 ─────────────────────────── */}
      <Panel accent={F} label="モジュール分割と依存の向き" right="Client-Docs 第3章">
        <Figure caption="依存は常に「プラットフォーム固有 → 共通コア → 契約」の一方向。共通コアが React / Unity を知らないので、View と Input だけ差し替えれば Unity 版になる。">
          <Flow
            accent={F}
            nodes={[
              {
                title: "View / InputSource（プラットフォーム固有）",
                note: "React コンポーネント・keydown ハンドラ。Unity では Prefab と Input System に置き換わる",
              },
              {
                title: "共通コア：Store / Dispatcher / TypingJudge / NetworkClient(抽象)",
                note: "言語非依存インターフェースで定義し、TS と C# が 1:1 でミラーする層",
              },
              {
                title: "Proto（型・契約）",
                note: "全リポジトリ唯一の結合点。DTO・メッセージ・ローマ字テーブル",
              },
            ]}
            edgeLabels={["依存", "依存"]}
          />
        </Figure>
        <p className="text-sm leading-relaxed text-zinc-700">
          共通コアのモジュール同士も<strong>インターフェース越しにしか参照しない</strong>。
          モジュールが2つ以上の関心を持ち始めたら分割する（例：Dispatcher が描画最適化を始めたら Renderer 側へ寄せる）という、
          分割のトリガーまで規約に書いてある。
        </p>
      </Panel>

      {/* ── コアループ ───────────────────────────── */}
      <Panel accent={F} label="コアループの通信：ダケン単位で報告する" right="試合進行仕様 2章">
        <Figure caption="1文字ごとにサーバーと往復するのはレイテンシ・負荷の両面で非現実的。打鍵はローカルで判定し、1ダケン打ち切った結果だけを送る。">
          <Sequence
            accent={F}
            participants={["クライアント", "ゲームサーバー"]}
            steps={[
              { from: 1, to: 0, label: "MatchStart（初期ダケン・パラメータ公開サブセット）" },
              { from: 0, to: 0, label: "打鍵判定（ローカル・表示用）" },
              { from: 0, to: 1, label: "DakenClearReport（dakenId, missCount, elapsedMs）" },
              { from: 1, to: 1, label: "コンボ確定・実効難易度を再計算" },
              { from: 1, to: 0, label: "ComboUpdated", dashed: true },
              { from: 1, to: 0, label: "DakenIssued（次ダケン・難易度反映済み）", dashed: true },
              { from: 1, to: 1, label: "Tick駆動で制限時間の超過を監視" },
              { from: 1, to: 0, label: "DakenExpired（クライアント報告を待たない）", dashed: true },
            ]}
          />
        </Figure>
        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-700">
          <li>
            <strong>クライアントが「送らないもの」を仕様で明示している</strong>
            ：ダケンの時間切れ報告と脱落報告は存在しない。どちらもサーバーが自律確定するので、
            対応する C2S メッセージ自体を作らない。「作らない」と決めておくと、AIが親切に実装してしまう余地も消える。
          </li>
          <li>
            サーバーは受け取った <code className="bg-zinc-100 px-1">dakenId</code> が
            「現在そのプレイヤーに発行中のダケン」と一致するかを検証し、一致しなければ無視する（チート対策）。
          </li>
        </ul>
      </Panel>

      {/* ── 打鍵判定 ───────────────────────────── */}
      <Panel accent={F} label="打鍵判定：ローマ字オートマトンを自作した" right="Client-Docs 第6章">
        <p className="text-sm leading-relaxed text-zinc-700">
          クライアント唯一のローカルドメイン。ここは既製ライブラリ（wanakana 等）を
          <strong>意図的に使わず</strong>、共有テーブル＋薄い変換オートマトンを自作している。
        </p>
        <div className="mt-3">
          <Table
            head={["ライブラリを使わなかった理由", "内容"]}
            colClassName={["w-40", ""]}
            rows={[
              ["用途が違う", "既製品は「文章の一括変換」用。1キーごとの逐次判定・途中入力の前方一致を想定していない"],
              ["複数正解を扱えない", "し＝si/shi、じゃ＝zya/ja/jya のような表記ゆれを受理集合として持てない"],
              ["Web/Unity で判定がズレる", "C# に同等品が無い。両クライアントで判定差異が出るのは二重管理禁止・ミラー原則に反する"],
            ]}
          />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-zinc-700">
          実装は「お題（かな）を打鍵単位に分割し、各単位に受理ローマ字の候補列を持たせる」形。
          キー入力は候補への<strong>前方一致</strong>で進み、どの枝にも合わなければミス、終端に達したら確定。
          特に詰まりやすい3ケースは、ロジックではなく<strong>テーブル側</strong>に吸収させている。
        </p>
        <div className="mt-3">
          <Table
            head={["ケース", "受理する綴り", "扱い"]}
            colClassName={["w-24", "w-52", ""]}
            rows={[
              [
                "促音「っ」",
                "がっこう → gakkou / galtukou / gaxtukou",
                "次の打鍵単位の候補に子音重ねと ltu/xtu/ltsu を合成して吸収する",
              ],
              [
                "撥音「ん」",
                "nn / n / xn",
                "n で止めるか続けるかが後続に依存する。判定側の前方一致フォールバック（bufferが候補に完全一致していれば単位を確定して次へ送る）で解消",
              ],
              [
                "拗音「きゃ」",
                "kya / ki + lya",
                "拗音は2かなで1打鍵単位。分割入力も候補として持つ",
              ],
            ]}
          />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-zinc-500">
          ローマ字テーブルは最終的に Proto の共有データへ移す前提なので、
          <strong>変換テーブルのファイル1枚を差し替えれば判定エンジンは触らずに移行できる</strong>
          よう、戻り値の形（打鍵単位＋候補列）だけを契約として固定してある。
          カタカナのお題はひらがなへ正規化し、英数字は1文字＝1単位のリテラルとして同じ経路で処理する。
        </p>
      </Panel>

      {/* ── 状態管理 ───────────────────────────── */}
      <Panel accent={F} label="状態管理：ライブラリを入れない" right="Client-Docs 第4章">
        <p className="text-sm leading-relaxed text-zinc-700">
          状態の実体はサーバー側にあり、フロントは受信 state を写すだけ。だから状態管理ライブラリを入れず、
          <code className="bg-zinc-100 px-1">useState</code> /{" "}
          <code className="bg-zinc-100 px-1">useReducer</code> のみで組んでいる。
          reducer は「サーバーが言ったことを写す」だけの純関数で、派生計算をここに書かないことをコメントで明示している。
        </p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">
          そのうえで、<strong>楽観的更新の境界を表として厳密に定義</strong>した。
          「見た目の即応」だけローカル、「勝敗に関わる値」は必ずサーバー確定を待つ。
        </p>
        <div className="mt-3">
          <Table
            head={["事象", "ローカル即時反映", "サーバー確定待ち"]}
            colClassName={["", "w-24", "w-40"]}
            rows={[
              ["タイプした文字が消えていく表示", "✅", "—"],
              ["ミスの打鍵フィードバック（赤表示・打鍵音）", "✅", "—"],
              ["コンボ値", "❌", "✅ ComboUpdated"],
              ["ダケンスタック増減", "❌", "✅ DakenStackUpdated"],
              ["攻撃の威力・相殺結果", "❌", "✅ AttackIncoming / OffsetResolved"],
              ["KO・脱落・順位", "❌", "✅ KoNotified / GameOver"],
            ]}
          />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-zinc-500">
          試合中の順位表示も同じ考え方で、当初あったクライアント側の近似順位算出は廃止し、
          サーバー確定順位（<code className="bg-zinc-100 px-1">PlayerSummary.rank</code>）で並べ替えるだけにした。
          「クライアントが順位を推定する」と、サーバーの確定値とズレた瞬間に不信感が出る。
        </p>
      </Panel>

      {/* ── ディスパッチ層 ─────────────────────────── */}
      <Panel accent={F} label="ディスパッチ層：Unity がミラーする参照実装" right="Client-Docs 第5章">
        <p className="text-sm leading-relaxed text-zinc-700">
          本番クライアントは Unity だが、実装・イテレーション・サーバー結合テストのコストが高い。そこでまず Web で
          <strong>「遊べて・複数人でテストできる状態」を最速で作る</strong>方針を取った。
          Web の接続・送受信・ディスパッチ層は、後から Unity が C# で同じ構造をミラーするための
          <strong>参照実装</strong>を兼ねる。だからこの層には独自解釈もゲームロジックも一切置かない。
        </p>
        <div className="mt-3">
          <Table
            head={["この層がやること", "この層がやらないこと"]}
            rows={[
              ["接続確立 / 切断 / 指数バックオフの自動再接続", "state の畳み込み（Reducer の仕事）"],
              ["C2S を Envelope { type, payload } で送信", "UI・描画（View の仕事）"],
              ["受信 Envelope を type ごとにハンドラへ振り分け", "打鍵判定（TypingJudge の仕事）"],
              ["未知の type は無視してログ（前方互換）", "契約の解釈変更（Proto が正典）"],
            ]}
          />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-zinc-700">
          接続先 URL は環境変数で切り替える（ローカル / デプロイ版 / 当日会場）。コードには直書きしない。
          Proto の型は<strong>バージョン固定で参照</strong>し、勝手に最新を追わない。
          Web リポジトリ内の型定義ファイルには「これは Proto の写しであり、ここでは編集しない」という
          由来・版・取得日をヘッダに書いて、契約の正典がどこかを見失わないようにしている。
        </p>
      </Panel>

      {/* ── 実運用でぶつかった罠 ───────────────────── */}
      <Panel accent={F} label="実際にぶつかった、契約と実装の噛み合わせ">
        <p className="mb-3 text-sm leading-relaxed text-zinc-700">
          仕様どおりに書くだけでは出てこない、<strong>作って動かして初めて分かった問題</strong>と、その対処。
        </p>
        <Table
          head={["起きたこと", "原因", "対処"]}
          rows={[
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
          ]}
        />
      </Panel>

      {/* ── 帯域と描画 ───────────────────────────── */}
      <Panel accent={F} label="99人ぶんの盤面をどう受けて、どう描くか">
        <p className="text-sm leading-relaxed text-zinc-700">
          99人分のサマリを99人へ毎tick送ると、単純計算で毎回 O(99×99) ≒ 約1万件相当が飛ぶ。
          契約側で<strong>差分メッセージ</strong>を追加し、フロントは全件スナップショットと差分マージの
          <strong>両方に対応できる reducer</strong> にしてある。
        </p>
        <div className="mt-3">
          <Table
            head={["対策", "内容"]}
            colClassName={["w-32", ""]}
            rows={[
              ["差分送信", "変化したプレイヤーだけを送る PlayerListDelta。全件スナップは低頻度のみ"],
              ["ペイロード削減", "ミニ盤面に要る最小フィールドだけ（スタック比・生存・バッジ数）。表示名は初回のみ"],
              ["量子化", "スタック量を生値でなく段階で送る。表示は段階で十分"],
              ["送信頻度の間引き", "KO等の重要イベントは即時、細かな更新は間引く"],
            ]}
          />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-zinc-700">
          描画側は 7×14 の98マス（＝自分を除く相手の数）で固定し、サーバーから届いていない席は「欠席」として描く。
          <strong>少人数でも盤面の形が変わらない</strong>ので、当日の人数に左右されず「99人と戦っている画」を保てる。
          生存者はスタック比で緑→琥珀→赤に色分けし、危険度が一望できるようにしている。
        </p>
      </Panel>

      {/* ── 開発体験 ───────────────────────────── */}
      <Panel accent={F} label="開発体験：切り分けを最初に作る">
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
          <li>
            <strong>RawStateDebugPane を最初に作った</strong>
            ：受信 JSON をそのまま整形表示するペイン。UI は AI 生成なのでバグり得るが、正データを常にここで確認できるので
            「サーバー（ロジック）のバグか、表示のバグか」を即座に切り分けられる。
          </li>
          <li>
            <strong>フロント完結のモックサーバー</strong>
            ：サーバー未接続でも「出題 → 表示 → タイピング → 判定」のループを試せるローカル模擬サーバーを dev 用に持つ。
            実通信と同じディスパッチ経路を通すので、配線の検証としても機能する。
            これは<strong>ロジックの正典ではない</strong>と明記し、実挙動は必ず実サーバーで確認する運用にしている。
          </li>
          <li>
            <strong>本番導線と開発導線を分けた</strong>
            ：来場者が触る「プレイする」導線には開発ツールを一切出さず、
            <code className="bg-zinc-100 px-1">?test=1</code> を付けたときだけテスト用入口（モード選択・練習モード・送信ログ・生state表示）が現れる。
            実装を消さずに隠せるので、出展中でもその場でデバッグに切り替えられる。
          </li>
          <li>
            <strong>試合開始のタイミングはフロントで持たない</strong>
            ：カウントダウンもサーバー配信の残り時間を表示するだけで、ローカルで秒を数えて開始しない。
            「表示するだけ」を徹底すると、複数人テストで「人によって開始タイミングが違う」類のバグが構造的に発生しなくなる。
          </li>
        </ul>
      </Panel>

      {/* ── Unityミラー ─────────────────────────── */}
      <Panel accent={F} label="Unity へ渡すための約束事" right="Client-Docs 第9章">
        <p className="text-sm leading-relaxed text-zinc-700">
          Web は恒久的な本番ではなく<strong>「Unity へ移行するまでの検証ハーネス」</strong>。
          Unity が unityroom にデプロイできる状態になったら、サーバーの結合テスト相手も Web から Unity へ切り替える。
          その移行を「見た目を作るだけ」に近づけるため、クロス言語の規約を先に決めてある。
        </p>
        <div className="mt-3">
          <Table
            head={["対象", "TS", "C#", "規約"]}
            colClassName={["w-32", "", "", ""]}
            rows={[
              ["型・メッセージ名", "DakenClearReport", "DakenClearReport", "Proto の名称をそのまま使い、言語ごとに言い換えない"],
              ["メソッド", "send", "Send", "大文字小文字の慣習差のみ許容。語幹は同一"],
              ["インターフェース", "Renderer", "IRenderer", "接頭辞は各言語の慣習でよいが語幹を一致させる"],
              ["on-wire JSON", "camelCase", "camelCase へマッピング", "Proto の JSON タグが正典。C# は属性で合わせる"],
            ]}
          />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-zinc-500">
          片方の言語だけ名前を変えない。名前を変えるときは対応表と両言語を同時に更新する ── という運用まで含めて規約にしている。
        </p>
      </Panel>

      {/* ── 技術スタック ─────────────────────────── */}
      <Panel accent={F} label="技術スタックと、その選定理由">
        <Table
          head={["項目", "選定", "理由"]}
          colClassName={["w-24", "w-40", ""]}
          rows={[
            [
              "フレームワーク",
              "React 18 + TypeScript",
              "AI生成の精度・修正耐性が高い。ファイル分割＋型が、そのままAIへのガードレールになる",
            ],
            ["ビルド", "Vite", "セットアップ最小・起動高速"],
            [
              "状態管理",
              "なし（useState / useReducer）",
              "状態の実体はサーバー側。受信 state を写すだけなので Redux 等は不要",
            ],
            ["スタイル", "Tailwind CSS", "クラス指定だけで見た目の指示が通り、AIと相性が良い"],
            ["通信", "WebSocket / JSON", "Proto の DTO と同一。Unity も同じエンドポイントに接続する"],
            [
              "契約",
              "Proto パッケージ（版固定）",
              "送受信する型と共有ローマ字データの正典。更新は人間が責任を持って版を上げる",
            ],
            [
              "デプロイ",
              "静的ホスティング",
              "push ごとに自動デプロイ。PRプレビューURLが自動発行されるので「このPRの画面で複数人テストして」が楽",
            ],
          ]}
        />
      </Panel>
    </Layout>
  );
}
