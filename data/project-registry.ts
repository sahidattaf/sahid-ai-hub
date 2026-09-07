export type Status = "Live" | "Repo" | "Prototype" | "Planning";
export type Visibility = "Public" | "Private" | "Hybrid";
export type Priority = "P0" | "P1" | "P2" | "P3";
export type AssetType = "Venture" | "Product" | "Development" | "Client" | "Infrastructure" | "Media Workstream" | "Research" | "Legacy";
export type OperatingStatus = "Active Build" | "Active / Scale" | "Active / Development" | "Active Client" | "Active Infrastructure" | "Pilot" | "Controlled Build" | "Workstream" | "Incubator" | "Maintain" | "Parked";
export type EvidenceStatus = "Verified" | "Partial" | "Needs Verification";
export type CommercialStatus = "Revenue Operating" | "Commercialization" | "Pilot" | "Pre-Revenue" | "Internal" | "Not Applicable";
export type RevenuePotential = "SaaS" | "Platform" | "Marketplace" | "Client Site" | "Portfolio" | "Operating Business" | "Development" | "Media" | "Consumer Brand";

export interface RegistryProject {
  id: string;
  name: string;
  zone: string;
  portfolioStream: string;
  assetType: AssetType;
  status: Status;
  operatingStatus: OperatingStatus;
  visibility: Visibility;
  description: string;
  websiteUrl?: string;
  githubUrl?: string;
  notionUrl?: string;
  vercelProject?: string;
  parentProject?: string;
  category: string;
  stack: string[];
  owner: string;
  priority: Priority;
  revenuePotential: RevenuePotential;
  commercialStatus: CommercialStatus;
  evidenceStatus: EvidenceStatus;
  ownerGate?: string;
  nextDecision?: string;
  nextAction: string;
  lastReviewed: string;
  tags: string[];
}

export const ZONE_ORDER = ["AI Business", "Hospitality", "Real Estate / Kai Korsou", "Digital & Education", "Infrastructure", "Incubator & Proof"];

export const ZONE_DESCRIPTIONS: Record<string, string> = {
  "AI Business": "Commercial AI ventures, products, media and service workstreams.",
  Hospitality: "Operating hospitality businesses, client delivery and reusable Hospitality OS products.",
  "Real Estate / Kai Korsou": "Owner-side development, property command centers and investment-readiness systems.",
  "Digital & Education": "Controlled education, community and digital platform initiatives.",
  Infrastructure: "Internal portfolio operating systems, registries and technical control layers.",
  "Incubator & Proof": "Early-stage ventures, proof-of-work products and parked R&D that do not compete with the Top 3.",
};

const NOTION = {
  gpti: "https://app.notion.com/p/33aa269fc947819cad7ed9a4aee70292",
  kai: "https://app.notion.com/p/9539322acee64e3da342580a18c6b691",
  hospitality: "https://app.notion.com/p/3c6a269fc9478154b7d6e79e6d5e84ad",
  bossa: "https://app.notion.com/p/05c90e89cc9e43d7a02690186d7e6e9f",
  pbh: "https://app.notion.com/p/31fa269fc9478011908edfec3ac41aef",
  aiNews: "https://app.notion.com/p/2c4e2879910e487d989c0a64706c6498",
  adminFlow: "https://app.notion.com/p/3a1a269fc94781bc9542da75b24db29a",
  botanica: "https://app.notion.com/p/3c9a269fc94781e0b3ffdfa4754086db",
  seaHorizon: "https://app.notion.com/p/3c6a269fc94781e68876e4498c84c0bc",
  sahidOs: "https://app.notion.com/p/321a269fc9478055bf61d987b351260d",
};

