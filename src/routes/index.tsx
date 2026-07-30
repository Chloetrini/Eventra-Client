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

            }
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
                        }
                    }
                ]
            },
             {
                        path: "contact",
                        handle: {
                            seo: {
                                title: "Contact",
                                description: "Get in touch with the Eventra team.",
                            }
                        },
                        lazy: async () => {
                            const { default: Component } = await import("@/routes/main/contact");
                            return { Component };
                        }
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
                            }
                        },

                        lazy: async () => {
                            const { default: Component } = await import("@/routes/main/register");
                            return { Component };
                        }
                    },
                ],
            },


        ]
    }
] satisfies RouteObject[];

export const router = createBrowserRouter(routes)