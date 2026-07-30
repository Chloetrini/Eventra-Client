import { Outlet, ScrollRestoration, useMatches, useNavigation } from "react-router";
import { Seo, type SeoHandle, } from "@/components/seo";

const DEFAULT_SEO: SeoHandle = {
    seo: {
        title: "Eventra",
        description: "Event management platform for organizers and attendees.",
    },
};


export default function RootLayout() {
    const matches = useMatches()
    const lastMatch = matches.at(-1)
    const seo = (lastMatch?.handle as SeoHandle | undefined)?.seo ?? DEFAULT_SEO.seo

    const navigation = useNavigation()
    const isNavigating = navigation.state !== 'idle'
    return (
        <>
            <Seo {...seo} />
            {isNavigating && (
<<<<<<< HEAD
                <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
                    <div className="h-full bg-primary animate-pulse transition-all duration-300 ease-in-out animate-progress" />
=======
                <div className="fixed top-0 left-0 right-0 z-100 h-1.5 bg-transparent">
                    <div className="h-full bg-primary animate-pulse transition-all duration-300" />
>>>>>>> af5ef94b5b57e015e48b88334f7c3ba563c6a40b
                </div>
            )}
            <ScrollRestoration/>
            <Outlet />
            </>
    )
}
