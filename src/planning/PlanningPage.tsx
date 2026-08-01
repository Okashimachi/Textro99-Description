import { Layout } from "../layout/Layout";
import { Panel } from "../layout/Panel";

export function PlanningPage() {
  return (
    <Layout
      accent="planning"
      title="企画/仕様"
      description="寿司打 × テトリス99 × ぷよぷよ通。3つの実証済みシステムを組み合わせた設計思想。"
      repos={[
        { label: "Textro99-Docs", href: "https://github.com/Okashimachi/Textro99-Docs" },
        {
          label: "Textro99-Client-Docs",
          href: "https://github.com/Okashimachi/Textro99-Client-Docs",
        },
      ]}
    >
      <Panel accent="planning" label="コンセプト">
        <p className="text-sm leading-relaxed text-zinc-700">
          寿司打のタイピングをそのままに、テトリス99の99人対戦・ぷよぷよ通の予告→相殺という「攻防」を薄く重ねる。「速く打ちたい、でもミスしたくない」というタイピングの根源的なジレンマを、そのまま攻撃力と生存に直結させた。
        </p>
      </Panel>

      <Panel accent="planning" label="数値設計で意識したこと">
        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-700">
          <li>コンボはミスで全消しにせず「一部減衰」。積み上げの理不尽な喪失を避ける</li>
          <li>正確性ボーナスに上限を設けない（青天井）。正確に打つ価値を薄めない</li>
          <li>時間経過で全体難易度が上がる仕組みで、逃げ切り戦略を防止する</li>
          <li>攻撃も防御（相殺）も「正確に打つ」同一行為に帰着させ、磨くスキルを一貫させる</li>
        </ul>
      </Panel>

      <Panel accent="planning" label="意思決定を記録する運用">
        <p className="text-sm leading-relaxed text-zinc-700">
          仕様判断に迷ったときに立ち返れるよう、「却下した代替案とその理由」までドキュメントに残している。数値は実測前提の仮決定として明示し、確定と仮決定を区別して扱った。
        </p>
      </Panel>
    </Layout>
  );
}
