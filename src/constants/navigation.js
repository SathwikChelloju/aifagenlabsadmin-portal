import {
  LayoutDashboard,
  LayoutGrid,
  Users,
  CreditCard,
  Briefcase,
  Cpu,
  ShieldAlert,
  Settings,
} from "lucide-react";

export const NAVIGATION_GROUPS = [
  {
    group: "MENU",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      {
        id: "candidates-recruiters",
        label: "Candidates & Recruiters",
        icon: Users,
        isParent: true,
        children: [
          {
            id: "users",
            label: "Users / Candidates",
            badge: "4.8k",
          },
          {
            id: "recruiters",
            label: "Recruiters",
            badge: "12",
          },
        ],
      },
      { id: "payments", label: "Payments", icon: CreditCard },
    ],
  },
  {
    group: "CONTENT",
    items: [
      { id: "jobs", label: "Jobs", icon: Briefcase },
    ],
  },
  {
    group: "OPERATIONS",
    items: [
      { id: "ai-usage", label: "AI Usage", icon: Cpu },
      { id: "audit-logs", label: "Audit Logs", icon: ShieldAlert },
      { id: "overview", label: "Overview", icon: LayoutGrid },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
];
