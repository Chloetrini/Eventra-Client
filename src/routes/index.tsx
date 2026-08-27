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
import { RequireOrganizer } from "@/components/require-organizer";
import { RequireAdmin } from "@/components/require-admin";
import AdminLayout from "./admin/layout";
import { Children } from "react";

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
                        }
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
                            const { default: Component } = await import("@/routes/main/explore");
                            return { Component };
                        }
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
                            const { default: Component } = await import("@/routes/main/saved-events");
                            return { Component };
                        }
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
                            const { default: Component } = await import("@/routes/main/tickets");
                            return { Component };
                        },
                    },
                    {
                        path: "events/:slug",
                        handle: {
                            seo: {
                                title: "Event",
                                description: "View your favorite event",
                            }
                        },
                        lazy: async () => {
                            const { default: Component } = await import("@/routes/main/event-id");
                            return { Component };
                        },
                    },
                    {
                        path: "events/:slug/report",
                        handle: {
                            seo: {
                                title: "Report Event",
                                description: "Report an issue with this event",
                            }
                        },
                        lazy: async () => {
                            const { default: Component } = await import("@/routes/main/report-event");
                            return { Component };
                        },
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
                        path: "organizers",
                        handle: {
                            seo: {
                                title: "Organizer",
                                description: "Get in touch with the Eventra team.",
                            }
                        },
                        lazy: async () => {
                            const { default: Component } = await import("@/routes/main/organizer-page");
                            return { Component };
                        }
                    },
                    {
                        path: "about",
                        handle: {
                            seo: {
                                title: "About",
                                description: "Learn more about the Eventra team.",
                            }
                        },
                        lazy: async () => {
                            const { default: Component } = await import("@/routes/main/about");
                            return { Component };
                        }
                    },

                    {
                        path: "profile",
                        handle: {
                            seo: {
                                title: "Profile & Settings",
                                description: "Manage your account.",
                            }
                        },
                        lazy: async () => {
                            const { default: Component } = await import("@/routes/main/profile");
                            return { Component };
                        }
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
                            {
                                path: "checkout",
                                children: [
                                    {
                                        path: "callback",
                                        handle: {
                                            seo: {
                                                title: "Confirming payment",
                                                description: "Confirming your payment.",
                                            },
                                        },
                                        lazy: async () => {
                                            const { default: Component } =
                                                await import("@/routes/main/payment/checkout-callback");
                                            return { Component };
                                        },
                                    },
                                ],
                            },
                            {
                                path: "refund-request",
                                handle: {
                                    seo: {
                                        title: "Request Refund",
                                        description: "Request a refund for your purchase.",
                                    },
                                },
                                lazy: async () => {
                                    const { default: Component } =
                                        await import("@/routes/main/payment-refunds");
                                    return { Component };
                                },


                            },
                        ],
                    },
                ]
            },


            {
                path: "auth",
                Component: AuthLayout,
                children: [
                    {
                        index: true,
                        element: <Navigate to="login" replace />,
                    },
                    {
                        path: "register",
                        handle: {
                            seo: {
                                title: "create account",
                                description: "sign up for an account.",
                            }
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
                            }
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
                            }
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
                                description: "check your email for password reset instructions.",
                            }
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
                            }
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
                            }
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
                                index: true,
                                element: <Navigate to="login" replace />,
                            },
                            {
                                path: "login",
                                handle: {
                                    seo: {
                                        title: "organizer login",
                                        description: "sign in to your organizer account.",
                                    }
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
                                    }
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
                                    }
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
                                        description: "check your email for password reset instructions.",
                                    }
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
                                    }
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
                                    }
                                },

                                lazy: async () => {
                                    const { default: Component } =
                                        await import("@/routes/auth/forgot-password/index");
                                    return { Component };
                                },
                            },
                        ],
                    },
                    {
                        // No register/reset-password/etc children on purpose —
                        // there is no self-service admin signup. Only a
                        // seeded admin account can ever sign in here, and
                        // this reuses the exact same login form/styling as
                        // the attendee/organizer logins (see routes/auth/login/index.tsx).
                        path: "admin",
                        children: [
                            {
                                path: "login",
                                handle: {
                                    seo: {
                                        title: "admin login",
                                        description: "sign in to the admin dashboard.",
                                    }
                                },
                                lazy: async () => {
                                    const { default: Component } =
                                        await import("@/routes/auth/login/index");
                                    return { Component };
                                },
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
                            }
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
                            }
                        },
                        lazy: async () => {
                            const { default: Component } =
                                await import("@/routes/onboarding/bank-account");
                            return { Component };
                        },
                    },
                    {
                        path: "verification",
                        handle: {
                            seo: {
                                title: "Verification",
                                description: "Upload your CAC certificate, director ID, and proof of address.",
                            }
                        },
                        lazy: async () => {
                            const { default: Component } =
                                await import("@/routes/onboarding/verification");
                            return { Component };
                        },
                    },
                    {
                        path: "review",
                        handle: {
                            seo: {
                                title: "Review",
                                description: "Submit for approval",
                            }
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
                            }
                        },
                        lazy: async () => {
                            const { default: Component } =
                                await import("@/routes/onboarding/success");
                            return { Component };
                        },
                    },

                ],

            },
            // ─── ADMIN ROUTE ────────────────────────────────────────────
            {
                Component: RequireAdmin,
                children: [
                    {
                        path: "admin",
                        Component: AdminLayout,
                        children: [
                            {
                                index: true,
                                element: <Navigate to="overview" replace />,
                            },
                            {
                                path: "overview",
                                handle: {
                                    seo: {
                                        title: "admin Dashboard",
                                        description: "Manage your organizers and attendees.",
                                    }
                                },
                                lazy: async () => {
                                    const { default: Component } =
                                        await import("@/routes/admin/overview/index");
                                    return { Component };
                                },
                            },
                            {
                                path: "events",
                                children: [
                                    {
                                        index: true,
                                        handle: {
                                            seo: {
                                                title: "Admin Events | Eventra",
                                                description: "Every event on the platform. Moderate or remove any of them.",
                                            }
                                        },
                                        lazy: async () => {
                                            const { default: Component } =
                                                await import("@/routes/admin/events/index");
                                            return { Component };
                                        },
                                    },
                                    {
                                        path: ":eventId",
                                        handle: {
                                            seo: {
                                                title: "Admin Event Details | Eventra",
                                                description: "Review event details before moderation.",
                                            }
                                        },
                                        lazy: async () => {
                                            const { default: Component } =
                                                await import("@/routes/admin/events/detail");
                                            return { Component };
                                        },
                                    },
                                ]
                            },
                            {
                                path: "settings",
                                handle: {
                                    seo: {
                                        title: "admin settings",
                                        description: "Manage the organisers and attendees.",
                                    }
                                },
                                lazy: async () => {
                                    const { default: Component } =
                                        await import("@/routes/admin/settings/index");
                                    return { Component };
                                },
                            },
                            {
                                path: "refunds",
                                children: [
                                    {
                                        index: true,
                                        handle: {
                                            seo: {
                                                title: "Refunds & Disputes,",
                                                description: "Manage your refunds and disputes.",
                                            }
                                        },
                                        lazy: async () => {
                                            const { default: Component } =
                                                await import("@/routes/admin/refunds-dispute/index");
                                            return { Component };
                                        },
                                    },
                                    {
                                        path: ":requestId",
                                        handle: {
                                            seo: {
                                                title: "Refund Request Details",
                                                description: "View details of a refund request.",
                                            }
                                        },
                                        lazy: async () => {
                                            const { default: Component } =
                                                await import("@/routes/admin/refunds-detail/index");
                                            return { Component };
                                        },
                                    },
                                ],
                            },
                            {
                                path: "reports",
                                children: [
                                    {
                                        index: true,
                                        handle: {
                                            seo: {
                                                title: "Reports",
                                                description: "Flagged events and users, plus the full platform audit log.",
                                            }
                                        },
                                        lazy: async () => {
                                            const { default: Component } =
                                                await import("@/routes/admin/reports/index");
                                            return { Component };
                                        },
                                    },
                                    {
                                        path: ":flagId",
                                        handle: {
                                            seo: {
                                                title: "Report Details",
                                                description: "Review a flagged event or user.",
                                            }
                                        },
                                        lazy: async () => {
                                            const { default: Component } =
                                                await import("@/routes/admin/reports-list");
                                            return { Component };
                                        },
                                    },
                                    {
                                        path: ":flagId/details",
                                        handle: {
                                            seo: {
                                                title: "Report Details",
                                                description: "Review a flagged event or user.",
                                            }
                                        },
                                        lazy: async () => {
                                            const { default: Component } =
                                                await import("@/routes/admin/reports-detail");
                                            return { Component };
                                        },
                                    },
                                ],
                            },

                            {
                                path: "users",
                                children: [
                                    {
                                        index: true,
                                        handle: {
                                            seo: {
                                                title: "Users,",
                                                description: "Attendee accounts across the platform.",
                                            }
                                        },
                                        lazy: async () => {
                                            const { default: Component } =
                                                await import("@/routes/admin/users/index");
                                            return { Component };
                                        },
                                    },
                                    {
                                        path: ":id",
                                        handle: {
                                            seo: {
                                                title: "User details",
                                                description: "View a user's account, orders and status.",
                                            }
                                        },
                                        lazy: async () => {
                                            const { default: Component } =
                                                await import("@/routes/admin/users/details/index");
                                            return { Component };
                                        },
                                    },
                                ],
                            },




                        ]
                    },
                ],
            },


            // ─── END ADMIN ROUTE ────────────────────────────────────────

            {
                Component: RequireOrganizer,
                children: [
                    {
                        path: "dashboard",
                        Component: DashBoardLayout,
                        children: [
                            {
                                index: true,
                                element: <Navigate to="overview" replace />,
                            },
                            {
                                path: "overview",
                                handle: {
                                    seo: {
                                        title: "Organizer Dashboard",
                                        description: "Manage your events and organization.",
                                    }
                                },
                                lazy: async () => {
                                    const { default: Component } =
                                        await import("@/routes/dashboard/overview/index");
                                    return { Component };
                                },
                            },
                            {
                                path: "events",
                                children: [
                                    {
                                        index: true,
                                        handle: {
                                            seo: {
                                                title: "Events",
                                                description: "Manage your events, from draft to sold out.",
                                            }
                                        },
                                        lazy: async () => {
                                            const { default: Component } =
                                                await import("@/routes/dashboard/events/index");
                                            return { Component };
                                        },
                                    },
                                    {
                                        path: ":eventId",
                                        handle: {
                                            seo: {
                                                title: "Event Details",
                                                description: "Manage your event, view sales metrics, recent attendees, and quick actions.",
                                            }
                                        },
                                        lazy: async () => {
                                            const { default: Component } =
                                                await import("@/routes/main/organizer-event-details");
                                            return { Component };
                                        },
                                    },
                                ],
                            },
                            {
                                path: "attendees",
                                handle: {
                                    seo: {
                                        title: "Attendee",
                                        description: "Manage your events, from draft to sold out.",
                                    }
                                },
                                lazy: async () => {
                                    const { default: Component } =
                                        await import("@/routes/dashboard/attendees/index");
                                    return { Component };
                                },
                            },
                            // ─── Check-In Route ──────────────────────────────────────
                            {
                                path: "check-in",
                                lazy: async () => {
                                    const { default: Component } = await import("@/routes/dashboard/check-in/index");
                                    return { Component };
                                },
                                handle: {
                                    seo: {
                                        title: "Check-in | EVENTRA",
                                        description: "Check in attendees for your events.",
                                    },
                                },
                            },
                            {
                                path: "promotion",
                                handle: {
                                    seo: {
                                        title: "Promote",
                                        description: "Promote your shows.",
                                    }
                                },
                                lazy: async () => {
                                    const { default: Component } =
                                        await import("@/routes/dashboard/promotion");
                                    return { Component };
                                },
                            },
                            {
                                path: "payouts",
                                handle: {
                                    seo: {
                                        title: "Payouts",
                                        description: "Track earnings per event and your payout history.",
                                    }
                                },
                                lazy: async () => {
                                    const { default: Component } =
                                        await import("@/routes/dashboard/payouts");
                                    return { Component };
                                },
                            },
                            {
                                path: "settings",
                                handle: {
                                    seo: {
                                        title: "Settings",
                                        description: "Your organization profile, bank account and verification.",
                                    }
                                },
                                lazy: async () => {
                                    const { default: Component } =
                                        await import("@/routes/dashboard/settings");
                                    return { Component };
                                },
                            },
                            {
                                path: "create-event",
                                Component: CreateEventLayout,
                                children: [
                                    {
                                        path: "type",
                                        lazy: async () => {
                                            const { default: Component } =
                                                await import("@/routes/dashboard/create-event/type");
                                            return { Component };
                                        },
                                    },
                                    {
                                        path: "basics",
                                        lazy: async () => {
                                            const { default: Component } =
                                                await import("@/routes/dashboard/create-event/basics");
                                            return { Component };
                                        },
                                    },
                                    {
                                        path: "location",
                                        lazy: async () => {
                                            const { default: Component } =
                                                await import("@/routes/dashboard/create-event/location");
                                            return { Component };
                                        },
                                    },
                                    {
                                        path: "rsvp",
                                        lazy: async () => {
                                            const { default: Component } =
                                                await import("@/routes/dashboard/create-event/rsvp");
                                            return { Component };
                                        },
                                    },
                                    {
                                        path: "tickets",
                                        lazy: async () => {
                                            const { default: Component } =
                                                await import("@/routes/dashboard/create-event/tickets");
                                            return { Component };
                                        },
                                    },
                                    {
                                        path: "details",
                                        lazy: async () => {
                                            const { default: Component } =
                                                await import("@/routes/dashboard/create-event/details");
                                            return { Component };
                                        },
                                    },
                                    {
                                        path: "review",
                                        lazy: async () => {
                                            const { default: Component } =
                                                await import("@/routes/dashboard/create-event/review");
                                            return { Component };
                                        },
                                    },
                                ],
                            },
                        ]
                    },
                ],
            },
        ],
    },
] satisfies RouteObject[];
export const router = createBrowserRouter(routes);
