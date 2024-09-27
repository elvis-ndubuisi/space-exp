import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import LaunchList from "@/components/launch-list";
import type { Launch } from "@/types/launch";

// Mock the CountdownTimer component
jest.mock("../components/countdown-timer", () => {
  return function MockCountdownTimer({ launchDate }: { launchDate: string }) {
    return <div data-testid="countdown-timer">{launchDate}</div>;
  };
});

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

const mockLaunches: Launch[] = [
  {
    id: "1",
    mission_name: "Mission 1",
    launch_date_local: "2023-05-01T12:00:00Z",
    rocket: { rocket_name: "Falcon 9", rocket_type: "v1.2" },
    launch_site: { site_name_long: "Cape Canaveral" },
    details: "Test mission details",
    links: {
      article_link: "https://example.com/article",
      video_link: "https://example.com/video",
      wikipedia: "https://example.com/wiki",
    },
  },
  {
    id: "2",
    mission_name: "Mission 2",
    launch_date_local: "2023-05-15T14:00:00Z",
    rocket: { rocket_name: "Falcon Heavy", rocket_type: "v1.0" },
    launch_site: { site_name_long: "Kennedy Space Center" },
    details: "Another test mission details",
    links: {
      article_link: "https://example.com/article2",
      video_link: "https://example.com/video2",
      wikipedia: "https://example.com/wiki2",
    },
  },
];

describe("LaunchList", () => {
  it("renders launch items correctly", () => {
    render(<LaunchList launches={mockLaunches} />);

    expect(screen.getByText("Mission 1")).toBeInTheDocument();
    expect(screen.getByText("Mission 2")).toBeInTheDocument();
    expect(screen.getByText("Falcon 9")).toBeInTheDocument();
    expect(screen.getByText("Falcon Heavy")).toBeInTheDocument();
    expect(screen.getByText("Cape Canaveral")).toBeInTheDocument();
    expect(screen.getByText("Kennedy Space Center")).toBeInTheDocument();
  });

  it("renders countdown timers", () => {
    render(<LaunchList launches={mockLaunches} />);

    const countdownTimers = screen.getAllByTestId("countdown-timer");
    expect(countdownTimers).toHaveLength(2);
    expect(countdownTimers[0]).toHaveTextContent("2023-05-01T12:00:00Z");
    expect(countdownTimers[1]).toHaveTextContent("2023-05-15T14:00:00Z");
  });

  it("filters launches based on search input", () => {
    render(<LaunchList launches={mockLaunches} />);

    const searchInput = screen.getByPlaceholderText("Search all columns...");
    fireEvent.change(searchInput, { target: { value: "Falcon Heavy" } });

    expect(screen.getByText("Mission 2")).toBeInTheDocument();
    expect(screen.queryByText("Mission 1")).not.toBeInTheDocument();
  });

  it("sorts launches when clicking on column headers", () => {
    render(<LaunchList launches={mockLaunches} />);

    const missionHeader = screen.getByText("Mission");
    fireEvent.click(missionHeader);

    const rows = screen.getAllByRole("row");
    const firstRowCells = within(rows[1]).getAllByRole("cell");
    const secondRowCells = within(rows[2]).getAllByRole("cell");

    expect(firstRowCells[0]).toHaveTextContent("Mission 1");
    expect(secondRowCells[0]).toHaveTextContent("Mission 2");

    fireEvent.click(missionHeader);

    expect(firstRowCells[0]).toHaveTextContent("Mission 1");
    expect(secondRowCells[0]).toHaveTextContent("Mission 2");
  });

  it("renders pagination controls", () => {
    render(<LaunchList launches={mockLaunches} />);

    expect(screen.getByText("1 of 1")).toBeInTheDocument();
    expect(screen.getByText(">")).toBeInTheDocument();
    expect(screen.getByText(">>")).toBeInTheDocument();
    expect(screen.getByText("<")).toBeInTheDocument();
    expect(screen.getByText("<<")).toBeInTheDocument();
  });

  it("disables pagination controls when on first/last page", () => {
    render(<LaunchList launches={mockLaunches} />);

    expect(screen.getByText("<<")).toBeDisabled();
    expect(screen.getByText("<")).toBeDisabled();
    expect(screen.getByText(">")).toBeDisabled();
    expect(screen.getByText(">>")).toBeDisabled();
  });

  it("renders mission names as links", () => {
    render(<LaunchList launches={mockLaunches} />);

    const missionLinks = screen.getAllByRole("link");
    expect(missionLinks).toHaveLength(2);
    expect(missionLinks[0]).toHaveAttribute("href", "/1");
    expect(missionLinks[1]).toHaveAttribute("href", "/2");
  });
});
