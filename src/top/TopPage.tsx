// トップページ。DESIGN_SPEC.md（Modernistデザインシステム）に合わせて再構成。
//
// ⚠ 参照元の Top.dc.html 自体は手元に無いため、DESIGN_SPEC.md 3章の
// 「ページ構成パターン」（nav→hero→赤バナー→コア情報→ハイライトカード→詳細→footer）と
// Planning.dc.html の実装を型として当て、既存トップページの実コンテンツ
// （3カード分岐・チーム紹介）をそこへ流し込んで作った。Top.dc.html の実体が
// 手に入ったら、ここは差し替える前提。
import { useState, type CSSProperties } from "react";
import { Nav } from "../layout/Nav";
import { RemoteNav } from "../layout/RemoteNav";
import type { AccentId } from "../layout/accentTheme";

const CARDS: { id: AccentId; href: string; title: string; desc: string }[] = [
  {
    id: "planning",
    href: "/planning",
    title: "企画/仕様",
    desc: "コンセプト、単位設計で防いだ破綻、却下案まで残す意思決定の記録、実装しながら覆した仕様",
  },
  {
    id: "frontend",
    href: "/frontend",
    title: "フロント",
    desc: "サーバー権威下でクライアントを薄く保つ設計、自作ローマ字オートマトン、Unityミラー前提の契約",
  },
  {
    id: "backend",
    href: "/backend",
    title: "バックエンド",
    desc: "99人同時対戦を支えるサーバー(Go)のアーキテクチャ",
  },
];

const TEAM = {
  name: "おかしまち",
  icon: "/team/Okashimachi-Icon.png",
  github: "https://github.com/Okashimachi",
};

const MEMBERS = [
  {
    name: "カシュー",
    icon: "/team/Cashew-Icon.jpg",
    role: "リーダー / 企画・仕様・フロントエンド",
    x: "https://x.com/game_game_nuts",
    github: "https://github.com/kdix-23-240",
  },
  {
    name: "りーせ",
    icon: "/team/ri-se-Icon.jpg",
    role: "バックエンド",
    x: "https://x.com/ri_se_yu",
    github: "https://github.com/ru-se",
  },
  {
    name: "たまちゃ",
    icon: "/team/tamatya-Icon.jpg",
    role: "トップシークレット",
    x: "https://x.com/tamtya_joho",
    github: "https://github.com/tamtya",
  },
];

