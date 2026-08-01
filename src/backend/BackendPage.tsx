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
      <Panel accent="backend" label="TODO: サーバーマネージャーが記入">
        <p className="text-sm leading-relaxed text-zinc-700">
          このページの内容はサーバー担当が作成します。層アーキ（コアgameの純関数化・DIPによる部品注入）、GameParametersの外部化、99人分の状態配信の間引き対策など、頑張った点・意識した点をここに追記してください。
        </p>
      </Panel>
    </Layout>
  );
}
