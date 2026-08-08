import ErrorBoundary from "@/components/error-boundary";
import SuspenseUI from "@/components/ui/suspense-ui";
import { createBrowserRouter, type RouteObject } from "react-router-dom";
import RootLayout from "./root/layout";
import MainLayout from "./main/layout";
import AuthLayout from "./auth/layout";
import OrganizerDashboardLayout from "@/components/organizer-dashboard/OrganizerDashboardLayout";
import { organizerLoader } from "@/loaders/organizerLoader";

const routes: RouteObject[] = [
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: ErrorBoundary,
    handle: {
      seo: {
        title: "Eventra",
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
          // profile-settings route 
          {
            path: "profile-settings",
            handle: {
              seo: {
                title: "Profile & Settings",
                description: "Update your profile, notifications, and more.",
              },
            },
            lazy: async () => {
              const { default: Component } = await import("@/routes/profile-settings");
              return { Component };
            },
          },

          // organizer-dashboard (Parent Layout)
          {
            path: "organizer-dashboard",
            // loader: organizerLoader, // protect route (see below)
            Component: OrganizerDashboardLayout, // imported from "@/components/organizer-dashboard/OrganizerDashboardLayout"
            handle: {
              seo: {
                title: "Dashboard | EVENTRA",
                description: "Manage your events and track performance.",
              },
            },
            children: [
              // Index route → overview page (StatsBanner, StatsCards, RecentEventsTable)
              {
                index: true,
                lazy: async () => {
                  const { default: Component } = await import("@/routes/organizer-dashboard/index");
                  return { Component };
                },
                handle: {
                  seo: {
                    title: "Overview | EVENTRA",
                    description: "Dashboard overview.",
                  },
                },
              },
              // Events
              {
                // path: "events",
                // lazy: async () => {
                //   const { default: Component } = await import("@/routes/organizer-dashboard/events");
                //   return { Component };
                // },
                // handle: {
                //   seo: {
                //     title: "Events | EVENTRA",
                //     description: "Manage your events.",
                //   },
                // },
              },
              // Attendees
              {
                // path: "attendees",
                // lazy: async () => {
                //   const { default: Component } = await import("@/routes/organizer-dashboard/attendees");
                //   return { Component };
                // },
                // handle: {
                //   seo: {
                //     title: "Attendees | EVENTRA",
                //     description: "View your event attendees.",
                //   },
                // },
              },
              // Check-in
              {
                // path: "checkin",
                // lazy: async () => {
                //   const { default: Component } = await import("@/routes/organizer-dashboard/checkin");
                //   return { Component };
                // },
                // handle: {
                //   seo: {
                //     title: "Check-in | EVENTRA",
                //     description: "Check in attendees.",
                //   },
                // },
              },
              // Payouts
              {
                // path: "payouts",
                // lazy: async () => {
                //   const { default: Component } = await import("@/routes/organizer-dashboard/payouts");
                //   return { Component };
                // },
                // handle: {
                //   seo: {
                //     title: "Payouts | EVENTRA",
                //     description: "Manage your payouts.",
                //   },
                // },
              },
              // Promotions
              {
                // path: "promotions",
                // lazy: async () => {
                //   const { default: Component } = await import("@/routes/organizer-dashboard/promotions");
                //   return { Component };
                // },
                // handle: {
                //   seo: {
                //     title: "Promotions | EVENTRA",
                //     description: "Manage your promotions.",
                //   },
                // },
              },
            ],
          }
        ],
      },

      {
        Component: AuthLayout,
        children: [
          {
            path: "register",
            handle: {
              seo: {
                title: "Create account",
                description: "Sign up for an account.",
              },
            },
            lazy: async () => {
              const { default: Component } = await import("@/routes/auth/register");
              return { Component };
            },
          },
          {
            path: "login",
            handle: {
              seo: {
                title: "Sign in",
                description: "Sign in to your account.",
              },
            },
            lazy: async () => {
              const { default: Component } = await import("@/routes/auth/login");
              return { Component };
            },
          },
          {
            path: "forgot-password",
            handle: {
              seo: {
                title: "Forgot password",
                description: "Reset your password.",
              },
            },
            lazy: async () => {
              const { default: Component } = await import("@/routes/auth/forgot-password");
              return { Component };
            },
          },
          {
            path: "check-email",
            handle: {
              seo: {
                title: "Check your email",
                description: "Verify your email for password reset instructions.",
              },
            },
            lazy: async () => {
              const { default: Component } = await import("@/routes/auth/check-email");
              return { Component };
            },
          },
          {
            path: "reset-password",
            handle: {
              seo: {
                title: "Set a new password",
                description: "Choose a new password for your account.",
              },
            },
            lazy: async () => {
              const { default: Component } = await import("@/routes/auth/reset-password");
              return { Component };
            },
          },
          {
            path: "verify-otp",
            handle: {
              seo: {
                title: "Verify code",
                description: "Enter the code we sent to your email.",
              },
            },
            lazy: async () => {
              const { default: Component } = await import("@/routes/auth/verify-otp");
              return { Component };
            },
          },
        ],
      },
    ],
  },
];

console.log("DEBUG: Routes Array =", routes);

export const router = createBrowserRouter(routes);