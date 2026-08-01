// 「絶対原則」「破綻を防いだ要」など、本文中でひとつだけ強調したい箱。
import type { ReactNode } from "react";

type Kind = "rule" | "note";

interface Props {
  kind?: Kind;
  label: string;
  children: ReactNode;
}

const KIND_CLASS: Record<Kind, { box: string; label: string }> = {
  // 破ってはいけない原則（本体リポジトリの「絶対原則」に相当）。
  rule: { box: "border-red-300 bg-red-50", label: "text-red-700" },
  // 補足・経緯。
  note: { box: "border-zinc-300 bg-zinc-50", label: "text-zinc-600" },
};

export function Callout({ kind = "note", label, children }: Props) {
  const tone = KIND_CLASS[kind];
  return (
    <div className={`border ${tone.box} px-3 py-2`}>
      <p className={`mb-1 text-[11px] font-black tracking-wide ${tone.label}`}>
        {label}
      </p>
      <div className="text-xs leading-relaxed text-zinc-700">{children}</div>
    </div>
  );
}
