import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router";
import { STATES } from "@/types/event-types";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import gpsUrl from "@/assets/gps.svg";
import { UI_ASSETS } from "@/lib/assets";
import PageWrapper from "@/components/page-wrapper";
import { VibeGrid } from "@/components/events/vibe-grid";
import { FeaturedEvents } from "@/components/events/featured-events";
import { CtaBanner } from "@/components/ui/ctaBanner";
import { StackedCardCarousel } from "@/components/ui/StackedCardCarousel";
import { PopularCategoriesMarquee } from "@/components/events/PopularCategoriesMarquee";
import { Reveal } from "@/components/ui/Reveal";

import {
  STATS,
  FAQ_ITEMS,
  TESTIMONIALS,
} from "@/lib/home-constants";
import { fetchEvents, fetchThisWeekEvents } from "@/lib/events-api";
import { useSpotlightEvents } from "@/hooks/use-event";
import { DEFAULT_FILTERS } from "@/types/event-types";
import HowItWorks from "@/components/events/HowItWorks";
import { OrganizersCta } from "@/components/events/OrganizersCta";
import {
  HomeEventCountSkeleton,
  HomeHeroCardSkeleton,
  FeaturedEventsSkeleton,
} from "@/components/skeletons/home-skeleton";
import { useEventSearchSuggestions } from "@/hooks/use-event-search-suggestions";
import { EventSearchSuggestions } from "@/components/search/event-search-suggestions";
import { useViewerCity } from "@/hooks/use-viewer-city";

