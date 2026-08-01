// 3詳細ページ（企画/仕様・フロント・バックエンド）共通のテンプレート。
// 相互ナビと「遊んでみる」CTAはヘッダーではなく RemoteNav（右下固定のリモコン）が持つ。
// ページごとの差分は accent（アクセントカラー）と children（本文）だけ。
import type { ReactNode } from "react";
import { ACCENTS, type AccentId } from "./accentTheme";
import { RemoteNav } from "./RemoteNav";

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

export function Layout({ accent, title, description, repos, children }: Props) {
  const tone = ACCENTS[accent];

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <header className="border-b border-zinc-300 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-4 py-3">
          <a href="/" className="flex items-center gap-2">
            <img src="/TEXTRO99-Icon-Sub.png" alt="" className="h-7 w-7 rounded" />
            <span className="text-sm font-black tracking-wide text-red-600">テキストロ99</span>
            <span className="text-xs text-zinc-400">開発者向け解説</span>
          </a>
          <a
            href="https://textro99-web-front.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 border border-red-600 bg-red-600 px-3 py-1.5 text-xs font-black text-white hover:bg-red-700"
          >
            遊んでみる
          </a>
        </div>
      </header>

      <RemoteNav current={accent} />

      <main className="mx-auto max-w-4xl px-4 pb-32 pt-6">
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
