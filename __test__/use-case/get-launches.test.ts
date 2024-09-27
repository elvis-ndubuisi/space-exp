import { getLaunches } from "@/use-cases/get-launches";
import type { Launch } from "@/types/launch";

// Mock global fetch
global.fetch = jest.fn();

describe("getLaunches", () => {
  const mockLaunches: Launch[] = [
    {
      id: "1",
      mission_name: "Test Mission 1",
      launch_date_local: "2023-05-01T12:00:00Z",
      rocket: { rocket_name: "Falcon 9", rocket_type: "v1.2" },
      launch_site: { site_name_long: "Cape Canaveral" },
      details: "Test mission details 1",
      links: {
        article_link: "https://example.com/article1",
        video_link: "https://example.com/video1",
        wikipedia: "https://example.com/wiki1",
      },
    },
    {
      id: "2",
      mission_name: "Test Mission 2",
      launch_date_local: "2023-05-15T14:00:00Z",
      rocket: { rocket_name: "Falcon Heavy", rocket_type: "v1.0" },
      launch_site: { site_name_long: "Kennedy Space Center" },
      details: "Test mission details 2",
      links: {
        article_link: "https://example.com/article2",
        video_link: "https://example.com/video2",
        wikipedia: "https://example.com/wiki2",
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch launches successfully", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ launches: mockLaunches }),
    });

    const result = await getLaunches();

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/launches"
    );
    expect(result).toEqual(mockLaunches);
  });

  it("should throw an error if the fetch fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(getLaunches()).rejects.toThrow("Failed to fetch launches");
  });

  it("should throw an error if the response is not ok", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(getLaunches()).rejects.toThrow("Failed to fetch launches");
  });
});