const Home: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState("");
  const [heroState, setHeroState] = useState("all");
  const { city: viewerCity, isReady: cityReady } = useViewerCity();

  useEffect(() => {
    if (cityReady && viewerCity) {
      setHeroState((prev) => (prev === "all" ? viewerCity : prev));
    }
  }, [cityReady, viewerCity]);

  const [mobileSuggestionsOpen, setMobileSuggestionsOpen] = useState(false);
  const [desktopSuggestionsOpen, setDesktopSuggestionsOpen] = useState(false);
  const { suggestions: searchSuggestions, isLoading: suggestionsLoading } =
    useEventSearchSuggestions(heroSearch);

  const handleHeroSearch = () => {
    const params = new URLSearchParams();
    if (heroSearch.trim()) params.set("search", heroSearch.trim());
    if (heroState && heroState !== "all") params.set("state", heroState);
    navigate(`/explore?${params.toString()}`);
  };

  const goToSuggestedEvent = (slug: string) => {
    setMobileSuggestionsOpen(false);
    setDesktopSuggestionsOpen(false);
    navigate(`/events/${slug}`);
  };

  const seeAllResults = () => {
    setMobileSuggestionsOpen(false);
    setDesktopSuggestionsOpen(false);
    handleHeroSearch();
  };

  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ["home-events"],
    queryFn: () => fetchEvents(DEFAULT_FILTERS),
  });

  const { data: thisWeek, isLoading: thisWeekLoading } = useQuery({
    queryKey: ["home-this-week", viewerCity],
    queryFn: () => fetchThisWeekEvents(viewerCity, 6),
    enabled: cityReady,
  });

  const { events: heroEvents, isLoading: heroLoading } = useSpotlightEvents("hero", 3);
  const { events: featuredEvents, isLoading: featuredLoading } = useSpotlightEvents("featured", 8);
  const weekEvents = thisWeek?.events ?? [];
  const weekTotal = thisWeek?.total ?? 0;
  const weekCity = thisWeek?.locationLabel;

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="relative flex items-center bg-[#4A4451] text-white">
        <PageWrapper className="px-[20px] md:py-18 py-[20px]">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center z-0 scale-110 blur-[18px] md:blur-[4px]"
              style={{ backgroundImage: `url(${UI_ASSETS.bgDesktop})` }}
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/70 to-black/30 z-1" />
          </div>

          <div className="relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-row items-center gap-1">
                  <div className="w-[11.81px] h-0 border border-[#F5A524] rounded-none inline-block" />
                  {eventsLoading ? (
                    <HomeEventCountSkeleton />
                  ) : (
                    <span className="inline-block text-[#FCD98A] text-[12px] uppercase tracking-[0.08em] font-regular font-space">
                      {weekTotal} {weekTotal === 1 ? "EVENT" : "EVENTS"} THIS WEEK
                      {weekCity ? ` · ${weekCity.toUpperCase()}` : ""}
                    </span>
                  )}
                </div>

                <h1 className="text-[40px] sm:text-[54px] lg:text-[64px] font-bold md:font-extrabold tracking-[-0.03em] leading-none font-geist md:font-grotesk">
                  Find events worth{" "}
                  <span className="text-[#FCD98A]">showing up</span> for.
                </h1>

                <p className="text-[16px] sm:text-[18px] text-white/90 max-w-xl font-normal font-geist leading-7">
                  Concerts, conferences, parties and more — real tickets, instant
                  entry, and none of the group-chat wahala.
                </p>

                {/* Search Bar */}
                <div className="bg-card shadow-lg rounded-xl">
                  {/* Mobile */}
                  <div className="lg:hidden">
                    <div className="relative flex items-center gap-2 px-4 py-3">
                      <Search className="w-4 h-4 text-muted-foreground shrink-0 rotate-90" />
                      <input
                        type="text"
                        value={heroSearch}
                        onChange={(e) => setHeroSearch(e.target.value)}
                        onFocus={() => setMobileSuggestionsOpen(true)}
                        onBlur={() => setMobileSuggestionsOpen(false)}
                        onKeyDown={(e) => e.key === "Enter" && handleHeroSearch()}
                        placeholder="Search, events, artists and venues"
                        className="bg-transparent border-none text-foreground placeholder-muted-foreground text-sm focus:outline-none w-full font-geist"
                      />
                      {mobileSuggestionsOpen && (
                        <EventSearchSuggestions
                          query={heroSearch}
                          suggestions={searchSuggestions}
                          isLoading={suggestionsLoading}
                          onSelectEvent={goToSuggestedEvent}
                          onSeeAll={seeAllResults}
                        />
                      )}
                    </div>

                    <div className="h-px bg-border mx-4" />

                    <div className="flex items-center gap-2 px-4 py-3">
                      <img src={gpsUrl} alt="gps" className="shrink-0" />
                      <Select value={heroState} onValueChange={(v) => setHeroState(v ?? "all")}>
                        <SelectTrigger className="border-none shadow-none flex-1 h-auto font-geist text-sm text-foreground focus:ring-0 px-0">
                          <SelectValue placeholder="All states">
                            {(value) => (value === "all" ? "All states" : value)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All states</SelectItem>
                          {STATES.map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="px-4 pb-4">
                      <button
                        onClick={handleHeroSearch}
                        className="w-full py-3 bg-[#0F6E56] hover:bg-[#0A4F41] text-white font-bold text-sm rounded-xl transition-all font-geist"
                      >
                        Search
                      </button>
                    </div>
                  </div>

                  {/* Desktop */}
                  <div className="relative hidden gap-1 lg:flex items-center px-4 py-2">
                    <Search className="w-4 h-4 text-muted-foreground shrink-0 rotate-90" />
                    <input
                      type="text"
                      value={heroSearch}
                      onChange={(e) => setHeroSearch(e.target.value)}
                      onFocus={() => setDesktopSuggestionsOpen(true)}
                      onBlur={() => setDesktopSuggestionsOpen(false)}
                      onKeyDown={(e) => e.key === "Enter" && handleHeroSearch()}
                      placeholder="Search, events, artists and venues"
                      className="bg-transparent border-none text-foreground placeholder-muted-foreground text-sm focus:outline-none flex-1 font-geist"
                    />
                    {desktopSuggestionsOpen && (
                      <EventSearchSuggestions
                        query={heroSearch}
                        suggestions={searchSuggestions}
                        isLoading={suggestionsLoading}
                        onSelectEvent={goToSuggestedEvent}
                        onSeeAll={seeAllResults}
                      />
                    )}

                    <div className="h-6 w-px bg-border shrink-0" />

                    <Select value={heroState} onValueChange={(v) => setHeroState(v ?? "all")}>
                      <SelectTrigger className="border-none shadow-none w-[140px] h-auto font-geist text-sm text-foreground focus:ring-0 shrink-0 gap-2">
                        <img src={gpsUrl} alt="gps" />
                        <SelectValue placeholder="All states">
                          {(value) => (value === "all" ? "All states" : value)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All states</SelectItem>
                        {STATES.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <button
                      onClick={handleHeroSearch}
                      className="px-5 py-2.5 bg-[#0F6E56] hover:bg-[#0A4F41] text-white font-bold text-sm rounded-lg transition-all font-geist whitespace-nowrap"
                    >
                      Search
                    </button>
                  </div>
                </div>

                <PopularCategoriesMarquee />

                {heroLoading && (
                  <div className="lg:hidden mt-4">
                    <HomeHeroCardSkeleton />
                  </div>
                )}
                {!heroLoading && heroEvents.length > 0 && (
                  <div className="lg:hidden mt-4">
                    <StackedCardCarousel events={heroEvents} />
                  </div>
                )}
              </div>

              <div className="hidden lg:flex lg:col-span-5 justify-end items-center">
                <div className="w-full">
                  {heroLoading ? (
                    <HomeHeroCardSkeleton />
                  ) : (
                    <StackedCardCarousel events={heroEvents} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </PageWrapper>
      </section>

      <PageWrapper className="p-[20px]">
        {/* 2. STATS BAR */}
        <section className="py-6 border-b border-border">
          <Reveal className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 md:gap-8 items-center justify-center text-center relative ">
            {STATS.map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center relative px-0.5"
              >
                <h4 className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight flex items-center">
                  {stat.icon && (
                    <img
                      src={stat.icon}
                      alt="star"
                      className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                    />
                  )}
                  {stat.value}
                </h4>
                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground tracking-[0.08em] font-space uppercase mt-1 leading-tight">
                  {stat.label}
                </p>
                {idx !== STATS.length - 1 && (
                  <div className={`absolute right-0 top-1/2 -translate-y-1/2 h-6 sm:h-10 w-px bg-border ${idx % 2 === 1 ? "hidden sm:block" : "block"}`} />
                )}
              </div>
            ))}
          </Reveal>
        </section>

        {/* Powering events ticker */}
        <section className="w-full border-b border-border pb-4 md:py-6">
          <Reveal className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-left">
              <p className="mb-3 md:mb-0 md:mr-6 text-[11px] sm:text-xs md:text-sm uppercase md:normal-case tracking-wide text-muted-foreground md:font-space">
                Powering events for
              </p>

              <div className="flex flex-wrap md:flex-nowrap  font-geist justify-center gap-x-3 gap-y-2 text-[15px] md:text-xl font-[600] text-muted-foreground font-geist">
                <span>Afro Nation</span>
                <span>Tech Week</span>
                <span>Comedy Central</span>
                <span>Detty December</span>
                <span>Group Therapy</span>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 3. BROWSE BY VIBE */}
        <Reveal>
          <VibeGrid />
        </Reveal>

        {/* 4. FEATURED THIS WEEK */}
        <Reveal>
          {featuredLoading ? (
            <FeaturedEventsSkeleton />
          ) : (
            <FeaturedEvents events={featuredEvents} />
          )}
        </Reveal>
      </PageWrapper>

      {/* 5. FEATURE HIGHLIGHTS & APP SHOWCASE */}
      <section className="space-y-16 md:space-y-24 py-16 md:py-24">
        {/* Feature 1: Discover events */}
        <div className="bg-muted py-12 md:py-20">
          <PageWrapper className="p-[20px]">
            <Reveal className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
              <div className="max-w-md mx-auto md:mx-0">
                <span className="text-xs font-normal uppercase text-[#0F6E56] dark:text-[#4ADE80] tracking-[1%] flex items-center gap-1 mb-4">
                  <span className="w-[11.81px] h-0 border border-[#F5A524] rounded-none inline-block" />
                  FOR FANS
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight font-geist md:font-grotesk mb-4">
                  Discover events you'll actually love.
                </h2>
                <p className="text-foreground text-sm sm:text-base font-geist leading-6.5 md:font-medium mb-6">
                  A feed tuned to your city and your taste. Filter by vibe, price,
                  or date, and save the ones you're eyeing for later.
                </p>
                <ul className="space-y-4 text-sm text-foreground font-geist">
                  <li className="flex items-center gap-2">
                    <img src={UI_ASSETS.confirm} alt="confirm" />
                    <span>Smart search across events, artists and venues</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <img src={UI_ASSETS.confirm} alt="confirm" />
                    <span>Filter by category, date, and price in a tap</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <img src={UI_ASSETS.confirm} alt="confirm" />
                    <span>
                      Save events and get reminders before they sell out
                    </span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center items-center">
                <img
                  className="w-full max-w-[260px] sm:max-w-[280px] md:max-w-[300px] h-auto object-contain drop-shadow-xl"
                  src={UI_ASSETS.mobile1}
                  alt="explore"
                />
              </div>
            </Reveal>
          </PageWrapper>
        </div>

       
        {/* Feature 2: Pay your way */}
        <PageWrapper className="p-[20px]">
          <Reveal className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-[400px]  items-center">
            <div className="flex justify-center items-center order-last md:order-first">
              <img
                className="w-full max-w-[260px] sm:max-w-[280px] md:max-w-[300px] h-auto object-contain drop-shadow-xl"
                src={UI_ASSETS.mobile2}
                alt="image of a phone"
              />
            </div>
            <div className="w-full max-w-md">
              <span className="text-xs md:text-sm font-normal uppercase text-[#0F6E56] dark:text-[#4ADE80] tracking-wider font-geist flex items-center gap-1 mb-4">
                <span className="w-[11.81px] h-0 border border-[#F5A524] rounded-none inline-block" />
                CHECKOUT IN SECONDS
              </span>
              <h2 className="text-2xl md:text-4xl text-foreground leading-tight font-geist md:font-grotesk font-bold mb-4">
                Pay your way — card, transfer, or USSD.
              </h2>
              <p className="text-foreground text-sm sm:text-base font-geist leading-6.5 md:font-medium mb-6">
                Buy in a few taps with the method you already use. Your money is
                held safely until the event actually happens.
              </p>
              <ul className="space-y-4 text-sm text-foreground font-geist">
                <li className="flex items-center gap-2">
                  <img src={UI_ASSETS.confirm} alt="confirm" />
                  <span>Card, bank transfer and USSD, powered by Paystack</span>
                </li>
                <li className="flex items-center gap-2">
                  <img src={UI_ASSETS.confirm} alt="confirm" />
                  <span>No hidden fees — you see the total before you pay</span>
                </li>
                <li className="flex items-center gap-2">
                  <img src={UI_ASSETS.confirm} alt="confirm" />
                  <span>Instant confirmation and receipt</span>
                </li>
              </ul>
            </div>
          </Reveal>
        </PageWrapper>

        {/* Feature 3: Ticket security */}
        <div className="bg-muted py-12 md:py-20">
          <PageWrapper className="p-[20px]">
            <Reveal className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
              <div className="max-w-md mx-auto md:mx-0">
                <span className="text-xs md:text-sm font-normal uppercase text-[#0F6E56] dark:text-[#4ADE80] tracking-wider font-geist flex items-center gap-1 mb-4">
                  <span className="w-[11.81px] h-0 border border-[#F5A524] rounded-none inline-block" />
                  TRUST BUILT IN
                </span>
                <h2 className="text-2xl md:text-4xl text-foreground leading-tight font-geist md:font-grotesk font-bold mb-4">
                  A ticket that can't be faked.
                </h2>
                <p className="text-foreground text-sm sm:text-base font-geist leading-6.5 md:font-medium mb-6">
                  Buy in a few taps with the method you already use. Your money is
                  held safely until the event actually happens.
                </p>
                <ul className="space-y-4 text-sm text-foreground font-geist">
                  <li className="flex items-center gap-2">
                    <img src={UI_ASSETS.confirm} alt="confirm" />
                    <span>Unique, one-time-use QR per ticket</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <img src={UI_ASSETS.confirm} alt="confirm" />
                    <span>Lives in the app — works offline once loaded</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <img src={UI_ASSETS.confirm} alt="confirm" />
                    <span>Scanned in seconds at the gate</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center items-center">
                <img
                  className="w-full max-w-[260px] sm:max-w-[280px] md:max-w-[300px] h-auto object-contain drop-shadow-xl"
                  src={UI_ASSETS.mobile3}
                  alt="image of a phone"
                />
              </div>
            </Reveal>
          </PageWrapper>
        </div>
      </section>

      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <OrganizersCta />
      </Reveal>

      <PageWrapper className="pt-0 p-[20px]">
        {/* 6. TESTIMONIALS */}
        <section className="py-12 border-t border-border">
          <Reveal className="text-start max-w-2xl mb-3 md:mb-6">
            <span className="text-xs font-normal uppercase text-[#0F6E56] dark:text-[#4ADE80] tracking-wider font-geist flex items-center gap-1">
              <span className="w-[11.81px] h-0 border border-[#F5A524] rounded-none inline-block" />
              REAL PEOPLE, REAL EVENTS
            </span>
            <h2 className="text-xl md:text-3xl font-extrabold text-foreground mt-1 font-grotesk">
              Loved by fans and organizers
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <Reveal key={t.id} delayMs={idx * 100} className="bg-muted p-6 rounded-2xl flex flex-col justify-between">
                <div className="flex items-center gap-px mb-1">
                  {[...Array(5)].map((_, i) => (
                    <img key={i} src={UI_ASSETS.yellowStar} alt="star" />
                  ))}
                </div>
                <p className="text-sm text-foreground mb-6 font-geist font-medium">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-foreground font-geist">
                      {t.author}
                    </h4>
                    <p className="text-xs text-muted-foreground font-geist">
                      {t.role} • {t.state}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 7. FREQUENTLY ASKED QUESTIONS */}
        <section className="py-12 border-t border-border">
          <Reveal className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-normal uppercase text-[#0F6E56] dark:text-[#4ADE80] tracking-[1%] flex items-center gap-1 justify-center">
              <span className="w-[11.81px] h-0 border border-[#F5A524] rounded-none inline-block" />
              <h5>GOOD TO KNOW</h5>
            </span>
            <h2 className="text-xl font-bold text-foreground font-geist">
              Frequently asked questions
            </h2>
          </Reveal>
          <Reveal className="max-w-3xl mx-auto space-y-4">
            {FAQ_ITEMS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-card rounded-xl border border-border overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-foreground text-base hover:text-[#0F6E56] dark:hover:text-[#4ADE80] transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${openFaq === idx
                        ? "rotate-180 text-[#0F6E56] dark:text-[#4ADE80]"
                        : "text-muted-foreground"
                      }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-sm text-muted-foreground border-t border-border pt-3 font-geist">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </Reveal>
        </section>

        {/* 9. BOTTOM CTA BANNER */}
        <Reveal className="mb-7">
          <CtaBanner
            label="COME BUILD THE CULTURE"
            heading="Your next night out starts here."
            body="Discover an event to attend, or start selling tickets to your own. It only takes a minute."
            primaryBtn={{ text: "Find an event", to: "/explore" }}
            secondaryBtn={{ text: "Start selling tickets", to: "/auth/organizer/register" }}
            bgImage={UI_ASSETS.manWithHandUp}
            align="left"
          />
        </Reveal>
      </PageWrapper>
    </>
  );
};

export default Home;