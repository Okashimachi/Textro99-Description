// 詳細セクション（Disclosure内）で使い回す本文まわりのインラインスタイル。
// Modernist版の各ページ（Planning/Frontend）で見出し・本文の体裁を揃えるための共通定義。
import type { CSSProperties } from "react";

export const sectionSubheading: CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontWeight: 800,
  fontSize: 16,
  margin: "0 0 8px",
};

export const sectionBody: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.7,
  color: "color-mix(in srgb, var(--color-text) 78%, transparent)",
  margin: "0 0 12px",
};

/** 表がモバイル幅でページ全体を横に押し広げないよう、必ずこれで包む。 */
export const tableScroll: CSSProperties = { overflowX: "auto" };
