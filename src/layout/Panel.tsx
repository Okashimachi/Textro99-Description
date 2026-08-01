// Panel — 白面＋ヘッダ帯の汎用カード。
// テキストロ本体（Textro99-WebFront）の hud/Panel.tsx と同じ見た目パターン
// （左に色チップ、その右にラベル）を、ゲームHUD専用のトーン意味に縛られず
// 任意のアクセントカラーで使えるよう作り直したもの。コードはコピー元をimportしない。
import type { ReactNode } from "react";
import { ACCENTS, type AccentId } from "./accentTheme";

interface Props {
  label: ReactNode;
  right?: ReactNode;
  accent?: AccentId;
  bodyClassName?: string;
  className?: string;
  children: ReactNode;
}

export function Panel({
  label,
  right,
  accent = "brand",
  bodyClassName = "p-4",
  className = "",
  children,
}: Props) {
  const tone = ACCENTS[accent];
  return (
    <section className={`flex flex-col border border-zinc-300 bg-white ${className}`}>
      <header
        className={`flex items-center gap-2 border-b border-zinc-300 px-3 py-1.5 ${tone.head}`}
      >
        <span className={`h-3 w-1.5 shrink-0 ${tone.bar}`} aria-hidden />
        <h2 className={`min-w-0 flex-1 truncate text-xs font-bold tracking-wide ${tone.label}`}>
          {label}
        </h2>
        {right != null && (
          <span className="shrink-0 text-[11px] text-zinc-500">{right}</span>
        )}
      </header>
      <div className={`min-h-0 flex-1 ${bodyClassName}`}>{children}</div>
    </section>
  );
}
