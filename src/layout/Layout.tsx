// 3詳細ページ（企画/仕様・フロント・バックエンド）共通のテンプレート。
// ヘッダーに相互ナビと「遊んでみる」CTA、フッターに参照リポジトリを置く。
// ページごとの差分は accent（アクセントカラー）と children（本文）だけ。
import type { ReactNode } from "react";
import { ACCENTS, type AccentId } from "./accentTheme";

// 本体ゲーム（Textro99-WebFront）へのリンク。最終的な公開URLはインフラ側の決定待ちのため、
// 同一オリジン配下に説明サイトが置かれる前提で相対パスにしている（AGENTS.md 3章）。
const PLAY_URL = "/";

interface RepoLink {
  label: string;
  href: string;
}

interface Props {
  accent: AccentId;
  title: string;
  description: string;
  repos: RepoLink[];
  children: ReactNode;
}

const NAV_ITEMS: { id: AccentId; href: string }[] = [
  { id: "planning", href: "/planning" },
  { id: "frontend", href: "/frontend" },
  { id: "backend", href: "/backend" },
];

export function Layout({ accent, title, description, repos, children }: Props) {
  const tone = ACCENTS[accent];

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <header className="border-b border-zinc-300 bg-white">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <a href="/" className="flex items-center gap-2">
            <img src="/TEXTRO99-Icon-Sub.png" alt="" className="h-7 w-7 rounded" />
            <span className="text-sm font-black tracking-wide text-red-600">テキストロ99</span>
            <span className="text-xs text-zinc-400">開発者向け解説</span>
          </a>
          <nav className="flex flex-wrap items-center gap-1 text-xs font-bold">
            {NAV_ITEMS.map((item) => {
              const itemTone = ACCENTS[item.id];
              const active = item.id === accent;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`border px-2 py-1 ${
                    active
                      ? `${itemTone.border} ${itemTone.head} ${itemTone.label}`
                      : "border-transparent text-zinc-500 hover:border-zinc-300"
                  }`}
                >
                  {itemTone.name}
                </a>
              );
            })}
            <a
              href={PLAY_URL}
              className="ml-2 border border-red-600 bg-red-600 px-3 py-1 text-white hover:bg-red-700"
            >
              遊んでみる
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-6 flex items-start gap-3">
          <span className={`mt-1 h-8 w-1.5 shrink-0 ${tone.bar}`} aria-hidden />
          <div>
            <h1 className={`text-2xl font-black tracking-wide ${tone.text}`}>{title}</h1>
            <p className="mt-1 text-sm text-zinc-600">{description}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">{children}</div>

        {repos.length > 0 && (
          <footer className="mt-10 border-t border-zinc-300 pt-4 text-xs text-zinc-500">
            <p className="mb-2 font-bold text-zinc-600">関連リポジトリ</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {repos.map((repo) => (
                <li key={repo.href}>
                  <a
                    href={repo.href}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-zinc-300 underline-offset-2 hover:text-zinc-800"
                  >
                    {repo.label}
                  </a>
                </li>
              ))}
            </ul>
          </footer>
        )}
      </main>
    </div>
  );
}
