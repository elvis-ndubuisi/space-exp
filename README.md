# Space Explorer - Technical Documentation

Space Explorer is a web application that displays information about upcoming SpaceX launches. It uses Next.js as the main framework, with TypeScript for type safety, and integrates with the SpaceX GraphQL API to fetch launch data.

## Tech Stack

- Next.js 13+ (App Router)
- TypeScript
- Apollo Client (for GraphQL queries)
- TanStack Table (for data table management)
- Tailwind CSS (for styling)
- Jest and React Testing Library (for unit testing)
- Playwright (for end-to-end testing)

## Project Structure

The project follows a typical Next.js structure with some additional directories for organization:

- /app: Contains the main application pages and API routes
- /components: Reusable React components
- /use-cases: Business logic and data fetching functions
- /types: TypeScript type definitions
- /graphql: GraphQL queries
- /utils: Utility functions and configurations
- /**tests**: Unit and integration tests
- /e2e: End-to-end tests using Playwright

## Key Components

### LaunchList

```ts
const LaunchList: React.FC<LaunchListProps> = ({ launches }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columnHelper = createColumnHelper<Launch>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = React.useMemo<ColumnDef<Launch, any>[]>(
    () => [
      columnHelper.accessor("mission_name", {
        cell: (info) => (
          <Link
            href={`/${info.row.original.id}`}
            className="text-blue-600 hover:underline"
          >
            {info.getValue()}
          </Link>
        ),
        header: () => <span>Mission</span>,
      }),
      columnHelper.accessor("launch_date_local", {
        cell: (info) => <CountdownTimer launchDate={info.getValue()} />,
        header: () => <span>Countdown</span>,
      }),
      columnHelper.accessor("rocket.rocket_name", {
        cell: (info) => info.getValue(),
        header: () => <span>Rocket</span>,
      }),
      columnHelper.accessor("launch_site.site_name_long", {
        cell: (info) => info.getValue() || "TBA",
        header: () => <span>Launch Site</span>,
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data: launches,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4">Upcoming SpaceX Launches</h1>
      <input
        type="text"
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="p-2 font-lg shadow border border-block w-full mb-4"
        placeholder="Search all columns..."
      />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-200">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-100">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          {/* <button
            className="px-4 py-2 font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button> */}
          <button
            className="px-4 py-2 font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 ml-2"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
        </div>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <div>
          <button
            className="px-4 py-2 font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 mr-2"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
          {/* <button
            className="px-4 py-2 font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button> */}
        </div>
      </div>
    </div>
  );
};
```

The `LaunchList` component is responsible for displaying the list of upcoming launches. It uses TanStack Table for sorting, filtering, and pagination. The component fetches launch data and renders it in a table format with clickable mission names that link to individual launch details pages.

### CountdownTimer

```ts
"use client";
import React from "react";

interface CountdownTimerProps {
  launchDate: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ launchDate }) => {
  const [timeLeft, setTimeLeft] = React.useState("");

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const launch = new Date(launchDate).getTime();
      const difference = launch - now;

      if (difference < 0) {
        clearInterval(timer);
        setTimeLeft("Launched");
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  return <span>{timeLeft}</span>;
};

export default CountdownTimer;
```

The `CountdownTimer` component displays a live countdown to each launch. It uses React's `useEffect` hook to update the countdown every second.

## API Routes

### Launches API

```ts
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
```

This API route fetches launch data from the SpaceX GraphQL API using Apollo Client and transforms it before sending it to the client. It handles error cases and returns a 500 status code if there's an issue fetching the data.

## Data Fetching

### getLaunches

```ts
import type { Launch } from "@/types/launch";

export async function getLaunches(): Promise<Launch[]> {
  const res = await fetch("http://localhost:3000/api/launches");
  if (!res.ok) {
    throw new Error("Failed to fetch launches");
  }
  const data = await res.json();
  return data.launches;
}
```

This function fetches the launch data from the internal API route.

### getLaunchDetails

```ts
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
```

This function fetches detailed information about a specific launch using the SpaceX GraphQL API.

## Routing

The application uses Next.js 13+ App Router for routing. The main routes are:

- /: Home page displaying the list of launches
- /[id]: Dynamic route for individual launch details
