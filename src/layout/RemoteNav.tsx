// RemoteNav — 全ページ共通の右下フローティングナビ（DESIGN_SPEC.md 5章 / RemoteNav.dc.html の移植）。
//
// Modernist はページ内ヘッダーにページ間リンクを置かない方針（ヘッダーはロゴのみ）。
// 画面遷移・「遊んでみる」導線はすべてこのリモコンに集約する。
// 見た目だけ Modernist のフラット原則から意図的に外れた例外（角丸22px・赤枠・影）。
//
// 元の DC 実装は style-hover というテンプレート機能でホバー色を切り替えていたが、
// 素の React にはその仕組みが無いので onMouseEnter/Leave の state で同等の見た目を再現している。
// current の型は AccentId をそのまま使う（"brand" = トップ）。既存の Layout.tsx / TopPage.tsx との
// 結線を変えずに済むよう、DC 側の "top" ではなくこちらの語彙に合わせてある。
import { useState, type CSSProperties, type ReactElement } from "react";
import type { AccentId } from "./accentTheme";

interface NavItem {
  id: AccentId;
  href: string;
  label: string;
  hint: string;
  icon: ReactElement;
  /** Modernist デザインへ移行済みのページだけ有効にする（DESIGN_SPEC.md 5章）。 */
  enabled: boolean;
}

const ICON_PROPS = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ITEMS: NavItem[] = [
  {
    id: "brand",
    href: "/",
    label: "トップ",
    hint: "サイトの入口",
    enabled: true,
    icon: (
      <svg {...ICON_PROPS} style={{ flexShrink: 0 }}>
        <path d="M3 9.5 12 3l9 6.5" />
        <path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" />
      </svg>
    ),
  },
  {
    id: "planning",
    href: "/planning",
    label: "企画/仕様",
    hint: "なぜ作ったか",
    enabled: true,
    icon: (
      <svg {...ICON_PROPS} style={{ flexShrink: 0 }}>
        <rect x="7" y="3" width="10" height="4" rx="1" />
        <path d="M9 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
        <path d="M9 12h6" />
        <path d="M9 16h6" />
      </svg>
    ),
  },
  {
    id: "frontend",
    href: "/frontend",
    label: "フロント",
    hint: "薄いクライアント設計",
    enabled: true,
    icon: (
      <svg {...ICON_PROPS} style={{ flexShrink: 0 }}>
        <rect x="2" y="4" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </svg>
    ),
  },
  {
    id: "backend",
    href: "/backend",
    label: "バックエンド",
    hint: "準備中",
    enabled: false,
    icon: (
      <svg {...ICON_PROPS} style={{ flexShrink: 0 }}>
        <rect x="2" y="3" width="20" height="8" rx="2" />
        <rect x="2" y="13" width="20" height="8" rx="2" />
        <path d="M6 7h.01" />
        <path d="M6 17h.01" />
      </svg>
    ),
  },
];

const PLAY_URL = "https://textro99-web-front.vercel.app/";

const ITEM_BASE: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "9px 10px",
  borderRadius: 14,
  color: "color-mix(in srgb, var(--color-text) 75%, transparent)",
  textDecoration: "none",
  transition: "background .15s, color .15s",
  cursor: "pointer",
};

const ITEM_ACTIVE: CSSProperties = {
  background: "var(--color-accent)",
  color: "var(--color-bg)",
};

const ITEM_DISABLED: CSSProperties = {
  opacity: 0.35,
  pointerEvents: "none",
};

const ITEM_HOVER_BG = "var(--color-accent-100)";

interface Props {
  current: AccentId;
}

export function RemoteNav({ current }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [hoveredId, setHoveredId] = useState<AccentId | "play" | null>(null);

  if (!expanded) {
    return (
      <div
        onClick={() => setExpanded(true)}
        title="リモコンを開く"
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          zIndex: 50,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "var(--color-bg)",
          border: "2px solid var(--color-accent)",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "var(--color-accent)",
        }}
      >
        <svg
          width={26}
          height={26}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="6" width="20" height="12" rx="6" />
          <path d="M6 12h4" />
          <path d="M8 10v4" />
          <circle cx="15" cy="13" r="1" />
          <circle cx="18" cy="11" r="1" />
        </svg>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        background: "var(--color-bg)",
        padding: 14,
        borderRadius: 22,
        border: "2px solid var(--color-accent)",
        boxShadow: "var(--shadow-lg)",
        width: 216,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 4px 2px",
        }}
      >
        <span
          style={{
            fontSize: 10,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            color: "var(--color-accent-700)",
            fontWeight: 800,
          }}
        >
          画面を移動
        </span>
        <span
          onClick={() => setExpanded(false)}
          title="しまう"
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--color-accent-700)",
          }}
        >
          <svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </span>
      </div>

      {ITEMS.map((item) => {
        const isActive = item.id === current;
        const isHovered = hoveredId === item.id && !isActive && item.enabled;
        const style: CSSProperties = {
          ...ITEM_BASE,
          ...(isActive ? ITEM_ACTIVE : null),
          ...(isHovered ? { background: ITEM_HOVER_BG } : null),
          ...(!item.enabled ? ITEM_DISABLED : null),
        };
        return (
          <a
            key={item.id}
            href={item.enabled ? item.href : "#"}
            title={item.enabled ? item.label : `${item.label}（準備中）`}
            style={style}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {item.icon}
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 13 }}>
                {item.label}
              </span>
              <span style={{ fontSize: 10.5, opacity: 0.65 }}>{item.hint}</span>
            </span>
          </a>
        );
      })}

      <a
        href={PLAY_URL}
        target="_blank"
        rel="noreferrer"
        title="遊んでみる"
        onMouseEnter={() => setHoveredId("play")}
        onMouseLeave={() => setHoveredId(null)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 12px",
          borderRadius: 16,
          background: hoveredId === "play" ? "var(--color-accent-600)" : "var(--color-accent)",
          color: "var(--color-bg)",
          textDecoration: "none",
          cursor: "pointer",
          marginTop: 2,
        }}
      >
        <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ flexShrink: 0 }}>
          <path d="M6 3l14 9-14 9V3z" />
        </svg>
        <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 16 }}>
            遊んでみる
          </span>
          <span style={{ fontSize: 11, opacity: 0.9 }}>TEXTRO99をプレイ</span>
        </span>
      </a>
    </div>
  );
}
