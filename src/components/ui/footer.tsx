import { Link, NavLink } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-[#EAF5F2] text-gray-700">
      {/* Newsletter */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Never miss a good one.
            </h2>
            <p className="mt-2 text-gray-500">
              Get the week's best events in your inbox. No spam.
            </p>
          </div>

          <form className="flex w-full max-w-lg flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="eventra@gmail.com"
              className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-3 outline-none focus:border-emerald-600"
            />

            <button className="rounded-md bg-emerald-700 px-6 py-3 font-medium text-white transition hover:bg-emerald-800">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-300" />

      {/* Main Footer */}
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-2 lg:grid-cols-4">
        {/* Logo */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900">Eventra</h3>

          <p className="mt-4 max-w-xs text-sm leading-6 text-gray-600">
            The trusted way to discover and buy tickets in Nigeria.
          </p>

        
        </div>

        {/* Discover */}
        <div>
          <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-900">
            Discover
          </h4>

          <ul className="space-y-3">
            <li>
              <NavLink to="/explore">Explore events</NavLink>
            </li>
            <li>
              <NavLink to="/concerts">Concerts</NavLink>
            </li>
            <li>
              <NavLink to="/weekend">This weekend</NavLink>
            </li>
            <li>
              <NavLink to="/free-events">Free events</NavLink>
            </li>
          </ul>
        </div>

        {/* Organizers */}
        <div>
          <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-900">
            Organizers
          </h4>

          <ul className="space-y-3">
            <li>
              <Link to="/">Sell tickets</Link>
            </li>
            <li>
              <Link to="/">Pricing</Link>
            </li>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/">Promote an event</Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-900">
            Company
          </h4>

          <ul className="space-y-3">
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
            <li>
              <NavLink to="/terms">Terms</NavLink>
            </li>
            <li>
              <NavLink to="/privacy">Privacy</NavLink>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-300" />

      {/* Bottom */}
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-gray-500 md:flex-row">
        <p>© 2026 EVENTRA · LAGOS, NIGERIA</p>

        <p>MADE FOR THE CULTURE ◇</p>
      </div>

      {/* Watermark */}
      <div className="overflow-hidden">
       <img src="footer-eventra.svg" alt="" />
      </div>
    </footer>
  );
}