"use client";

import React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnDef,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Launch } from "../types/launch";
import CountdownTimer from "./countdown-timer";
import Link from "next/link";

interface LaunchListProps {
  launches: Launch[];
}

// const LaunchList: React.FC<LaunchListProps> = ({ launches }) => {
//   const [sorting, setSorting] = React.useState<SortingState>([]);
//   const [globalFilter, setGlobalFilter] = React.useState("");

//   const columnHelper = createColumnHelper<Launch>();

//   //* Defs columns config
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const columns = React.useMemo<ColumnDef<Launch, any>[]>(
//     () => [
//       columnHelper.accessor("mission_name", {
//         cell: (info) => info.getValue(),
//         header: () => <span>Mission</span>,
//       }),
//       columnHelper.accessor("launch_date_local", {
//         cell: (info) => new Date(info.getValue()).toLocaleDateString(),
//         header: () => <span>Date</span>,
//       }),
//       columnHelper.accessor("rocket.rocket_name", {
//         cell: (info) => info.getValue(),
//         header: () => <span>Rocket</span>,
//       }),
//       columnHelper.accessor("launch_site.site_name_long", {
//         cell: (info) => info.getValue() || "TBA",
//         header: () => <span>Launch Site</span>,
//       }),
//     ],
//     [columnHelper]
//   );

//   const table = useReactTable({
//     data: launches,
//     columns,
//     state: {
//       sorting,
//       globalFilter,
//     },
//     onSortingChange: setSorting,
//     onGlobalFilterChange: setGlobalFilter,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//   });

//   return (
//     <div className="container mx-auto px-4">
//       <h1 className="text-3xl font-bold mb-4">Upcoming SpaceX Launches</h1>
//       <input
//         type="text"
//         value={globalFilter ?? ""}
//         onChange={(e) => setGlobalFilter(e.target.value)}
//         className="p-2 font-lg shadow border border-block w-full mb-4 text-black placeholder:text-black"
//         placeholder="Search all columns..."
//       />
//       <div className="overflow-x-auto">
//         <table className="min-w-full">
//           <thead>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <tr key={headerGroup.id} className="bg-gray-200">
//                 {headerGroup.headers.map((header) => (
//                   <th
//                     key={header.id}
//                     onClick={header.column.getToggleSortingHandler()}
//                     className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
//                   >
//                     {flexRender(
//                       header.column.columnDef.header,
//                       header.getContext()
//                     )}
//                     {{
//                       asc: " 🔼",
//                       desc: " 🔽",
//                     }[header.column.getIsSorted() as string] ?? null}
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody>
//             {table.getRowModel().rows.map((row) => (
//               <tr
//                 key={row.id}
//                 className="border-b hover:bg-gray-50 hover:text-black"
//               >
//                 {row.getVisibleCells().map((cell) => (
//                   <td key={cell.id} className="px-4 py-2">
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

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

export default LaunchList;
