import type { Activity } from "../domain/types";
import { HiCalendarDays, HiMapPin, HiUsers } from "react-icons/hi2";
import { TennisIcon, PadelIcon } from "./sportIcons";

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
    <div className="card-minimal p-6 group border border-gray-200">
      {/* Sport Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 flex items-center justify-center">
            {getSportIcon(activity.sport)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {activity.title}
            </h3>
            <p className="text-gray-500 text-sm">by {activity.organizer}</p>
          </div>
        </div>
      </div>

      {/* Activity Details */}
      <div className="space-y-3 mb-6">
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
            <span>{activity.location}</span>
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
          onClick={handleJoin}
        >
          {buttonState.text}
        </button>
      </div>
    </div>
  );
}
