import { mockActivities } from "../data/mockActivities";
import type { Activity } from "../domain/types";

function ActivityCard({ activity }: { activity: Activity }) {
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

  const getPrivacyBadge = (privacy: Activity["privacy"]) => {
    const styles = {
      PUBLIC: "bg-gray-100 text-gray-600",
      MATES: "bg-gray-100 text-gray-600",
      INVITE_ONLY: "bg-gray-100 text-gray-600",
    };
    return (
      <span
        className={`px-2 py-1 rounded-md text-xs font-medium ${styles[privacy]}`}
      >
        {privacy.replace("_", " ")}
      </span>
    );
  };

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
    <div className="card-minimal rounded-2xl p-6 group">
      {/* Minimal Sport Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center space-x-3">
          <div className="text-2xl w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
            {getSportEmoji(activity.sport)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {activity.title}
            </h3>
            <p className="text-gray-500 text-sm">by {activity.organizer}</p>
          </div>
        </div>
        {getPrivacyBadge(activity.privacy)}
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
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
              Auto-accept
            </span>
          )}
        </div>

        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${buttonState.className}`}
          disabled={buttonState.disabled}
        >
          {buttonState.text}
        </button>
      </div>
    </div>
  );
}

export default function FeedPage() {
  return (
    <div>
      {/* Minimal Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Activity Feed
        </h1>
        <p className="text-gray-500">
          Discover activities happening around you
        </p>
      </div>

      {/* Minimal Activity Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockActivities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>

      {/* Minimal Empty State */}
      {mockActivities.length === 0 && (
        <div className="text-center py-16 card-minimal rounded-2xl">
          <div className="text-4xl mb-4">🏸</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No activities yet
          </h3>
          <p className="text-gray-500 mb-6">Be the first to create one</p>
          <button className="btn-minimal px-4 py-2 rounded-lg text-sm font-medium">
            Create Activity
          </button>
        </div>
      )}
    </div>
  );
}
