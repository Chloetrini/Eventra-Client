// // src/routes/index.tsx
// import { createBrowserRouter, type RouteObject } from "react-router-dom";
// import { RouteErrorBoundary } from "@/components/error-boundary";
// import SuspenseUI from "@/components/ui/suspense-ui";
// import RootLayout from "./root/layout";
// import MainLayout from "./main/layout";
// import AuthLayout from "./auth/layout";
// import OrganizerPage from "@/routes/main/organizer-page"; // direct import

// const routes: RouteObject[] = [
//   {
//     path: "/",
//     element: <RootLayout />,
//     ErrorBoundary: RouteErrorBoundary,
//     handle: {
//       seo: {
//         title: "EventPulse",
//         description: "Event management platform for organizers and attendees.",
//       },
//     },
//     hydrateFallbackElement: <SuspenseUI />,
//     children: [
//       {
//         element: <MainLayout />,
//         children: [
//           {
//             index: true,
//             lazy: async () => {
//               const { default: Component } = await import("@/routes/main/home");
//               return { Component };
//             },
//           },
//           {
//             path: "organizer-page",
//             element: <OrganizerPage />,          // ✅ direct import – works immediately
//             // Optional: add a local error boundary
//             // ErrorBoundary: RouteErrorBoundary,
//             handle: {
//               seo: {
//                 title: "Organizer's page",
//                 description: "View and organize your page",
//               },
//             },
//             // If you need lazy loading later, remove `element` and use `lazy` only
//           },
//           // other routes...
//         ],
//       },
//       {
//         path: "auth",
//         element: <AuthLayout />,
//         children: [
//           {
//             path: "register",
//             lazy: async () => {
//               const { default: Component } = await import("@/routes/auth/register");
//               return { Component };
//             },
//           },
//         ],
//       },
//     ],
//   },
// ];

// export const router = createBrowserRouter(routes);

import ErrorBoundary, { RouteErrorBoundary } from "@/components/error-boundary";
import SuspenseUI from "@/components/ui/suspense-ui";
import { createBrowserRouter, type RouteObject } from "react-router-dom";
import RootLayout from "./root/layout";
import MainLayout from "./main/layout";
import AuthLayout from "./auth/layout";
import { Seo as seo } from "@/components/seo";

const routes = [
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: RouteErrorBoundary,
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
          // organizer's page route
          {
            path: "organizer-page",
            handle: {
              seo: {
                title: "Organizer's page",
                description: "View and organize your page",
              },
            },
            lazy: async () => {
              const { default: Component } =
                await import("@/routes/main/organizer-page/index");
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
                await import("@/routes/auth/register");
              return { Component };
            },
          },
        ],
      },
    ],
  },
] satisfies RouteObject[];

export const router = createBrowserRouter(routes);
