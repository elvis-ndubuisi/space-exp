import { GET_LAUNCH_DETAILS } from "@/graphql/queries";
import client from "@/utils/apollo-client";
import type { Launch } from "@/types/launch";

export async function getLaunchDetails(id: string): Promise<Launch> {
  const { data } = await client.query({
    query: GET_LAUNCH_DETAILS,
    variables: { id },
  });
  return data.launch;
}
