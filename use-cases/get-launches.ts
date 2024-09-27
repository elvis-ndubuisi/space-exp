import type { Launch } from "@/types/launch";

export async function getLaunches(): Promise<Launch[]> {
  const res = await fetch("http://localhost:3000/api/launches");
  if (!res.ok) {
    throw new Error("Failed to fetch launches");
  }
  const data = await res.json();
  return data.launches;
}
