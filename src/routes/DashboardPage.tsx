import { mockActivities } from "../data/mockActivities";
import type { Activity } from "../domain/types";
import { HiMoon, HiPuzzlePiece } from "react-icons/hi2";
import { TennisIcon, PadelIcon } from "../components/sportIcons";
import ActivityCard from "../components/ActivityCard";

// Helper functions
const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) return `Today at ${timeStr}`;
  if (isTomorrow) return `Tomorrow at ${timeStr}`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const getSportIcon = (sport: Activity["sport"]) => {
  const sportIcons = {
    tennis: <TennisIcon className="w-5 h-5" />,
    padel: <PadelIcon className="w-5 h-5" />,
  };
  return sportIcons[sport] || <TennisIcon className="w-5 h-5" />;
};

// Personal Overview Component
function PersonalOverview() {
  // Mock upcoming activities for the user (first 2 activities)
  const userActivities = mockActivities.slice(0, 2);

  return (
    <div className="card-minimal p-6 mb-8 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Your Upcoming Activities
        </h2>
        <span className="text-sm text-gray-500">
          {userActivities.length} upcoming
        </span>
      </div>

      {userActivities.length > 0 ? (
        <div className="space-y-3">
          {userActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200"
            >
              <div className="w-8 h-8 bg-gray-100 flex items-center justify-center">
                {getSportIcon(activity.sport)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDateTime(activity.startTime)}
                </p>
              </div>
              <div className="text-xs text-gray-400">
                {activity.spotsLeft} spots left
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">No upcoming activities</p>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  // Filter activities by type for discovery feed
  const matesActivities = mockActivities.filter(
    (activity) => activity.privacy === "MATES"
  );
  const publicActivities = mockActivities.filter(
    (activity) => activity.privacy === "PUBLIC"
  );
  const discoveryActivities = [...matesActivities, ...publicActivities];

  // Handler for joining activities - ready for real API integration
  const handleJoinActivity = (activityId: string) => {
    console.log("Joining activity:", activityId);
    // TODO: Integrate with real API
    // await joinActivity(activityId);
  };

  return (
    <div>
      {/* Dashboard Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-500">
          Your activities and discover what's happening around you
        </p>
      </div>

      {/* Personal Overview Section */}
      <PersonalOverview />

      {/* Discovery Feed Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Discover Activities
            </h2>
            <p className="text-sm text-gray-500">
              From your mates and nearby public activities
            </p>
          </div>
          <span className="text-sm text-gray-500">
            {discoveryActivities.length} activities
          </span>
        </div>

        {discoveryActivities.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {discoveryActivities.map((activity) => (
              <div key={activity.id} className="relative">
                <ActivityCard activity={activity} onJoin={handleJoinActivity} />
                {/* Add subtle indicator for mates activities */}
                {activity.privacy === "MATES" && (
                  <div className="absolute top-3 right-3">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 border border-blue-200">
                      mate
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 card-minimal border border-gray-200">
            <div className="flex justify-center mb-4">
              <HiMoon className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 text-sm">
              No activities to discover yet
            </p>
          </div>
        )}
      </div>

      {/* Global Empty State */}
      {mockActivities.length === 0 && (
        <div className="text-center py-16 card-minimal border border-gray-200">
          <div className="flex justify-center mb-4">
            <HiPuzzlePiece className="w-12 h-12 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No activities yet
          </h3>
          <p className="text-gray-500 mb-6">
            Be the first to create one and get moving
          </p>
          <button className="btn-minimal px-4 py-2 text-sm font-medium cursor-pointer">
            Create Activity
          </button>
        </div>
      )}
    </div>
  );
}
