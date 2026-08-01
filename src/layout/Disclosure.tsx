// 折りたたみ（disclosure）パターン。DESIGN_SPEC.md 4章の再現。
// 「読みたい人だけが読む」具体的な数値・テーブル・却下ログをここに格納する。
// 1ページにつき2〜3個までに絞る（多すぎると選択疲れになる、という原文の注記どおり）。
import { useState, type ReactNode } from "react";

interface Props {
  title: string;
  summary: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Disclosure({ title, summary, children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <div
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          padding: "16px 0",
        }}
      >
        <div>
          <p style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 20 }}>
            {title}
          </p>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 13,
              color: "color-mix(in srgb, var(--color-text) 55%, transparent)",
            }}
          >
            {summary}
          </p>
        </div>
        <svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            flexShrink: 0,
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform .15s",
          }}
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>

      {open && (
        <div style={{ padding: "0 0 24px", display: "flex", flexDirection: "column", gap: 36 }}>
          {children}
        </div>
      )}
    </div>
  );
}
