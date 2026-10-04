import { useEffect, useState } from "react";

// "App mode" is the phone-app experience of the website. It switches on when the
// site is opened from the home screen (installed / standalone) on a phone-sized
// screen. A normal browser tab, a desktop or a tablet keeps the regular website.
//
// To preview it in any browser, open the site with ?app=1 (and ?app=0 to turn it
// off again). The choice is remembered for the browser tab only.
const PREVIEW_KEY = "eventra-app-preview";
const STANDALONE = "(display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui)";
const PHONE = "(max-width: 820px)";

function detect(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const flag = new URLSearchParams(window.location.search).get("app");
    if (flag === "1") sessionStorage.setItem(PREVIEW_KEY, "1");
    if (flag === "0") sessionStorage.removeItem(PREVIEW_KEY);
    if (sessionStorage.getItem(PREVIEW_KEY) === "1") return true;
  } catch {
    // Storage blocked: fall through to real detection.
  }
  const installed =
    window.matchMedia(STANDALONE).matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return installed && window.matchMedia(PHONE).matches;
}

export function useAppMode(): boolean {
  const [appMode, setAppMode] = useState(detect);

  useEffect(() => {
    const queries = [window.matchMedia(STANDALONE), window.matchMedia(PHONE)];
    const update = () => setAppMode(detect());
    queries.forEach((q) => q.addEventListener("change", update));
    return () => queries.forEach((q) => q.removeEventListener("change", update));
  }, []);

  // Lets CSS restyle anything that isn't a React component.
  useEffect(() => {
    document.documentElement.classList.toggle("app-mode", appMode);
  }, [appMode]);

  return appMode;
}
