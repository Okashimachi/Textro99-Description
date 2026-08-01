// 図表の共通ガワ。横に広い図（シーケンス図・表）を、狭い画面では
// 横スクロールに逃がして本文カラムを崩さないためのラッパ。
import type { ReactNode } from "react";

interface Props {
  /** 図の下に出す説明文（出典・読み方）。 */
  caption?: ReactNode;
  children: ReactNode;
}

export function Figure({ caption, children }: Props) {
  return (
    <figure className="my-3 first:mt-0 last:mb-0">
      <div className="overflow-x-auto border border-zinc-200 bg-zinc-50 p-3">
        {children}
      </div>
      {caption != null && (
        <figcaption className="mt-1.5 text-[11px] leading-relaxed text-zinc-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
