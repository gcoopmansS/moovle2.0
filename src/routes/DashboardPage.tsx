import { mockActivities } from "../data/mockActivities";
import type { Activity } from "../domain/types";

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

const getSportEmoji = (sport: Activity["sport"]) => {
  const sportEmojis = {
    tennis: "🎾",
    padel: "🏓",
    running: "🏃‍♂️",
    cycling: "🚴‍♂️",
    walking: "🚶‍♂️",
    gym: "💪",
    other: "⚽",
  };
  return sportEmojis[sport];
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
              <div className="text-lg w-8 h-8 bg-gray-100 flex items-center justify-center">
                {getSportEmoji(activity.sport)}
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

function ActivityCard({ activity }: { activity: Activity }) {
  const getButtonState = () => {
    if (activity.spotsLeft === 0) {
      return {
        text: "Full",
        className: "bg-gray-200 text-gray-500 cursor-not-allowed",
        disabled: true,
      };
    }
    return {
      text: "Join",
      className: "btn-minimal text-white",
      disabled: false,
    };
  };

  const buttonState = getButtonState();

  return (
    <div className="card-minimal p-6 group border border-gray-200">
      {/* Minimal Sport Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center space-x-3">
          <div className="text-2xl w-10 h-10 bg-gray-100 flex items-center justify-center">
            {getSportEmoji(activity.sport)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {activity.title}
            </h3>
            <p className="text-gray-500 text-sm">by {activity.organizer}</p>
          </div>
        </div>
      </div>

      {/* Minimal Activity Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-gray-600 text-sm">
          <span className="mr-2">📅</span>
          <span>{formatDateTime(activity.startTime)}</span>
          {activity.durationMinutes && (
            <span className="ml-2 text-gray-900 font-medium">
              • {activity.durationMinutes}min
            </span>
          )}
        </div>

        {activity.location && (
          <div className="flex items-center text-gray-600 text-sm">
            <span className="mr-2">📍</span>
            <span>{activity.location}</span>
          </div>
        )}

        <div className="flex items-center text-gray-600 text-sm">
          <span className="mr-2">👥</span>
          <span>
            <span
              className={
                activity.spotsLeft <= 2
                  ? "text-red-600 font-medium"
                  : "text-gray-600"
              }
            >
              {activity.spotsLeft} spots left
            </span>
            <span className="text-gray-400"> of {activity.capacity}</span>
          </span>
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          {activity.autoAccept && (
            <span className="bg-green-100 text-green-700 px-2 py-1 text-xs font-medium border border-green-200">
              Auto-accept
            </span>
          )}
        </div>

        <button
          className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${buttonState.className}`}
          disabled={buttonState.disabled}
        >
          {buttonState.text}
        </button>
      </div>
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
                <ActivityCard activity={activity} />
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
            <div className="text-2xl mb-2">😴</div>
            <p className="text-gray-500 text-sm">
              No activities to discover yet
            </p>
          </div>
        )}
      </div>

      {/* Global Empty State */}
      {mockActivities.length === 0 && (
        <div className="text-center py-16 card-minimal border border-gray-200">
          <div className="text-4xl mb-4">🏸</div>
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
