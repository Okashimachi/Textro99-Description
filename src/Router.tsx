// 4画面の配線層（唯一の合成点）。ルーターライブラリは使わず、
// pathname を素朴に見て出し分ける（テキストロ本体の `?test=1` 直読みと同じ方針）。
//
// ⚠ サイト内リンクは全て素の <a href="/planning"> 等で書いてある（Nav.tsx / RemoteNav.tsx /
// TopPage.tsx の3カード等）。popstate（戻る/進む）だけを見ていると、クリックのたびに
// ブラウザが実際に /planning へHTTPリクエストしてしまう。静的ホスティングは `/` にしか
// index.html を持たないため、これが本番デプロイ後の「どの画面にも飛べない・404」の原因になる
// （public/vercel.json のSPAフォールバックは直接URLアクセス/リロード用の保険で、これとは別）。
// なので同一オリジンの内部リンクはここでクリックを横取りし、history.pushState で
// ページ遷移させる（フルリロードなしのSPAナビゲーション）。
import { useEffect, useState } from "react";
import { TopPage } from "./top/TopPage";
import { PlanningPage } from "./planning/PlanningPage";
import { FrontendPage } from "./frontend/FrontendPage";
import { BackendPage } from "./backend/BackendPage";

function usePathname() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onPopState);

    // 同一オリジンの内部リンククリックを横取りしてSPA遷移にする。
    // 対象外（横取りしない）: target="_blank" の外部リンク（GitHub・遊んでみる等）、
    // 修飾キー押下（新規タブ/ウィンドウで開く意図）、別オリジン。
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as Element).closest?.("a");
      if (!anchor || anchor.target === "_blank") return;

      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/")) return; // 相対/外部/アンカー等は素通り

      e.preventDefault();
      if (href !== window.location.pathname) {
        window.history.pushState(null, "", href);
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
      window.scrollTo(0, 0);
    };
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return pathname;
}

export function Router() {
  const pathname = usePathname();

  if (pathname.startsWith("/planning")) return <PlanningPage />;
  if (pathname.startsWith("/frontend")) return <FrontendPage />;
  if (pathname.startsWith("/backend")) return <BackendPage />;
  return <TopPage />;
}
