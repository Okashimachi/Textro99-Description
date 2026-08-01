// このファイルはサーバーマネージャーの担当領域。
// 依存ルール（../AGENTS.md 4章）により、他の画面ディレクトリ（top/ planning/ frontend/）は
// import しない。編集は基本的にこのファイル（と必要なら backend/ 配下の追加ファイル）だけで完結する。
import { Layout } from "../layout/Layout";
import { Panel } from "../layout/Panel";

export function BackendPage() {
  return (
    <Layout
      accent="backend"
      title="バックエンド"
      description="99人同時対戦の戦闘ロジックを確定させるGoサーバー。"
      repos={[{ label: "Textro99-Server", href: "https://github.com/Okashimachi/Textro99-Server" }]}
    >
      <Panel accent="backend" label="戦闘の権威はサーバー（クライアントの責務剥奪）">
        <p className="text-sm leading-relaxed text-zinc-700">
          打鍵の正誤判定（TypingJudge）はクライアントに委ねる一方で、コンボ・威力・相殺・脱落・難易度といった「ゲーム進行と対戦の真実」はすべてサーバー側で確定させる設計を徹底しています。<br />
          サーバーはクライアントから <code>DakenClearReport</code>（判定済みの結果）を受け取りますが、<code>dakenId</code> や経過時間の整合性検証のみを行い、チート防止とクライアントの軽量化（計算負荷のオフロード）を両立させています。
        </p>
      </Panel>

      <Panel accent="backend" label="コアを侵食から守る「層アーキテクチャ」">
        <p className="text-sm leading-relaxed text-zinc-700">
          「変わらないもの（コア）を、変わるもの（部品）から守る」ことを目的に、厳格な層（レイヤー）アーキテクチャを採用しました。<br />
          中心となる <code>game</code> パッケージ（層1）は、Tick(dt)駆動の純粋なロジックとして分離され、時計もネットワーク通信も持ちません。部品（層3）からの依存は常に「部品→コア」の一方向であり、<code>depguard</code>（Linter）を用いてCIレベルで依存の逆流を機械的に弾く運用により、コアロジックの不可侵性を保証しています。
        </p>
      </Panel>

      <Panel accent="backend" label="柔軟なターゲティング戦略（TargetingStrategy）">
        <p className="text-sm leading-relaxed text-zinc-700">
          「誰を撃つか（ターゲット選択）」と「どれだけダメージを与えるか（威力計算）」の責務を明確に分離しました。<br />
          「直近の着弾者を狙う」「自分に予告中の相手を狙う」といった作戦（0〜9）は、<code>TargetingStrategy</code> インターフェースを通じてコアに注入（DIP）されます。これにより、新しい作戦を追加する際もコアロジックを一切書き換えることなく、ファイルを追加するだけで拡張できる Open/Closed な構造を実現しています。
        </p>
      </Panel>

      <Panel accent="backend" label="99人同期を支えるスパイン（Spine）と間引き配信">
        <p className="text-sm leading-relaxed text-zinc-700">
          ネットワークとコアを繋ぐスパイン層（<code>room</code> / <code>transport</code>）では、1部屋＝1Goroutine＋1Channel の設計で競合を排除しつつTickループを駆動しています。<br />
          99人分の状態（<code>PlayerListUpdated</code>）を毎フレーム全員へフル配信すると通信帯域が <code>O(99×99)</code> となり破綻するため、StatePublisher による「送信頻度の制御」「差分送信」「対象の絞り込み（自分＋周辺＋上下のみ）」などを組み合わせた間引き配信を行い、リアルタイム性と負荷のバランスを極限まで調整しています。
        </p>
      </Panel>

      <Panel accent="backend" label="ヘッドレスシミュレーションとBot負荷テスト">
        <p className="text-sm leading-relaxed text-zinc-700">
          通信や時間を切り離して純関数化されたコアの恩恵により、ネットワークなしで1試合を数秒で完了させる「ヘッドレスシミュレーション」が可能となり、高速なバランス調整を実現しています。<br />
          また、本番用のWebSocketだけでなく、Bot専用の <code>InMemory Connection</code> を用いることで、実クライアントの完成を待たずに「Botを99体接続した状態での配信負荷検証」をサーバー単体で完結できるテスト環境を整備しました。
        </p>
      </Panel>
    </Layout>
  );
}
