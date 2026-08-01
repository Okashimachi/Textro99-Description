// 仕様書からそのまま持ってきた表を出すための素朴なテーブル。
// 元ドキュメント（Textro99-Docs / Client-Docs）が表を多用しているので、
// 見出し＋行データを渡すだけで同じ体裁になるようにしてある。
import type { ReactNode } from "react";

interface Props {
  head: ReactNode[];
  rows: ReactNode[][];
  /** 列ごとの追加クラス（幅の指定など）。 */
  colClassName?: string[];
}

export function Table({ head, rows, colClassName = [] }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[28rem] border-collapse text-xs">
        <thead>
          <tr className="bg-zinc-100 text-left">
            {head.map((h, i) => (
              <th
                key={i}
                className={`border border-zinc-300 px-2 py-1.5 font-bold text-zinc-700 ${
                  colClassName[i] ?? ""
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="align-top">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`border border-zinc-300 px-2 py-1.5 leading-relaxed text-zinc-700 ${
                    colClassName[ci] ?? ""
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
