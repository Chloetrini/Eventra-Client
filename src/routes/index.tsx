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
        const { default: Component } =
          await import("@/routes/main/register");
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
      // lazy: async () => {
      //   const { default: Component } =
      //     await import("@/routes/main/login");
      //   return { Component };
      // },
    },
  ],
},
    ],
  },
] satisfies RouteObject[];

export const router = createBrowserRouter(routes);
