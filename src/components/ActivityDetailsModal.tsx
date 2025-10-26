import React from "react";
import { HiCalendarDays } from "react-icons/hi2";
import type { Activity } from "../domain/types";
import { TennisIcon, PadelIcon } from "./sportIcons";

interface ActivityDetailsModalProps {
  activity: Activity & { userRole?: "organizer" | "participant" };
  isOpen: boolean;
  onClose: () => void;
  onLeave?: () => void;
  onManage?: () => void;
}

export const ActivityDetailsModal: React.FC<ActivityDetailsModalProps> = ({
  activity,
  isOpen,
  onClose,
  onLeave,
  onManage,
}) => {
  if (!isOpen || !activity) return null;
  // Inline getSportIcon logic (copied from ActivityCard)
  const getSportIcon = (sport: Activity["sport"]) => {
    const sportIcons = {
      tennis: <TennisIcon className="w-8 h-8" />, // match size to modal
      padel: <PadelIcon className="w-8 h-8" />,
    };
    return sportIcons[sport] || <TennisIcon className="w-8 h-8" />;
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 flex items-center justify-center">
              {getSportIcon(activity.sport)}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {activity.title}
            </h3>
          </div>
          {activity.userRole && (
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${
                activity.userRole === "organizer"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {activity.userRole === "organizer" ? "Organizer" : "Joined"}
            </span>
          )}
        </div>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <HiCalendarDays className="w-4 h-4" />
            <span>
              {new Date(activity.startTime).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
              {" at "}
              {new Date(activity.startTime).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </span>
          </div>
          <div>
            <strong>Location:</strong> {activity.location}
          </div>
          <div>
            <strong>Duration:</strong> {activity.durationMinutes} minutes
          </div>
          <div>
            <strong>Capacity:</strong>{" "}
            {activity.capacity - (activity.spotsLeft ?? 0)}/{activity.capacity}{" "}
            joined
            {activity.spotsLeft && activity.spotsLeft > 0 && (
              <span className="text-green-600 ml-2">
                ({activity.spotsLeft} spots left)
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
          >
            Close
          </button>
          {activity.userRole === "organizer" ? (
            <button
              className="flex-1 px-4 py-2 text-sm bg-gray-900 text-white rounded hover:bg-gray-800 cursor-pointer"
              onClick={onManage}
            >
              Manage
            </button>
          ) : (
            <button
              className="flex-1 px-4 py-2 text-sm bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 cursor-pointer"
              onClick={onLeave}
            >
              Leave
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
