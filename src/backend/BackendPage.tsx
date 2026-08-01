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
      <Panel accent="backend" label="戦闘の権威と責務の分離">
        <p className="text-sm leading-relaxed text-zinc-700">
          打鍵の正誤判定はクライアントに委ねつつ、コンボ・威力・相殺・脱落・ターゲティングといった「戦闘の権威」はすべてサーバー側で確定させる設計を採用。これにより、チート防止とクライアントの軽量化を両立しています。
        </p>
      </Panel>

      <Panel accent="backend" label="純関数コアと層アーキテクチャ">
        <p className="text-sm leading-relaxed text-zinc-700">
          コアとなるゲームロジックは、Tick(dt)駆動の純関数として分離。通信や外部設定などの依存をDIP（依存性逆転原則）によって注入する層アーキテクチャを採用しました。これにより、ネットワークなしでの高速なヘッドレスシミュレーションが可能になっています。
        </p>
      </Panel>

      <Panel accent="backend" label="99人対戦を支える負荷対策">
        <p className="text-sm leading-relaxed text-zinc-700">
          99人分の状態を単純に全員へ毎フレーム配信すると帯域が破綻するため、状態配信の間引き（PlayerListUpdated）を実装しています。送信頻度の制御や差分送信などを組み合わせ、リアルタイム性と負荷のバランスを調整しています。
        </p>
      </Panel>

      <Panel accent="backend" label="パラメータの外部化と自動テスト">
        <p className="text-sm leading-relaxed text-zinc-700">
          ゲームバランスに関わる調整値はハードコードせず、外部の <code>GameParameters</code> から起動時に注入する運用を徹底。また、Botを用いた自動入力の負荷テスト環境も整備し、実クライアント完成前でも99人接続の検証を可能にしています。
        </p>
      </Panel>
    </Layout>
  );
}
