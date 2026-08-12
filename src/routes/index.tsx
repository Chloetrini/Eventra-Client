import ErrorBoundary from "@/components/error-boundary";
import SuspenseUI from "@/components/ui/suspense-ui";
import { createBrowserRouter, Navigate } from "react-router";
import { type RouteObject } from "react-router";
import RootLayout from "./root/layout";
import MainLayout from "./main/layout";
import AuthLayout from "./auth/layout";
import Onboardinglayout from "./onboarding/layout";

import CreateEventLayout from "./dashboard/create-event/layout";
import DashBoardLayout from "./dashboard/layout";

const routes = [
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
          {
            path: "explore",
            handle: {
              seo: {
                title: "Explore Events",
                description: "View and filter your event ",
              },
            },
            lazy: async () => {
              const { default: Component } =
                await import("@/routes/main/explore");
              return { Component };
            },
          },
          {
            path: "saved-events",
            handle: {
              seo: {
                title: "Saved Events",
                description: "Save your event ",
              },
            },
            lazy: async () => {
              const { default: Component } =
                await import("@/routes/main/saved-events");
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
              const { default: Component } =
                await import("@/routes/main/tickets");
              return { Component };
            },
          },
          {
            path: "events/:slug",
            handle: {
              seo: {
                title: "Event",
                description: "View your favorite event",
              },
            },
            lazy: async () => {
              const { default: Component } =
                await import("@/routes/main/event.id");
              return { Component };
            },
          },
          {
            path: "contact",
            handle: {
              seo: {
                title: "Contact",
                description: "Get in touch with the Eventra team.",
              },
            },
            lazy: async () => {
              const { default: Component } =
                await import("@/routes/main/contact");
              return { Component };
            },
          },
          {
            path: "organizers",
            handle: {
              seo: {
                title: "Organizer",
                description: "Get in touch with the Eventra team.",
              },
            },
            lazy: async () => {
              const { default: Component } =
                await import("@/routes/main/organizer-page");
              return { Component };
            },
          },
          {
            path: "organizer/events/:eventId?",
            handle: {
              seo: {
                title: "Organizer Event Details",
                description:
                  "Manage your event, view sales metrics, recent attendees, and quick actions.",
              },
            },
            lazy: async () => {
              const { default: Component } =
                await import("@/routes/main/organizer-event-details");
              return { Component };
            },
          },
          {
            path: "about",
            handle: {
              seo: {
                title: "About",
                description: "Learn more about the Eventra team.",
              },
            },
            lazy: async () => {
              const { default: Component } =
                await import("@/routes/main/about");
              return { Component };
            },
          },

          {
            path: "payment",
            children: [
              {
                index: true,
                element: <Navigate to="/" replace />,
              },
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
                    await import("@/routes/main/payment/checkout");
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
                    await import("@/routes/main/payment/ticket-confirmation");
                  return { Component };
                },
              },
            ],
          },
        ],
      },
      {
        path: "contact",
        handle: {
          seo: {
            title: "Contact",
            description: "Get in touch with the Eventra team.",
          },
        },
        lazy: async () => {
          const { default: Component } = await import("@/routes/main/contact");
          return { Component };
        },
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
                await import("@/routes/auth/register/index");
              return { Component };
            },
          },
          {
            path: "login",
            handle: {
              seo: {
                title: "login",
                description: "sign in to your account.",
              },
            },

            lazy: async () => {
              const { default: Component } =
                await import("@/routes/auth/login/index");
              return { Component };
            },
          },
          {
            path: "reset-password",
            handle: {
              seo: {
                title: "reset password",
                description: "reset your password.",
              },
            },

            lazy: async () => {
              const { default: Component } =
                await import("@/routes/auth/reset-password/index");
              return { Component };
            },
          },
          {
            path: "check-email",
            handle: {
              seo: {
                title: "check email",
                description:
                  "check your email for password reset instructions.",
              },
            },

            lazy: async () => {
              const { default: Component } =
                await import("@/routes/auth/check-email/index");
              return { Component };
            },
          },
          {
            path: "verify-otp",
            handle: {
              seo: {
                title: "verify otp",
                description: "verify your otp.",
              },
            },

            lazy: async () => {
              const { default: Component } =
                await import("@/routes/auth/verify-otp/index");
              return { Component };
            },
          },
          {
            path: "forgot-password",
            handle: {
              seo: {
                title: "forgot password",
                description: "reset your password.",
              },
            },

            lazy: async () => {
              const { default: Component } =
                await import("@/routes/auth/forgot-password/index");
              return { Component };
            },
          },
          {
            path: "organizer",
            children: [
              {
                path: "login",
                handle: {
                  seo: {
                    title: "organizer login",
                    description: "sign in to your organizer account.",
                  },
                },
                lazy: async () => {
                  const { default: Component } =
                    await import("@/routes/auth/login/index");
                  return { Component };
                },
              },
              {
                path: "register",
                handle: {
                  seo: {
                    title: "organizer sign up",
                    description: "create your organizer account.",
                  },
                },
                lazy: async () => {
                  const { default: Component } =
                    await import("@/routes/auth/register/index");
                  return { Component };
                },
              },
              {
                path: "reset-password",
                handle: {
                  seo: {
                    title: "organizer reset password",
                    description: "reset your password.",
                  },
                },

                lazy: async () => {
                  const { default: Component } =
                    await import("@/routes/auth/reset-password/index");
                  return { Component };
                },
              },
              {
                path: "check-email",
                handle: {
                  seo: {
                    title: "organizer check email",
                    description:
                      "check your email for password reset instructions.",
                  },
                },

                lazy: async () => {
                  const { default: Component } =
                    await import("@/routes/auth/check-email/index");
                  return { Component };
                },
              },
              {
                path: "verify-otp",
                handle: {
                  seo: {
                    title: "organizer verify otp",
                    description: "verify your otp.",
                  },
                },

                lazy: async () => {
                  const { default: Component } =
                    await import("@/routes/auth/verify-otp/index");
                  return { Component };
                },
              },
              {
                path: "forgot-password",
                handle: {
                  seo: {
                    title: "organizer forgot password",
                    description: "reset your password.",
                  },
                },

                lazy: async () => {
                  const { default: Component } =
                    await import("@/routes/auth/forgot-password/index");
                  return { Component };
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "onboarding",
    Component: Onboardinglayout,
    children: [
      {
        index: true,
        element: <Navigate to="organisation" replace />,
      },
      {
        path: "organisation",
        handle: {
          seo: {
            title: "Organisation",
            description: "Provide details about your organisation.",
          },
        },
        lazy: async () => {
          const { default: Component } =
            await import("@/routes/onboarding/organisation");
          return { Component };
        },
      },
      {
        path: "bank-account",
        handle: {
          seo: {
            title: "Bank Account",
            description: "Provide your bank account details.",
          },
        },
        lazy: async () => {
          const { default: Component } =
            await import("@/routes/onboarding/bank-account");
          return { Component };
        },
      },
      {
        path: "review",
        handle: {
          seo: {
            title: "Review",
            description: "Submit for approval",
          },
        },
        lazy: async () => {
          const { default: Component } =
            await import("@/routes/onboarding/review");
          return { Component };
        },
      },
      {
        path: "success",
        handle: {
          seo: {
            title: "Success",
            description: "Your onboarding is complete.",
          },
        },
        lazy: async () => {
          const { default: Component } =
            await import("@/routes/onboarding/success");
          return { Component };
        },
      },
    ],
  },
] satisfies RouteObject[];
export const router = createBrowserRouter(routes);