import LaunchList from "@/components/launch-list";
import { getLaunches } from "@/use-cases/get-launches";

export default async function Home() {
  const data = await getLaunches();
  return (
    <main className="font-[family-name:var(--font-geist-sans)] min-h-screen p-20">
      <LaunchList launches={data} />
    </main>
  );
}
