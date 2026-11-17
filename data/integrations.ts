// Public summary: platform, category and status only. No environment variable
// names, data lists, security rules or sprint plans are published.

export type IntegrationStatus = "Active" | "Planned";
export type IntegrationCategory = "AI" | "Data" | "Ops" | "Communication";

export interface Integration {
  name: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
}

export const INTEGRATIONS: Integration[] = [
  { name: "GitHub", category: "Data", status: "Planned" },
  { name: "Vercel", category: "Ops", status: "Planned" },
  { name: "Notion", category: "Data", status: "Planned" },
  { name: "Claude", category: "AI", status: "Planned" },
  { name: "OpenAI", category: "AI", status: "Active" },
  { name: "Google Sheets", category: "Data", status: "Planned" },
  { name: "Analytics", category: "Ops", status: "Planned" },
  { name: "Email", category: "Communication", status: "Planned" },
];

export const CATEGORY_ORDER: IntegrationCategory[] = ["AI", "Data", "Ops", "Communication"];

export const CATEGORY_DESCRIPTIONS: Record<IntegrationCategory, string> = {
  AI: "Language model platforms.",
  Data: "Data sources and storage.",
  Ops: "Deployment and observability.",
  Communication: "Outbound channels.",
};
