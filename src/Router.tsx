// 4画面の配線層（唯一の合成点）。ルーターライブラリは使わず、
// pathname を素朴に見て出し分ける（テキストロ本体の `?test=1` 直読みと同じ方針）。
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
    return () => window.removeEventListener("popstate", onPopState);
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
