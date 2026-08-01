import { Layout } from "../layout/Layout";
import { Panel } from "../layout/Panel";

export function FrontendPage() {
  return (
    <Layout
      accent="frontend"
      title="フロント"
      description="サーバー権威を前提に、クライアントの責務を「打鍵判定とサーバーとの送受信」だけに絞った設計。"
      repos={[
        { label: "Textro99-WebFront", href: "https://github.com/Okashimachi/Textro99-WebFront" },
        {
          label: "Textro99-Client-Docs",
          href: "https://github.com/Okashimachi/Textro99-Client-Docs",
        },
      ]}
    >
      <Panel accent="frontend" label="クライアントの責務境界">
        <p className="text-sm leading-relaxed text-zinc-700">
          クライアントが自前で行う処理は打鍵判定（ローカル）だけ。コンボ・威力・相殺・KOなどの計算は一切持たず、サーバーが配信する state を描画するだけに徹した。この境界は最優先の不変条件として扱っている。
        </p>
      </Panel>

      <Panel accent="frontend" label="Web先行 → Unity流用を見据えた設計">
        <p className="text-sm leading-relaxed text-zinc-700">
          本番クライアントはUnityだが、まずWebで「遊べて・複数人でテストできる状態」を最速で作る方針を取った。接続・メッセージ送受信・ディスパッチの層を薄くcontract駆動に保ち、Unity側が同じ構造でミラーできる参照実装を兼ねている。
        </p>
      </Panel>

      <Panel accent="frontend" label="開発体験の工夫">
        <p className="text-sm leading-relaxed text-zinc-700">
          受信した生のstateをそのまま表示する RawStateDebugPane を最初に作り、「サーバーのバグか表示のバグか」を即座に切り分けられるようにした。状態管理は useState/useReducer のみで、状態の実体は常にサーバー側という前提を崩さない。
        </p>
      </Panel>
    </Layout>
  );
}
