import { getLaunchDetails } from "@/use-cases/get-launch-details";
import client from "@/utils/apollo-client";
import { GET_LAUNCH_DETAILS } from "@/graphql/queries";

// Mock the Apollo Client
jest.mock("../../utils/apollo-client", () => ({
  query: jest.fn(),
}));

describe("getLaunchDetails", () => {
  const mockLaunchData = {
    id: "1",
    mission_name: "Test Mission",
    launch_date_local: "2023-05-01T12:00:00Z",
    rocket: { rocket_name: "Falcon 9", rocket_type: "v1.2" },
    launch_site: { site_name_long: "Cape Canaveral" },
    details: "Test mission details",
    links: {
      article_link: "https://example.com/article",
      video_link: "https://example.com/video",
      wikipedia: "https://example.com/wiki",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch launch details successfully", async () => {
    (client.query as jest.Mock).mockResolvedValueOnce({
      data: { launch: mockLaunchData },
    });

    const result = await getLaunchDetails("1");

    expect(client.query).toHaveBeenCalledWith({
      query: GET_LAUNCH_DETAILS,
      variables: { id: "1" },
    });
    expect(result).toEqual(mockLaunchData);
  });

  it("should throw an error if the query fails", async () => {
    const errorMessage = "Network error";
    (client.query as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await expect(getLaunchDetails("1")).rejects.toThrow(errorMessage);
  });
});
