// シーケンス図（SVG）。テキストロ本体のドキュメント（Textro99-Docs / Client-Docs）に
// ある mermaid のシーケンス図を、この説明サイトで見せるための最小実装。
//
// mermaid をランタイムに載せると依存が増える（AGENTS.md 6章：ライブラリを新規導入しない方針）ので、
// 「参加者（縦線）＋矢印＋ノート」だけを描く素朴なSVGジェネレータとして自前で持つ。
import type { AccentId } from "./accentTheme";

// SVG は fill 系のクラスで着色する。Tailwind はソース中の文字列を走査してCSSを生成するため、
// `"bg-" → "fill-"` のような実行時の文字列組み立てでは classが出力されない。
// ここだけはリテラルで持つ（accentTheme.ts と同じ色の SVG 版）。
const SVG_TONE: Record<AccentId, { head: string; label: string }> = {
  brand: { head: "fill-red-50 stroke-zinc-300", label: "fill-red-800" },
  planning: { head: "fill-amber-50 stroke-zinc-300", label: "fill-amber-800" },
  frontend: { head: "fill-sky-50 stroke-zinc-300", label: "fill-sky-800" },
  backend: { head: "fill-emerald-50 stroke-zinc-300", label: "fill-emerald-800" },
};

export interface SequenceStep {
  /** 矢印の始点・終点（participants の index）。self ループは from === to。 */
  from: number;
  to: number;
  label: string;
  /** 破線（応答・非同期通知）にする。 */
  dashed?: boolean;
  /** 矢印ではなく、参加者上の注記として描く（from の位置に置く）。 */
  note?: boolean;
}

interface Props {
  participants: string[];
  steps: SequenceStep[];
  accent?: AccentId;
}

const COL_W = 190;
const HEAD_H = 34;
const ROW_H = 40;
const PAD_X = 12;
const PAD_TOP = 8;

export function Sequence({ participants, steps, accent = "brand" }: Props) {
  const tone = SVG_TONE[accent];
  const width = PAD_X * 2 + COL_W * participants.length;
  const height = PAD_TOP + HEAD_H + ROW_H * steps.length + 18;
  const x = (i: number) => PAD_X + COL_W * i + COL_W / 2;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      className="max-w-none"
      role="img"
    >
      <defs>
        <marker
          id={`seq-arrow-${accent}`}
          viewBox="0 0 8 8"
          refX="7"
          refY="4"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path d="M0,0 L8,4 L0,8 z" className="fill-zinc-500" />
        </marker>
      </defs>

      {/* 参加者ヘッダとライフライン */}
      {participants.map((name, i) => (
        <g key={name}>
          <rect
            x={x(i) - COL_W / 2 + 8}
            y={PAD_TOP}
            width={COL_W - 16}
            height={HEAD_H - 10}
            className={tone.head}
            strokeWidth={1}
          />
          <text
            x={x(i)}
            y={PAD_TOP + (HEAD_H - 10) / 2 + 4}
            textAnchor="middle"
            className={`text-[11px] font-bold ${tone.label}`}
          >
            {name}
          </text>
          <line
            x1={x(i)}
            y1={PAD_TOP + HEAD_H - 8}
            x2={x(i)}
            y2={height - 8}
            className="stroke-zinc-300"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        </g>
      ))}

      {/* メッセージ */}
      {steps.map((s, i) => {
        const y = PAD_TOP + HEAD_H + ROW_H * i + ROW_H / 2;
        const key = `${i}-${s.label}`;

        if (s.note) {
          const w = Math.min(COL_W * 1.6, 8 + s.label.length * 7.2);
          return (
            <g key={key}>
              <rect
                x={x(s.from) - w / 2}
                y={y - 12}
                width={w}
                height={24}
                className="fill-amber-50 stroke-amber-300"
                strokeWidth={1}
              />
              <text
                x={x(s.from)}
                y={y + 4}
                textAnchor="middle"
                className="fill-amber-800 text-[11px]"
              >
                {s.label}
              </text>
            </g>
          );
        }

        if (s.from === s.to) {
          const cx = x(s.from);
          return (
            <g key={key}>
              <path
                d={`M${cx},${y - 10} h26 v20 h-26`}
                className="fill-none stroke-zinc-400"
                strokeWidth={1.2}
                markerEnd={`url(#seq-arrow-${accent})`}
              />
              <text x={cx + 32} y={y + 4} className="fill-zinc-700 text-[11px]">
                {s.label}
              </text>
            </g>
          );
        }

        const x1 = x(s.from);
        const x2 = x(s.to);
        const dir = x2 > x1 ? -1 : 1;
        return (
          <g key={key}>
            <line
              x1={x1}
              y1={y}
              x2={x2 + dir * 6}
              y2={y}
              className="stroke-zinc-400"
              strokeWidth={1.2}
              strokeDasharray={s.dashed ? "5 3" : undefined}
              markerEnd={`url(#seq-arrow-${accent})`}
            />
            <text
              x={(x1 + x2) / 2}
              y={y - 6}
              textAnchor="middle"
              className="fill-zinc-700 text-[11px]"
            >
              {s.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
