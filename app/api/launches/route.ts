import { NextResponse, NextRequest } from "next/server";
import { Launch, LaunchesData, LaunchesVars } from "@/types/launch";
import client from "@/utils/apollo-client";
import { GET_LAUNCHES } from "@/graphql/queries";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    const { data } = await client.query<LaunchesData, LaunchesVars>({
      query: GET_LAUNCHES,
      variables: { limit: 60 },
    });

    const transformedLaunches: Launch[] = data.launches.map((launch) => ({
      ...launch,
      launch_site: launch.launch_site || {
        site_name_long: "To Be Announced",
      },
    }));

    return NextResponse.json(
      { launches: transformedLaunches },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error fetching launches:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching launches" },
      { status: 500 }
    );
  }
}
