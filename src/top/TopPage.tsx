// トップページ。3カードで企画/仕様・フロント・バックエンドへ分岐する。
// メインのゲーム本体（TEXTRO99-Icon）とは別に、この説明サイトでは
// サブアイコン（TEXTRO99-Icon-Sub）をシンボルとして使う。
import { ACCENTS, type AccentId } from "../layout/accentTheme";

const PLAY_URL = "/";

const CARDS: { id: AccentId; href: string; desc: string }[] = [
  {
    id: "planning",
    href: "/planning",
    desc: "コンセプト・数値設計・意思決定の記録など、企画/仕様面で意識したこと",
  },
  {
    id: "frontend",
    href: "/frontend",
    desc: "サーバー権威を前提にしたクライアント設計・開発体験まわりの工夫",
  },
  {
    id: "backend",
    href: "/backend",
    desc: "99人同時対戦を支えるサーバー(Go)のアーキテクチャ",
  },
];

const MEMBERS = [
  { name: "カシュー", x: "https://x.com/game_game_nuts" },
  { name: "りーせ", x: "https://x.com/ri_se_yu" },
  { name: "たまちゃ", x: "https://x.com/tamtya_joho" },
];

export function TopPage() {
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <main className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-4 py-16 text-center">
        <img src="/TEXTRO99-Icon-Sub.png" alt="" className="h-24 w-24 rounded-2xl shadow" />

        <div>
          <h1 className="text-4xl font-black tracking-wide text-red-600">テキストロ99</h1>
          <p className="mt-2 text-sm text-zinc-500">開発者向け解説サイト</p>
          <p className="mx-auto mt-4 max-w-md text-sm text-zinc-600">
            99人バトルロイヤル型タイピングゲーム「テキストロ99」を、企画・フロント・サーバーの3つの観点から紹介します。開発チーム「おかしまち」制作。
          </p>
        </div>

        <div className="grid w-full gap-3 text-left">
          {CARDS.map((card) => {
            const tone = ACCENTS[card.id];
            return (
              <a
                key={card.id}
                href={card.href}
                className="flex items-start gap-3 border border-zinc-300 bg-white px-4 py-3 hover:border-zinc-400 hover:bg-zinc-50"
              >
                <span className={`mt-1 h-3 w-1.5 shrink-0 ${tone.bar}`} aria-hidden />
                <div>
                  <p className={`text-sm font-black ${tone.text}`}>{tone.name}</p>
                  <p className="mt-0.5 text-xs text-zinc-600">{card.desc}</p>
                </div>
              </a>
            );
          })}
        </div>

        <a
          href={PLAY_URL}
          className="w-full border border-red-600 bg-red-600 px-4 py-3 text-center text-sm font-black text-white hover:bg-red-700"
        >
          遊んでみる
        </a>

        <section className="w-full border-t border-zinc-300 pt-6">
          <p className="mb-3 text-xs font-bold text-zinc-500">開発チーム「おかしまち」</p>
          <ul className="flex flex-wrap justify-center gap-4 text-sm">
            {MEMBERS.map((m) => (
              <li key={m.name}>
                <a
                  href={m.x}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-zinc-700 underline decoration-zinc-300 underline-offset-2 hover:text-red-600"
                >
                  {m.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
