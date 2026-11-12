import { redirect } from "next/navigation";

// Static on purpose: the live Vercel dashboard is not public. Public live links
// come from the approved public data on /live-apps.
export default function VercelPage() {
  redirect("/live-apps");
}
