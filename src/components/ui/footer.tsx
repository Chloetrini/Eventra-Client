import { NavLink } from "react-router"
import PageWrapper from "@/components/page-wrapper";
import { useState } from "react";
import { toast } from "react-toastify";

const DISCOVER_LINKS = [
    { to: "/explore", label: "Explore events" },
    { to: "/explore?when=weekend", label: "This weekend" },
    { to: "/explore?price=free", label: "Free events" },
] as const

const ORGANIZER_LINKS = [
    { to: "/organizers", label: "Sell tickets" },
    { to: "/organizer/dashboard", label: "Dashboard" },
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
            <h3 className="font-mono font-bold uppercase tracking-widest text-muted-foreground">
                {heading}
            </h3>
            <ul className="flex flex-col gap-3">
                {links.map((link) => (
                    <li key={link.to}>
                        <NavLink
                            to={link.to}
                            className="text-[15px] text-foreground/80 transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Footer() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("Enter your email to subscribe.");
            return;
        }
        if (!isValidEmail(email)) {
            setError("Enter a valid email address.");
            return;
        }

        setIsSubmitting(true);
        try {
            // TODO: wire to a real endpoint once backend confirms one exists
            // e.g. await api.post("/newsletter/subscribe", { email });
            toast.info("Newsletter signup isn't wired to the backend yet.");
            setEmail("");
        } catch (err) {
            toast.error("Could not subscribe. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer className="relative overflow-hidden bg-[#E4F1EB] dark:bg-[#0F1F1A]">
            <PageWrapper className="p-[20px]">
            <div className=" w-full ">
                {/* Newsletter CTA */}
                <div className="flex flex-col gap-6 py-14 md:flex-row md:items-center md:justify-between md:gap-10">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">
                            Never miss a good one.
                        </h2>
                        <p className="mt-2 text-[15px] text-muted-foreground">
                            Get the week&apos;s best events in your inbox. No spam
                        </p>
                    </div>

                    <div className="flex flex-col w-full max-w-md shrink-0 gap-1.5">
                        <form
                            className="flex w-full items-center gap-3"
                            onSubmit={handleSubscribe}
                            noValidate
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error) setError("");
                                }}
                                placeholder="eventra@gmail.com"
                                className="h-12 w-full min-w-0 rounded-[7px] border border-border bg-background px-4 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/40 dark:focus:ring-[#0F6E56]/60"
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex shrink-0 items-center justify-center rounded-[7px] bg-[#0F6E56] px-6 py-3 text-[15px] font-bold text-white transition-colors hover:bg-[#0F6E56]/90 disabled:opacity-60"
                            >
                                {isSubmitting ? "Subscribing..." : "Subscribe"}
                            </button>
                        </form>
                        {error && (
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        )}
                    </div>
                </div>
                {/* Link columns */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-border py-12 sm:grid-cols-4">
                    <div className="col-span-2 flex flex-col gap-4 sm:col-span-1">
                        <NavLink to="/" className="flex items-center gap-2">
                            <img className="h-8 w-6" src="/src/assets/Eventra-logo.png" alt="Eventra" />
                            <span className="text-xl font-bold tracking-tight text-foreground">
                                Eventra
                            </span>
                        </NavLink>
                        <p className="max-w-[26ch] text-[15px] text-muted-foreground">
                            The trusted way to discover events and buy tickets in Nigeria.
                        </p>
                    </div>

                    <FooterColumn heading="Discover" links={DISCOVER_LINKS} />
                    <FooterColumn heading="Organizers" links={ORGANIZER_LINKS} />
                    <FooterColumn heading="Company" links={COMPANY_LINKS} />
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col gap-3 border-t border-border py-6 font-Geist text-xs uppercase tracking-widest text-muted-foreground font-medium sm:flex-row sm:items-center sm:justify-between">
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

        </PageWrapper>
           
        </footer>
    )
}