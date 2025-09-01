import {
  RiDashboardLine,
  RiGlobalLine,
  RiBarChart2Line,
  RiCommunityLine,
  RiAddLine,
  RiBankCardLine,
  RiPriceTag3Line,
  RiBillLine,
  RiCouponLine,
  RiTeamLine,
  RiShieldKeyholeLine,
  RiSettings3Line,
  RiToggleLine,
  RiPlugLine,
  RiDatabase2Line,
  RiCustomerService2Line,
  RiBookOpenLine,
  RiMegaphoneLine,
  RiFeedbackLine,
  RiCodeSSlashLine,
  RiShareForwardLine,
  RiFileList3Line,
  RiUserSettingsLine,
  RiNotification3Line,
  RemixiconComponentType,
} from "@remixicon/react";

type SubSideNavType = {
  title: string;
  url: string;
  icon: RemixiconComponentType;
};

type SideNavType = {
  id: string;
  url: string;
  title?: string;
  items: SubSideNavType[];
};

enum PlatformSideNavGroup {
  MAIN = "main",
  TENANTS = "tenants",
  BILLING = "billing",
  USERS = "users",
  SYSTEM = "system",
  SUPPORT = "support",
  DEVTOOLS = "devtools",
  SETTINGS = "settings",
}

export const enablePlatformSideNav: Record<string, boolean> = {
  [PlatformSideNavGroup.MAIN]: true,
  [PlatformSideNavGroup.USERS]: true,
};

export const initialPlaformSideNavState: Record<string, boolean> = {
  [PlatformSideNavGroup.USERS]: true,
};

export const platformSideNav: SideNavType[] = [
  {
    id: PlatformSideNavGroup.MAIN,
    url: "#",
    items: [
      {
        title: "Dashboard",
        url: "/platform/dashboard",
        icon: RiDashboardLine,
      },
      {
        title: "Domains",
        url: "/platform/domains",
        icon: RiGlobalLine,
      },
      {
        title: "Reports",
        url: "/platform/reports/usage",
        icon: RiBarChart2Line,
      },
    ],
  },
  {
    id: PlatformSideNavGroup.TENANTS,
    title: "Tenants",
    url: "/platform/tenants",
    items: [
      {
        title: "All tenants",
        url: "/platform/tenants",
        icon: RiCommunityLine,
      },
      {
        title: "Create tenant",
        url: "/platform/tenants/new",
        icon: RiAddLine,
      },
    ],
  },
  {
    id: PlatformSideNavGroup.BILLING,
    title: "Billing",
    url: "/platform/billing",
    items: [
      {
        title: "Overview",
        url: "/platform/billing",
        icon: RiBankCardLine,
      },
      {
        title: "Plans",
        url: "/platform/billing/plans",
        icon: RiPriceTag3Line,
      },
      {
        title: "Invoices",
        url: "/platform/billing/invoices",
        icon: RiBillLine,
      },
      {
        title: "Coupons",
        url: "/platform/billing/coupons",
        icon: RiCouponLine,
      },
    ],
  },
  {
    id: PlatformSideNavGroup.USERS,
    title: "Users & Roles",
    url: "/platform/users",
    items: [
      {
        title: "Users",
        url: "/platform/users",
        icon: RiTeamLine,
      },
      {
        title: "Roles",
        url: "/platform/roles",
        icon: RiShieldKeyholeLine,
      },
    ],
  },
  {
    id: PlatformSideNavGroup.SYSTEM,
    title: "System Management",
    url: "/platform/system",
    items: [
      {
        title: "Settings",
        url: "/platform/system/settings",
        icon: RiSettings3Line,
      },
      {
        title: "Features",
        url: "/platform/system/features",
        icon: RiToggleLine,
      },
      {
        title: "Integrations",
        url: "/platform/system/integrations",
        icon: RiPlugLine,
      },
      {
        title: "Backups",
        url: "/platform/system/backups",
        icon: RiDatabase2Line,
      },
    ],
  },
  {
    id: PlatformSideNavGroup.SUPPORT,
    title: "Support",
    url: "/platform/support",
    items: [
      {
        title: "Tickets",
        url: "/platform/support/tickets",
        icon: RiCustomerService2Line,
      },
      {
        title: "Knowledge Base",
        url: "/platform/support/knowledge-base",
        icon: RiBookOpenLine,
      },
      {
        title: "Announcements",
        url: "/platform/support/announcements",
        icon: RiMegaphoneLine,
      },
      {
        title: "Feedback",
        url: "/platform/support/feedback",
        icon: RiFeedbackLine,
      },
    ],
  },
  {
    id: PlatformSideNavGroup.DEVTOOLS,
    title: "Developer Tools",
    url: "/platform/dev",
    items: [
      {
        title: "API Docs",
        url: "/platform/dev/api-docs",
        icon: RiCodeSSlashLine,
      },
      {
        title: "Webhooks",
        url: "/platform/dev/webhooks",
        icon: RiShareForwardLine,
      },
      {
        title: "Logs",
        url: "/platform/dev/logs",
        icon: RiFileList3Line,
      },
    ],
  },
  {
    id: PlatformSideNavGroup.SETTINGS,
    title: "Settings",
    url: "/platform/settings",
    items: [
      {
        title: "Profile",
        url: "/platform/settings/profile",
        icon: RiUserSettingsLine,
      },
      {
        title: "Notifications",
        url: "/platform/settings/notifications",
        icon: RiNotification3Line,
      },
    ],
  },
];
