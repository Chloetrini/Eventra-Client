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
                await import("@/routes/auth/register");
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
              const { default: Component } =
                await import("@/routes/auth/login");
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
              const { default: Component } =
                await import("@/routes/auth/forgot-password");
              return { Component };
            },
          },
          {
            path: "check-email",
            handle: {
              seo: {
                title: "Check your email",
                description:
                  "Verify your email for password reset instructions.",
              },
            },
            lazy: async () => {
              const { default: Component } =
                await import("@/routes/auth/check-email");
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
              const { default: Component } =
                await import("@/routes/auth/reset-password");
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
              const { default: Component } =
                await import("@/routes/auth/verify-otp");
              return { Component };
            },
          },
        ],
      },
    ],
  },
] satisfies RouteObject[];

export const router = createBrowserRouter(routes);
