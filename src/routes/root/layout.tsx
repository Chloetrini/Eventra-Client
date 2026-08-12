import { Outlet, ScrollRestoration, useMatches, useNavigation } from "react-router";

import { Seo, type SeoHandle } from "@/components/seo";
import { AuthGateProvider } from "@/context/auth.gate";

const DEFAULT_SEO: SeoHandle = {
  seo: {
    title: "EventPulse",
    description: "Event management platform for organizers and attendees.",
  },
};

export default function RootLayout() {
  const matches = useMatches();
  const lastMatch = matches.at(-1);
  const seo =
    (lastMatch?.handle as SeoHandle | undefined)?.seo ?? DEFAULT_SEO.seo;

  const navigation = useNavigation();
  const isNavigating = navigation.state !== "idle";

  return (
    <AuthGateProvider>
      <Seo {...seo} />
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-100 h-1.5 bg-transparent">
          <div className="h-full bg-primary animate-pulse transition-all duration-300 ease-out animate-progress" />
        </div>
      )}
      <ScrollRestoration />
      <Outlet />
    </AuthGateProvider>
  );
}
