import CountdownTimer from "@/components/countdown-timer";
import Link from "next/link";
import { getLaunchDetails } from "@/use-cases/get-launch-details";

export default async function Page({ params }: { params: { id: string } }) {
  const launch = await getLaunchDetails(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{launch.mission_name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Launch Details</h2>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(launch.launch_date_local).toLocaleString()}
          </p>
          <p>
            <strong>Countdown:</strong>{" "}
            <CountdownTimer launchDate={launch.launch_date_local} />
          </p>
          <p>
            <strong>Rocket:</strong> {launch.rocket.rocket_name} (
            {launch.rocket.rocket_type})
          </p>
          <p>
            <strong>Launch Site:</strong> {launch?.launch_site?.site_name_long}
          </p>
          <p className="mt-4">
            <strong>Mission Details:</strong>{" "}
            {launch.details || "No details available."}
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Links</h2>
          <ul className="list-disc list-inside">
            {launch.links.article_link && (
              <li>
                <a
                  href={launch.links.article_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Article
                </a>
              </li>
            )}
            {launch.links.video_link && (
              <li>
                <a
                  href={launch.links.video_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Video
                </a>
              </li>
            )}
            {launch.links.wikipedia && (
              <li>
                <a
                  href={launch.links.wikipedia}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Wikipedia
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <Link
        href="/"
        className="mt-8 inline-block px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        Back to Launches
      </Link>
    </div>
  );
}
