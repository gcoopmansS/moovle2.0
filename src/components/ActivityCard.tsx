import type { Activity } from "../domain/types";
import { HiCalendarDays, HiMapPin, HiUsers } from "react-icons/hi2";
import { TennisIcon, PadelIcon } from "./sportIcons";
import { mockUsers } from "../data/mockUsers";

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

const getUsersFromIds = (userIds: string[]) => {
  return userIds
    .map((id) => mockUsers.find((user) => user.id === id))
    .filter(Boolean);
};

interface ActivityCardProps {
  activity: Activity;
  onJoin?: (activityId: string) => void;
}

export default function ActivityCard({ activity, onJoin }: ActivityCardProps) {
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

  const handleJoin = () => {
    if (!buttonState.disabled && onJoin) {
      onJoin(activity.id);
    }
  };

  return (
    <div className="card-minimal p-6 group border border-gray-200 h-full flex flex-col">
      {/* Sport Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 flex items-center justify-center">
            {getSportIcon(activity.sport)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">
              {activity.title}
            </h3>
            <p className="text-gray-500 text-sm">by {activity.organizer}</p>
          </div>
        </div>
      </div>

      {/* Activity Details */}
      <div className="space-y-3 flex-1">
        <div className="flex items-center text-gray-600 text-sm">
          <HiCalendarDays className="w-4 h-4 mr-2" />
          <span>{formatDateTime(activity.startTime)}</span>
          {activity.durationMinutes && (
            <span className="ml-2 text-gray-900 font-medium">
              • {activity.durationMinutes}min
            </span>
          )}
        </div>

        {activity.location && (
          <div className="flex items-center text-gray-600 text-sm">
            <HiMapPin className="w-4 h-4 mr-2" />
            <span className="truncate">{activity.location}</span>
          </div>
        )}

        <div className="flex items-center text-gray-600 text-sm">
          <HiUsers className="w-4 h-4 mr-2" />
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

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-6">
        {/* User Avatars */}
        <div className="flex items-center">
          {activity.joinedUsers && activity.joinedUsers.length > 0 ? (
            <div
              className="flex -space-x-2 relative avatar-group"
              title={getUsersFromIds(activity.joinedUsers)
                .map((user) => user?.name)
                .join(", ")}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 avatar-group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                <div className="font-medium mb-1">
                  Participants ({activity.joinedUsers.length}):
                </div>
                <div className="space-y-1">
                  {getUsersFromIds(activity.joinedUsers).map((user) => (
                    <div key={user?.id} className="text-xs">
                      {user?.name}
                    </div>
                  ))}
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
              </div>

              {/* Avatar Images */}
              {getUsersFromIds(activity.joinedUsers)
                .slice(0, 3)
                .map((user) => {
                  const isImageUrl =
                    user?.avatar?.startsWith("http") ||
                    user?.avatar?.startsWith("/");

                  return (
                    <div
                      key={user?.id}
                      className="w-8 h-8 rounded-full border-2 border-white overflow-hidden flex items-center justify-center"
                    >
                      {isImageUrl ? (
                        <img
                          src={user?.avatar || ""}
                          alt={user?.name || ""}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-500 text-white text-xs font-medium flex items-center justify-center">
                          {user?.avatar}
                        </div>
                      )}
                    </div>
                  );
                })}
              {activity.joinedUsers.length > 3 && (
                <div className="w-8 h-8 bg-gray-300 text-gray-600 text-xs font-medium rounded-full flex items-center justify-center border-2 border-white">
                  +{activity.joinedUsers.length - 3}
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-400 text-xs">No one joined yet</div>
          )}
        </div>

        {/* Join Button */}
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${buttonState.className}`}
          disabled={buttonState.disabled}
          onClick={handleJoin}
        >
          {buttonState.text}
        </button>
      </div>
    </div>
  );
}
