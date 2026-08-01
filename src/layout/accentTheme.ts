// ページ別のアクセントカラー定義。
// テキストロ本体（Textro99-WebFront）の Tailwind標準パレット限定方針を踏襲し、
// zinc/red/amber/emerald/sky 以外のトークンは追加しない。
export type AccentId = "brand" | "planning" | "frontend" | "backend";

interface AccentTone {
  /** ページタイトルやカードの見出し文字色。 */
  text: string;
  /** Panel の左端チップ・強調バー。 */
  bar: string;
  /** Panel ヘッダーの背景。 */
  head: string;
  /** ヘッダーラベル文字色。 */
  label: string;
  /** ボタン等の塗り背景。 */
  solidBg: string;
  solidBgHover: string;
  /** 枠線。 */
  border: string;
  /** 表示名（ナビ等に出す短いラベル）。 */
  name: string;
}

export const ACCENTS: Record<AccentId, AccentTone> = {
  brand: {
    text: "text-red-600",
    bar: "bg-red-600",
    head: "bg-red-50",
    label: "text-red-800",
    solidBg: "bg-red-600",
    solidBgHover: "hover:bg-red-700",
    border: "border-red-600",
    name: "トップ",
  },
  planning: {
    text: "text-amber-600",
    bar: "bg-amber-400",
    head: "bg-amber-50",
    label: "text-amber-800",
    solidBg: "bg-amber-500",
    solidBgHover: "hover:bg-amber-600",
    border: "border-amber-500",
    name: "企画/仕様",
  },
  frontend: {
    text: "text-sky-600",
    bar: "bg-sky-500",
    head: "bg-sky-50",
    label: "text-sky-800",
    solidBg: "bg-sky-500",
    solidBgHover: "hover:bg-sky-600",
    border: "border-sky-500",
    name: "フロント",
  },
  backend: {
    text: "text-emerald-600",
    bar: "bg-emerald-500",
    head: "bg-emerald-50",
    label: "text-emerald-800",
    solidBg: "bg-emerald-500",
    solidBgHover: "hover:bg-emerald-600",
    border: "border-emerald-500",
    name: "バックエンド",
  },
};
