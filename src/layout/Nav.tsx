// 全ページ共通のヘッダー（Modernist版）。
// DESIGN_SPEC.md は「nav はロゴのみ、CTAは右下の RemoteNav に集約する」方針だったが、
// 「遊んでみる」への導線がリモコンを開かないと出てこず気づきにくいという指摘を受けて、
// ヘッダー右上にも常設の遷移ボタンを追加した（RemoteNav 側の導線とは独立に両方残す）。
const PLAY_URL = "https://textro99-web-front.vercel.app/";

export function Nav() {
  return (
    <nav className="nav" style={{ justifyContent: "space-between" }}>
      <a
        href="/"
        className="nav-brand"
        style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--color-text)" }}
      >
        <img src="/TEXTRO99-Icon-Sub.png" alt="" style={{ width: 26, height: 26, objectFit: "cover" }} />
        TEXTRO99
      </a>

      <a
        href={PLAY_URL}
        target="_blank"
        rel="noreferrer"
        className="btn btn-primary"
        style={{ padding: "8px 16px", fontSize: 13, gap: 6 }}
      >
        <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden>
          <path d="M6 3l14 9-14 9V3z" />
        </svg>
        遊んでみる
      </a>
    </nav>
  );
}
