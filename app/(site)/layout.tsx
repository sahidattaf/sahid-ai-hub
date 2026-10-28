import Nav from "@/components/nav";
import Footer from "@/components/footer";
import CommandPalette from "@/components/command-palette";
import { SEARCH_INDEX } from "@/data/search-index";

// Public site chrome. The command palette ships a search index to the browser,
// so it is mounted here only and indexes public information exclusively.
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Nav />
      <div className="flex-1">{children}</div>
      <Footer />
      <CommandPalette items={SEARCH_INDEX} />
    </>
  );
}
