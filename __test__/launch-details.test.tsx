import { NextRequest } from "next/server";
import { GET } from "@/app/api/launches/route";
import { ApolloClient } from "@apollo/client";

// jest.mock("@apollo/client", () => ({
//   ApolloClient: jest.fn(() => ({
//     query: jest.fn(() => ({
//       data: {
//         launches: [
//           {
//             id: "1",
//             mission_name: "Test Mission 1",
//             launch_date_local: "2023-05-01T12:00:00Z",
//             rocket: { rocket_name: "Falcon 9", rocket_type: "v1.2" },
//             launch_site: null,
//             details: "Test mission details",
//             links: {
//               article_link: "https://example.com/article",
//               video_link: "https://example.com/video",
//               wikipedia: "https://example.com/wiki",
//             },
//           },
//           {
//             id: "2",
//             mission_name: "Test Mission 2",
//             launch_date_local: "2023-05-15T14:00:00Z",
//             rocket: { rocket_name: "Falcon Heavy", rocket_type: "v1.0" },
//             launch_site: { site_name_long: "Kennedy Space Center" },
//             details: "Another test mission details",
//             links: {
//               article_link: "https://example.com/article2",
//               video_link: "https://example.com/video2",
//               wikipedia: "https://example.com/wiki2",
//             },
//           },
//         ],
//       },
//     })),
//   })),
//   InMemoryCache: jest.fn(),
// }));

jest.mock("@/utils/apollo-client", () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

// describe("/api/launches", () => {
//   it("returns transformed launches data with pagination", async () => {
//     const req = new NextRequest("http://localhost:3000/api/launches");

//     const res = await GET(req);
//     const data = await res.json();

//     expect(res.status).toBe(200);
//     expect(data).toEqual({
//       launches: [
//         {
//           id: "1",
//           mission_name: "Test Mission 1",
//           launch_date_local: "2023-05-01T12:00:00Z",
//           rocket: { rocket_name: "Falcon 9", rocket_type: "v1.2" },
//           launch_site: { site_name_long: "To Be Announced" },
//           details: "Test mission details",
//           links: {
//             article_link: "https://example.com/article",
//             video_link: "https://example.com/video",
//             wikipedia: "https://example.com/wiki",
//           },
//         },
//       ],
//       totalCount: 2,
//       page: 1,
//       pageSize: 1,
//     });
//   });

//   it("handles different page and pageSize parameters", async () => {
//     const req = new NextRequest(
//       "http://localhost:3000/api/launches?page=2&pageSize=1"
//     );
//     const res = await GET(req);
//     const data = await res.json();

//     expect(res.status).toBe(200);
//     expect(data.launches).toHaveLength(1);
//     expect(data.launches[0].id).toBe("2");
//     expect(data.page).toBe(2);
//     expect(data.pageSize).toBe(1);
//   });
// });

describe("/api/launches", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns transformed launches data", async () => {
    // Mock the Apollo client query response
    (ApolloClient.prototype.query as jest.Mock).mockResolvedValueOnce({
      data: {
        launches: [
          {
            id: "1",
            mission_name: "Test Mission 1",
            launch_date_local: "2023-05-01T12:00:00Z",
            rocket: { rocket_name: "Falcon 9", rocket_type: "v1.2" },
            launch_site: null,
            details: "Test mission details",
            links: {
              article_link: "https://example.com/article",
              video_link: "https://example.com/video",
              wikipedia: "https://example.com/wiki",
            },
          },
        ],
      },
    });

    const req = new NextRequest("http://localhost:3000/api/launches");

    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({
      launches: [
        {
          id: "1",
          mission_name: "Test Mission 1",
          launch_date_local: "2023-05-01T12:00:00Z",
          rocket: { rocket_name: "Falcon 9", rocket_type: "v1.2" },
          launch_site: { site_name_long: "To Be Announced" },
          details: "Test mission details",
          links: {
            article_link: "https://example.com/article",
            video_link: "https://example.com/video",
            wikipedia: "https://example.com/wiki",
          },
        },
      ],
    });
  });

  it("handles errors when fetching launches", async () => {
    // Mock the Apollo client query to throw an error
    (ApolloClient.prototype.query as jest.Mock).mockRejectedValueOnce(
      new Error("Test error")
    );

    const req = new NextRequest("http://localhost:3000/api/launches");

    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data).toEqual({
      error: "An error occurred while fetching launches",
    });
  });
});