export const REGISTRY: RegistryProject[] = [
  { id:"gpt-innovation-os", name:"GPT Innovation by Attaf", zone:"AI Business", portfolioStream:"AI Systems & GPT Products", assetType:"Venture", status:"Live", operatingStatus:"Active Build", visibility:"Public", description:"Commercial AI services and product platform focused first on Curaçao hospitality operators.", websiteUrl:"https://gpt-os-website.vercel.app/", githubUrl:"https://github.com/sahidattaf/gpt-innovation-os", notionUrl:NOTION.gpti, vercelProject:"gpt-os-website", category:"AI Business", stack:["Next.js","TypeScript","Vercel"], owner:"Sahid Attaf", priority:"P0", revenuePotential:"Platform", commercialStatus:"Commercialization", evidenceStatus:"Verified", ownerGate:"GPT Innovation G0-G8", nextDecision:"Approve external sales only after offer package, proof and pricing pass final review", nextAction:"Complete offer package, proof, pricing and first-customer readiness", lastReviewed:"2026-09-07", tags:["AI","Hospitality","Commercialization"] },
  { id:"bossa-asado-i-mar", name:"BOSSA Asado i Mar", zone:"Hospitality", portfolioStream:"Hospitality", assetType:"Venture", status:"Live", operatingStatus:"Active / Scale", visibility:"Public", description:"Operating fire-grill hospitality business and real-world proof environment for Hospitality OS.", websiteUrl:"https://bossa-asado-i-mar.vercel.app/", githubUrl:"https://github.com/sahidattaf/BOSSA-ASADO-I-MAR", notionUrl:NOTION.bossa, vercelProject:"bossa-asado-i-mar", category:"Hospitality Business", stack:["Next.js","TypeScript","Vercel"], owner:"Sahid Attaf", priority:"P0", revenuePotential:"Operating Business", commercialStatus:"Revenue Operating", evidenceStatus:"Verified", nextDecision:"Continue controlled menu and operating-system rollout through owner gates", nextAction:"Scale operating proof while preserving menu and publication controls", lastReviewed:"2026-09-07", tags:["Hospitality","Restaurant","Proof"] },
  { id:"hospitality-os", name:"Hospitality OS", zone:"Hospitality", portfolioStream:"Hospitality / AI Systems", assetType:"Product", status:"Prototype", operatingStatus:"Pilot", visibility:"Private", description:"Reusable hospitality operating system informed by BOSSA and controlled client delivery.", githubUrl:"https://github.com/sahidattaf/hospitality-os-plugin", notionUrl:NOTION.hospitality, category:"AI Operating System", stack:["TypeScript","Notion","AI"], owner:"Sahid Attaf", priority:"P1", revenuePotential:"SaaS", commercialStatus:"Pilot", evidenceStatus:"Partial", parentProject:"gpt-innovation-os", nextAction:"Convert validated BOSSA and Sea Horizon workflows into reusable product modules", lastReviewed:"2026-09-07", tags:["Hospitality","AI OS","Product"] },
  { id:"bossa-ai-os", name:"BOSSA AI OS", zone:"Hospitality", portfolioStream:"Hospitality / AI Systems", assetType:"Product", status:"Live", operatingStatus:"Pilot", visibility:"Public", description:"BOSSA-specific AI operating layer for menu intelligence, evidence control and business automation.", websiteUrl:"https://bossa-ai-os.vercel.app/", githubUrl:"https://github.com/sahidattaf/bossa-ai-os", notionUrl:NOTION.bossa, vercelProject:"bossa-ai-os", category:"AI Operating System", stack:["Next.js","TypeScript","Vercel"], owner:"Sahid Attaf", priority:"P1", revenuePotential:"SaaS", commercialStatus:"Pilot", evidenceStatus:"Verified", parentProject:"hospitality-os", nextAction:"Keep BOSSA adapters inside approved read-only and owner-gated boundaries", lastReviewed:"2026-09-07", tags:["BOSSA","Hospitality","AI OS"] },
  { id:"sea-horizon", name:"Sea Horizon Apartments", zone:"Hospitality", portfolioStream:"Hospitality / Client Delivery", assetType:"Client", status:"Prototype", operatingStatus:"Active Client", visibility:"Private", description:"Controlled Hospitality OS client engagement with owner command center, KPI framework and delivery roadmap.", notionUrl:NOTION.seaHorizon, category:"Client Delivery", stack:["Notion","Hospitality OS"], owner:"Sahid Attaf", priority:"P1", revenuePotential:"Client Site", commercialStatus:"Revenue Operating", evidenceStatus:"Verified", parentProject:"hospitality-os", nextAction:"Continue approved client rollout; do not invent a repository until one is authorized", lastReviewed:"2026-09-07", tags:["Client","Hospitality","Mambo Beach"] },
  { id:"kai-korsou-waterfront", name:"Kai Kòrsou Waterfront", zone:"Real Estate / Kai Korsou", portfolioStream:"Real Estate & Resort Developments", assetType:"Development", status:"Prototype", operatingStatus:"Active / Development", visibility:"Private", description:"Owner-side waterfront development program focused on evidence, investor readiness and gated development planning.", githubUrl:"https://github.com/sahidattaf/kai-korsou-waterfront-development", notionUrl:NOTION.kai, category:"Waterfront Development", stack:["Notion","GitHub","Development Planning"], owner:"Sahid Attaf", priority:"P1", revenuePotential:"Development", commercialStatus:"Pre-Revenue", evidenceStatus:"Partial", nextAction:"Advance investor-readiness evidence and controlled development gates", lastReviewed:"2026-09-07", tags:["Real Estate","Waterfront","Curaçao"] },
  { id:"kai-korsou-command-center", name:"Kai Kòrsou Command Center", zone:"Real Estate / Kai Korsou", portfolioStream:"Real Estate & Resort Developments", assetType:"Infrastructure", status:"Prototype", operatingStatus:"Active Infrastructure", visibility:"Private", description:"Technical command-center layer supporting the Kai Kòrsou waterfront development.", githubUrl:"https://github.com/sahidattaf/kai-korsou-command-center", notionUrl:NOTION.kai, category:"Development Command Center", stack:["Next.js","TypeScript","Notion"], owner:"Sahid Attaf", priority:"P2", revenuePotential:"Portfolio", commercialStatus:"Internal", evidenceStatus:"Verified", parentProject:"kai-korsou-waterfront", nextAction:"Keep technical routing aligned to controlled waterfront evidence", lastReviewed:"2026-09-07", tags:["Command Center","Real Estate","Infrastructure"] },
  { id:"pietermaai-business-hub", name:"Pietermaai Business Hub", zone:"Real Estate / Kai Korsou", portfolioStream:"Real Estate & Resort Developments", assetType:"Development", status:"Prototype", operatingStatus:"Controlled Build", visibility:"Private", description:"Mixed-use commercial property program with owner KPI, leasing and verification workflows.", githubUrl:"https://github.com/sahidattaf/pietermaai-business-hub", notionUrl:NOTION.pbh, category:"Commercial Real Estate", stack:["Notion","GitHub"], owner:"Sahid Attaf", priority:"P1", revenuePotential:"Development", commercialStatus:"Pre-Revenue", evidenceStatus:"Partial", ownerGate:"PBH-V2-E", nextAction:"Complete Owner Verification Session before automation expansion", lastReviewed:"2026-09-07", tags:["Pietermaai","Property","Commercial"] },
  { id:"digital-korsou", name:"Digital Kòrsou — Boske di AI", zone:"Digital & Education", portfolioStream:"Digital Platforms & Education", assetType:"Venture", status:"Prototype", operatingStatus:"Pilot", visibility:"Public", description:"Controlled AI education and workforce/community pilot program.", githubUrl:"https://github.com/sahidattaf/digital-korsou-boske-ai", category:"AI Education", stack:["GitHub","AI Education"], owner:"Sahid Attaf", priority:"P1", revenuePotential:"Platform", commercialStatus:"Pilot", evidenceStatus:"Partial", ownerGate:"DK-IMPACTO-SEND", nextAction:"Prepare the September pilot while preserving partner and publication gates", lastReviewed:"2026-09-07", tags:["Education","Curaçao","AI"] },
  { id:"ai-weekly-news", name:"AI Weekly News", zone:"AI Business", portfolioStream:"Digital Platforms & Education", assetType:"Media Workstream", status:"Planning", operatingStatus:"Workstream", visibility:"Public", description:"Controlled media and acquisition workstream supporting the broader AI business ecosystem.", notionUrl:NOTION.aiNews, category:"AI Media", stack:["YouTube","Notion"], owner:"Sahid Attaf", priority:"P2", revenuePotential:"Media", commercialStatus:"Pre-Revenue", evidenceStatus:"Verified", parentProject:"gpt-innovation-os", nextAction:"Produce weekly AI news without creating a second Active Build", lastReviewed:"2026-09-07", tags:["Media","YouTube","AI News"] },
  { id:"adminflow-global-os", name:"AdminFlow Global OS", zone:"AI Business", portfolioStream:"AI Systems & GPT Products", assetType:"Product", status:"Planning", operatingStatus:"Incubator", visibility:"Private", description:"Administrative operations product for invoices, expenses, payments and document workflows.", notionUrl:NOTION.adminFlow, category:"Business Operations AI", stack:["Notion","AI"], owner:"Sahid Attaf", priority:"P2", revenuePotential:"SaaS", commercialStatus:"Pre-Revenue", evidenceStatus:"Verified", parentProject:"gpt-innovation-os", nextAction:"Keep incubated until the active commercialization gates permit expansion", lastReviewed:"2026-09-07", tags:["Admin","Automation","AI"] },
  { id:"sahid-botanica", name:"SĀHID BOTANICA", zone:"Incubator & Proof", portfolioStream:"Consumer Brands", assetType:"Venture", status:"Planning", operatingStatus:"Incubator", visibility:"Private", description:"Owner-controlled Curaçao-founded beauty brand currently in controlled preparation and brand-screening stage.", notionUrl:NOTION.botanica, category:"Consumer Brand", stack:["Notion"], owner:"Sahid Attaf", priority:"P2", revenuePotential:"Consumer Brand", commercialStatus:"Pre-Revenue", evidenceStatus:"Verified", nextAction:"Remain preparation-only pending the next explicit owner gate", lastReviewed:"2026-09-07", tags:["Beauty","Brand","Incubator"] },
  { id:"reflexhon-global", name:"Reflexhon Global", zone:"Digital & Education", portfolioStream:"Digital Platforms & Education", assetType:"Venture", status:"Repo", operatingStatus:"Incubator", visibility:"Public", description:"Digital platform initiative retained as an incubator rather than a founder Top 3 build.", githubUrl:"https://github.com/sahidattaf/reflexhon-global", category:"Digital Platform", stack:["GitHub"], owner:"Sahid Attaf", priority:"P2", revenuePotential:"Platform", commercialStatus:"Pre-Revenue", evidenceStatus:"Partial", nextAction:"Reconcile current scope and command-center ownership before further build", lastReviewed:"2026-09-07", tags:["Digital","Platform","Incubator"] },
  { id:"sahid-ai-hub", name:"Sahid AI Hub", zone:"Infrastructure", portfolioStream:"Portfolio Infrastructure", assetType:"Infrastructure", status:"Live", operatingStatus:"Active Infrastructure", visibility:"Public", description:"Technical portfolio registry and dashboard connecting projects, repositories, deployments and evidence routing.", githubUrl:"https://github.com/sahidattaf/sahid-ai-hub", vercelProject:"sahid-ai-hub", category:"Portfolio Infrastructure", stack:["Next.js 16","TypeScript","Tailwind CSS v4","Vercel"], owner:"Sahid Attaf", priority:"P1", revenuePotential:"Portfolio", commercialStatus:"Internal", evidenceStatus:"Verified", nextAction:"Complete Portfolio Registry v2 and stop for owner review before merge or deploy", lastReviewed:"2026-09-07", tags:["Portfolio","Registry","Infrastructure"] },
  { id:"sahid-ai-operating-system", name:"Sahid AI Operating System", zone:"Infrastructure", portfolioStream:"Portfolio Infrastructure", assetType:"Infrastructure", status:"Repo", operatingStatus:"Active Infrastructure", visibility:"Private", description:"Internal operating and control layer for portfolio routing and governance.", githubUrl:"https://github.com/sahidattaf/sahid-ai-operating-system", notionUrl:NOTION.sahidOs, category:"Operating System", stack:["Notion","GitHub"], owner:"Sahid Attaf", priority:"P1", revenuePotential:"Portfolio", commercialStatus:"Internal", evidenceStatus:"Verified", nextAction:"Maintain governance separation between strategy, execution and technical evidence", lastReviewed:"2026-09-07", tags:["Operating System","Governance","Infrastructure"] },
  { id:"jobhunter-gpt", name:"JobHunterGPT", zone:"Incubator & Proof", portfolioStream:"AI Systems & GPT Products", assetType:"Product", status:"Live", operatingStatus:"Maintain", visibility:"Public", description:"AI job-search proof-of-work product retained as portfolio evidence rather than an active founder build.", websiteUrl:"https://jobhunter-gpt-gamma.vercel.app/", githubUrl:"https://github.com/sahidattaf/jobhunter-gpt", vercelProject:"jobhunter-gpt", category:"Career Tech", stack:["Next.js","TypeScript","Vercel"], owner:"Sahid Attaf", priority:"P3", revenuePotential:"SaaS", commercialStatus:"Pre-Revenue", evidenceStatus:"Verified", nextAction:"Maintain as proof; do not displace current Top 3 priorities", lastReviewed:"2026-09-07", tags:["GPT","Career","Proof"] },
  { id:"dreamscape", name:"Dreamscape", zone:"Incubator & Proof", portfolioStream:"R&D / Experimental", assetType:"Research", status:"Repo", operatingStatus:"Parked", visibility:"Public", description:"Creative AI research project parked until portfolio capacity is explicitly reopened.", githubUrl:"https://github.com/sahidattaf/dreamscape", category:"Creative AI", stack:["GitHub"], owner:"Sahid Attaf", priority:"P3", revenuePotential:"SaaS", commercialStatus:"Pre-Revenue", evidenceStatus:"Partial", nextAction:"Keep parked; preserve repository as R&D evidence", lastReviewed:"2026-09-07", tags:["R&D","Creative AI","Parked"] },
];