export function TopPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", color: "var(--color-text)" }}>
      <Nav />

      {/* ── HERO ── */}
      <header style={{ maxWidth: 800, margin: "0 auto", padding: "56px 24px 32px", textAlign: "center" }}>
        <img
          src="/TEXTRO99-Icon-Sub.png"
          alt=""
          style={{ width: 88, height: 88, objectFit: "cover", margin: "0 auto 24px" }}
        />
        <span
          style={{
            display: "block",
            fontSize: 12,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: "var(--color-accent-700)",
            fontWeight: 800,
            marginBottom: 14,
          }}
        >
          開発者向け解説サイト
        </span>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            fontSize: "clamp(32px,5.6vw,52px)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            margin: "0 0 16px",
          }}
        >
          テキストロ99
        </h1>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.7,
            maxWidth: "56ch",
            margin: "0 auto 20px",
            color: "color-mix(in srgb, var(--color-text) 78%, transparent)",
          }}
        >
          99人バトルロイヤル型タイピングゲーム「テキストロ99」を、企画・フロント・サーバーの3つの観点から紹介します。開発チーム「おかしまち」制作。
        </p>
      </header>

      <section style={{ background: "var(--color-accent)", color: "var(--color-bg)", padding: "40px 24px" }}>
        <p
          style={{
            maxWidth: 800,
            margin: "0 auto",
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            fontSize: "clamp(22px,3.2vw,34px)",
            lineHeight: 1.4,
          }}
        >
          寿司打のタイピングに、テトリス99の99人対戦と
          <br />
          ぷよぷよ通の攻防を掛け合わせた——それがテキストロ99。
        </p>
      </section>

      <hr className="hr" style={{ maxWidth: 960, margin: "0 auto" }} />

      {/* ── 3つの観点 ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: "color-mix(in srgb, var(--color-text) 55%, transparent)",
            fontWeight: 800,
            marginBottom: 6,
          }}
        >
          <i style={{ width: 10, height: 10, background: "var(--color-accent)", display: "inline-block", flexShrink: 0 }} />
          3つの観点から読む
        </span>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: "color-mix(in srgb, var(--color-text) 55%, transparent)" }}>
          「何をしたか」より「なぜそうしたか」を中心に書いてあります
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
          {CARDS.map((card) => (
            <a
              key={card.id}
              href={card.href}
              className="card card-link"
              style={{
                boxShadow: "var(--shadow-sm)",
                border: "1px solid var(--color-divider)",
                padding: 20,
                gap: 10,
                color: "var(--color-text)",
              }}
            >
              <span className="card-title card-link-title" style={{ fontSize: 19 }}>
                {card.title}
              </span>
              <p className="card-body" style={{ fontSize: 13.5 }}>
                {card.desc}
              </p>
            </a>
          ))}
        </div>
      </section>

      <hr className="hr" style={{ maxWidth: 960, margin: "0 auto" }} />

      {/* ── 開発チーム ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: "color-mix(in srgb, var(--color-text) 55%, transparent)",
            fontWeight: 800,
            marginBottom: 20,
          }}
        >
          <i style={{ width: 10, height: 10, background: "var(--color-accent)", display: "inline-block", flexShrink: 0 }} />
          開発チーム「おかしまち」
        </span>

        {/* チーム自体の紹介カード。メンバーカードより大きく、GitHubへの導線を明確にする（DESIGN_SPEC.md 6章）。 */}
        <a
          href={TEAM.github}
          target="_blank"
          rel="noreferrer"
          className="card"
          style={{
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--color-divider)",
            padding: 24,
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            color: "var(--color-text)",
            marginBottom: 16,
          }}
        >
          <TeamImage src={TEAM.icon} alt={`${TEAM.name}のアイコン`} size={84} />
          <div style={{ minWidth: 0 }}>
            <span className="card-kicker" style={{ fontSize: 11 }}>
              開発チーム
            </span>
            <p className="card-title" style={{ fontSize: 24, margin: "4px 0 10px" }}>
              {TEAM.name}
            </p>
            <span
              className="tag tag-outline"
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.21-3.37-1.21-.46-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 2.5-.35c.85 0 1.71.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.95.68 1.92 0 1.39-.01 2.51-.01 2.85 0 .28.18.61.69.5C19.14 20.61 22 16.78 22 12.25 22 6.58 17.52 2 12 2Z" />
              </svg>
              GitHub
            </span>
          </div>
        </a>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
          {MEMBERS.map((m) => (
            <div
              key={m.name}
              className="card"
              style={{
                boxShadow: "var(--shadow-sm)",
                border: "1px solid var(--color-divider)",
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
              }}
            >
              <TeamImage src={m.icon} alt={`${m.name}のアイコン`} size={56} />
              <div style={{ minWidth: 0 }}>
                <p className="card-title" style={{ fontSize: 16, margin: 0 }}>
                  {m.name}
                </p>
                <p style={{ margin: "2px 0 8px", fontSize: 12.5, color: "color-mix(in srgb, var(--color-text) 60%, transparent)" }}>
                  {m.role}
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <a href={m.x} target="_blank" rel="noreferrer" className="tag tag-outline" style={{ padding: "4px 10px", fontSize: 11 }}>
                    X
                  </a>
                  <a href={m.github} target="_blank" rel="noreferrer" className="tag tag-outline" style={{ padding: "4px 10px", fontSize: 11 }}>
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "24px 24px 48px",
          borderTop: "2px solid var(--color-divider)",
          fontSize: 12,
          color: "color-mix(in srgb, var(--color-text) 55%, transparent)",
        }}
      >
        © おかしまち — TEXTRO99
      </footer>

      <RemoteNav current="brand" />
    </div>
  );
}

// アイコン画像。差し替え前や取得失敗時に壊れた画像アイコンが出ないよう、
// 読み込めなかった場合は無地のプレースホルダに落とす。
function TeamImage({ src, alt, size }: { src: string; alt: string; size: number }) {
  const [failed, setFailed] = useState(false);
  const box: CSSProperties = { width: size, height: size, flexShrink: 0, objectFit: "cover" };

  if (failed) {
    return <span style={{ ...box, background: "var(--color-surface)" }} aria-hidden />;
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      style={{ ...box, border: "1px solid var(--color-divider)" }}
    />
  );
}
