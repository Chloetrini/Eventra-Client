import { NavLink } from "react-router"

const DISCOVER_LINKS = [
    { to: "/explore", label: "Explore events" },
    { to: "/explore?category=concerts", label: "Concerts" },
    { to: "/explore?when=weekend", label: "This weekend" },
    { to: "/explore?price=free", label: "Free events" },
] as const

const ORGANIZER_LINKS = [
    { to: "/organizers", label: "Sell tickets" },
    { to: "/organizers/pricing", label: "Pricing" },
    { to: "/organizers/dashboard", label: "Dashboard" },
    { to: "/organizers/promote", label: "Promote an event" },
] as const

const COMPANY_LINKS = [
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    { to: "/terms", label: "Terms" },
    { to: "/privacy", label: "Privacy" },
] as const

function FooterColumn({
    heading,
    links,
}: {
    heading: string
    links: readonly { to: string; label: string }[]
}) {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="font-mono font-bold uppercase tracking-widest text-[#1A1523]/70">
                {heading}
            </h3>
            <ul className="flex flex-col gap-3">
                {links.map((link) => (
                    <li key={link.to}>
                        <NavLink
                            to={link.to}
                            className="text-[15px] text-[#1A1523]/80 transition-colors hover:text-[#1A1523]"
                        >
                            {link.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default function Footer() {
    return (
        <footer className="relative overflow-hidden bg-[#E4F1EB]">
            <div className="mx-auto w-full py-4 px-[101.5px]">
                {/* Newsletter CTA */}
                <div className="flex flex-col gap-6 py-14 md:flex-row md:items-center md:justify-between md:gap-10">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-[#1A1523]">
                            Never miss a good one.
                        </h2>
                        <p className="mt-2 text-[15px] text-[#1A1523]/70">
                            Get the week&apos;s best events in your inbox. No spam
                        </p>
                    </div>

                    <form
                        className="flex w-full max-w-md shrink-0 items-center gap-3"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                            type="email"
                            placeholder="eventra@gmail.com"
                            className="h-12 w-full min-w-0 rounded-[7px] border border-[#1A1523]/10 bg-white px-4 text-[15px] text-[#1A1523] placeholder:text-[#1A1523]/40 focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/40"
                        />
                        <button
                            type="submit"
                            className="inline-flex shrink-0 items-center justify-center rounded-[7px] bg-[#0F6E56] px-6 py-3 text-[15px] font-bold text-white transition-colors hover:bg-[#0F6E56]/90"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
                {/* Link columns */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-[#1A1523]/10 py-12 sm:grid-cols-4">
                    <div className="col-span-2 flex flex-col gap-4 sm:col-span-1">
                        <NavLink to="/" className="flex items-center gap-2">
                            <img className="h-8 w-6" src="/src/assets/Eventra-logo.png" alt="Eventra" />
                            <span className="text-xl font-bold tracking-tight text-[#1A1523]">
                                Eventra
                            </span>
                        </NavLink>
                        <p className="max-w-[26ch] text-[15px] text-[#1A1523]/70">
                            The trusted way to discover events and buy tickets in Nigeria.
                        </p>
                    </div>

                    <FooterColumn heading="Discover" links={DISCOVER_LINKS} />
                    <FooterColumn heading="Organizers" links={ORGANIZER_LINKS} />
                    <FooterColumn heading="Company" links={COMPANY_LINKS} />
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col gap-3 border-t border-[#1A1523]/10 py-6 font-Geist text-xs uppercase tracking-widest text-[#1A1523]/50 font-medium sm:flex-row sm:items-center sm:justify-between">
                    <span>© 2026 Eventra · Lagos, Nigeria</span>
                    <span className="inline-flex items-center gap-1.5">
                        Made for the culture <span aria-hidden="true">◇</span>
                    </span>
                </div>
            </div>


            {/* Watermark */}
            <div className="overflow-hidden">
                <img src="footer-eventra.svg" alt="" />
            </div>

        </footer>
    )
}