function isHttpUrl(value: string): boolean {
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:"; } catch { return false; }
}

export function validateRegistry(projects: RegistryProject[] = REGISTRY): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const project of projects) {
    if (!project.id || !project.name || !project.portfolioStream || !project.assetType || !project.owner || !project.nextAction || !project.lastReviewed) errors.push(`${project.id || "unknown"}: missing required field`);
    if (ids.has(project.id)) errors.push(`${project.id}: duplicate id`);
    ids.add(project.id);
    for (const [label, value] of [["websiteUrl", project.websiteUrl], ["githubUrl", project.githubUrl], ["notionUrl", project.notionUrl]] as const) if (value && !isHttpUrl(value)) errors.push(`${project.id}: invalid ${label}`);
    if (project.parentProject && project.parentProject === project.id) errors.push(`${project.id}: cannot parent itself`);
  }
  for (const project of projects) if (project.parentProject && !ids.has(project.parentProject)) errors.push(`${project.id}: unknown parent ${project.parentProject}`);
  return errors;
}

export const REGISTRY_VALIDATION_ERRORS = validateRegistry();
if (REGISTRY_VALIDATION_ERRORS.length) throw new Error(`Portfolio registry validation failed:\n${REGISTRY_VALIDATION_ERRORS.join("\n")}`);

export function computeHealthScore(project: RegistryProject): number {
  let score = 0;
  if (project.evidenceStatus === "Verified") score += 20;
  if (project.notionUrl || project.githubUrl) score += 20;
  if (project.nextAction) score += 20;
  if (project.lastReviewed) score += 20;
  if (project.priority === "P0" || project.priority === "P1") score += 20;
  return Math.min(score, 100);
}

export function getRegistryStats() {
  return {
    total: REGISTRY.length,
    active: REGISTRY.filter((p) => p.operatingStatus.startsWith("Active") || p.operatingStatus === "Pilot" || p.operatingStatus === "Controlled Build").length,
    p0p1: REGISTRY.filter((p) => p.priority === "P0" || p.priority === "P1").length,
    needsEvidence: REGISTRY.filter((p) => p.evidenceStatus !== "Verified").length,
  };
}
