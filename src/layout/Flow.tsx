// 段階を矢印でつなぐだけの図。単位の変換フロー（コンボ→威力→ダケン個数）や、
// レイヤーの依存方向（画面→共通コア→契約）のような「一本道」の説明に使う。
import type { ReactNode } from "react";
import { ACCENTS, type AccentId } from "./accentTheme";

export interface FlowNode {
  title: string;
  /** ノードの下に添える補足（単位・役割など）。 */
  note?: ReactNode;
}

interface Props {
  nodes: FlowNode[];
  /** 矢印に添えるラベル（nodes.length - 1 個）。変換式などを書く。 */
  edgeLabels?: string[];
  accent?: AccentId;
  /** 縦積み（既定）か横並びか。 */
  direction?: "vertical" | "horizontal";
}

export function Flow({
  nodes,
  edgeLabels = [],
  accent = "brand",
  direction = "vertical",
}: Props) {
  const tone = ACCENTS[accent];
  const horizontal = direction === "horizontal";

  return (
    <div
      className={
        horizontal
          ? "flex flex-wrap items-stretch gap-2"
          : "flex flex-col items-stretch gap-1"
      }
    >
      {nodes.map((node, i) => (
        <div
          key={node.title}
          className={horizontal ? "flex items-center gap-2" : ""}
        >
          <div className="flex items-start gap-2 border border-zinc-300 bg-white px-3 py-2">
            <span className={`mt-1 h-3 w-1.5 shrink-0 ${tone.bar}`} aria-hidden />
            <div>
              <p className="text-xs font-bold text-zinc-800">{node.title}</p>
              {node.note != null && (
                <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-500">
                  {node.note}
                </p>
              )}
            </div>
          </div>

          {i < nodes.length - 1 && (
            <div
              className={
                horizontal
                  ? "flex items-center gap-1 text-[11px] text-zinc-500"
                  : "flex items-center gap-2 py-1 pl-3 text-[11px] text-zinc-500"
              }
            >
              <span aria-hidden>{horizontal ? "→" : "↓"}</span>
              {edgeLabels[i] && <span>{edgeLabels[i]}</span>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
