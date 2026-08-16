import ErrorBoundary from "@/components/error-boundary";
import SuspenseUI from "@/components/ui/suspense-ui";
import { createBrowserRouter } from "react-router";
import { type RouteObject } from "react-router";
import RootLayout from "./root/layout";
import MainLayout from "./main/layout";
import AuthLayout from "./auth/layout";

const routes = [
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: ErrorBoundary,
    handle: {
      seo: {
        title: "EventPulse",
        description: "Event management platform for organizers and attendees.",
      },
    },
    hydrateFallbackElement: <SuspenseUI />,
    children: [
      {
        Component: MainLayout,
        children: [
          {
            index: true,
            lazy: async () => {
              const { default: Component } = await import("@/routes/main/home");
              return { Component };
            },
          },

          {
            path: "tickets",
            handle: {
              seo: {
                title: "My Tickets",
                description: "View and manage your event tickets.",
              },
            },
            lazy: async () => {
              const { default: Component } = await import("@/routes/tickets");
              return { Component };
            },
          },
          {
            path: "events",
            handle: {
              seo: {
                title: "Events",
                description: "Manage your events, from draft to sold out.",
              },
            },
            lazy: async () => {
              const { default: Component } = await import("@/routes/events");
              return { Component };
            },
          },

          {
            path: "attendees",
            handle: {
              seo: {
                title: "Attendees",
                description:
                  "See who's coming to each event and report the guest list.",
              },
            },
            lazy: async () => {
              const { default: Component } = await import("@/routes/attendees");
              return { Component };
            },
          },
          {
            path: "settings",
            handle: {
              seo: {
                title: "Settings",
                description:
                  "Your organization profile, bank account and verification.",
              },
            },
            lazy: async () => {
              const { default: Component } = await import("@/routes/settings");
              return { Component };
            },
          },
          {
            path: "payment",
            children: [
              {
                path: "checkout",
                handle: {
                  seo: {
                    title: "Checkout",
                    description: "Complete your purchase.",
                  },
                },

                lazy: async () => {
                  const { default: Component } =
                    await import("@/routes/payment/checkout");
                  return { Component };
                },
              },
              {
                path: "ticket-confirmation",
                handle: {
                  seo: {
                    title: "Ticket confirmation",
                    description: "View your completed ticket purchase.",
                  },
                },

                lazy: async () => {
                  const { default: Component } =
                    await import("@/routes/payment/ticket-confirmation");
                  return { Component };
                },
              },
            ],
          },
        ],
      },
      {
        path: "auth",
        Component: AuthLayout,
        children: [
          {
            path: "register",
            handle: {
              seo: {
                title: "create account",
                description: "sign up for an account.",
              },
            },

            lazy: async () => {
              const { default: Component } =
                await import("@/routes/main/register");
              return { Component };
            },
          },
        ],
      },
    ],
  },
] satisfies RouteObject[];

export const router = createBrowserRouter(routes);
