// Big title used at the top of app-mode screens (Saved, Tickets, Profile).
export function AppScreenHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <header className="px-5 pb-3.5 pt-[calc(env(safe-area-inset-top)+16px)]">
      <h1 className="text-[32px] font-extrabold leading-[38px] tracking-tight text-[#0B1F1A] dark:text-[#EEF5F2]">{title}</h1>
      {sub ? <p className="mt-0.5 text-[15px] text-[#5F7068] dark:text-[#9BAAA3]">{sub}</p> : null}
    </header>
  );
}
