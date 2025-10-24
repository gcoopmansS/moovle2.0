import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockActivities } from "../data/mockActivities";
import type { Activity } from "../domain/types";
import { HiMoon, HiPuzzlePiece, HiPlus, HiCalendarDays } from "react-icons/hi2";
import { TennisIcon, PadelIcon } from "../components/sportIcons";
import ActivityCard from "../components/ActivityCard";
import { useAuth } from "../hooks/useAuth";
import { CreateActivityModal } from "../components/CreateActivityModal";

// Helper functions

const getSportIcon = (sport: Activity["sport"]) => {
  const sportIcons = {
    tennis: <TennisIcon className="w-5 h-5" />,
    padel: <PadelIcon className="w-5 h-5" />,
  };
  return sportIcons[sport] || <TennisIcon className="w-5 h-5" />;
};

// Calendar Week View Component - True calendar layout with day columns
function PersonalOverview({
  userCreatedActivities,
  userJoinedActivities,
  onCreateActivity,
  onViewAll,
  onActivityClick,
}: {
  userCreatedActivities: Activity[];
  userJoinedActivities: Activity[];
  onCreateActivity: () => void;
  onViewAll: () => void;
  onActivityClick: (
    activity: Activity & { userRole: "organizer" | "participant" }
  ) => void;
}) {
  // Generate next 7 days starting from today
  const generateWeekDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekDays = generateWeekDays();

  // Combine all user activities with role
  const allUserActivities = [
    ...userCreatedActivities.map((activity) => ({
      ...activity,
      userRole: "organizer" as const,
    })),
    ...userJoinedActivities.map((activity) => ({
      ...activity,
      userRole: "participant" as const,
    })),
  ];

  // Group activities by date
  const activitiesByDate = weekDays.reduce((acc, day) => {
    const dayKey = day.toDateString();
    acc[dayKey] = allUserActivities
      .filter((activity) => {
        const activityDate = new Date(activity.startTime);
        return activityDate.toDateString() === dayKey;
      })
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
    return acc;
  }, {} as Record<string, (Activity & { userRole: "organizer" | "participant" })[]>);

  const getDayLabel = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const getDayNumber = (date: Date) => {
    return date.getDate();
  };

  const getActivityTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="card-minimal p-4 mb-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h2 className="text-base font-semibold text-gray-900">This Week</h2>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {allUserActivities.length} activities
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onViewAll}
            className="text-xs text-gray-500 hover:text-gray-700 font-medium cursor-pointer px-3 py-2"
          >
            View all
          </button>
          <button
            onClick={onCreateActivity}
            className="btn-minimal px-4 py-2 text-xs font-medium cursor-pointer flex items-center space-x-1"
          >
            <HiPlus className="w-3 h-3" />
            <span>Create</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day, index) => {
          const dayKey = day.toDateString();
          const dayActivities = activitiesByDate[dayKey] || [];

          return (
            <div key={index} className="flex flex-col">
              {/* Day Header */}
              <div className="text-center py-2 border-b border-gray-100">
                <div className="text-xs font-medium text-gray-900">
                  {getDayLabel(day)}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {getDayNumber(day)}
                </div>
              </div>

              {/* Day Activities */}
              <div className="min-h-16 p-1 space-y-1">
                {dayActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`relative group cursor-pointer p-1.5 rounded border transition-all hover:shadow-sm ${
                      activity.userRole === "organizer"
                        ? "bg-white border-gray-300 hover:border-gray-400"
                        : "bg-gray-50 border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => onActivityClick(activity)}
                  >
                    {/* Role indicator */}
                    <div
                      className={`absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full ${
                        activity.userRole === "organizer"
                          ? "bg-gray-800"
                          : "bg-green-500"
                      }`}
                    />

                    {/* Sport icon */}
                    <div className="flex items-center justify-center mb-1">
                      <div className="w-5 h-5 text-gray-700">
                        {getSportIcon(activity.sport)}
                      </div>
                    </div>

                    {/* Time */}
                    <div className="text-xs text-gray-600 text-center font-medium">
                      {getActivityTime(activity.startTime)}
                    </div>

                    {/* Hover tooltip */}
                    <div className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      {activity.title}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                ))}

                {/* Empty state for day */}
                {dayActivities.length === 0 && (
                  <div className="h-8 flex items-center justify-center">
                    <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock user activity data - in real app this would come from API
  const currentUserName = user?.name || "Gil Coopmans"; // Mock current user

  // State for joined activities
  const [joinedActivityIds, setJoinedActivityIds] = useState<string[]>([
    "2",
    "3",
  ]);

  // State for create activity modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // State for activity detail modal
  const [selectedActivity, setSelectedActivity] = useState<
    (Activity & { userRole: "organizer" | "participant" }) | null
  >(null); // User's created activities (activities where user is the organizer)
  const userCreatedActivities = mockActivities.filter(
    (activity) => activity.organizer === currentUserName
  );

  // User's joined activities (activities user has joined but didn't create)
  const userJoinedActivities = mockActivities.filter(
    (activity) =>
      joinedActivityIds.includes(activity.id) &&
      activity.organizer !== currentUserName
  );

  // Filter activities by type for discovery feed (exclude user's own activities)
  const matesActivities = mockActivities.filter(
    (activity) =>
      activity.privacy === "MATES" &&
      activity.organizer !== currentUserName &&
      !joinedActivityIds.includes(activity.id)
  );
  const publicActivities = mockActivities.filter(
    (activity) =>
      activity.privacy === "PUBLIC" &&
      activity.organizer !== currentUserName &&
      !joinedActivityIds.includes(activity.id)
  );
  const discoveryActivities = [...matesActivities, ...publicActivities];

  // Handler for joining activities
  const handleJoinActivity = (activityId: string) => {
    setJoinedActivityIds((prev) => [...prev, activityId]);
    console.log("Joined activity:", activityId);
    // TODO: Integrate with real API
  };

  // Handler for creating activity
  const handleCreateActivity = () => {
    setIsCreateModalOpen(true);
  };

  // Handler for closing create activity modal
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // Handler for viewing all activities
  const handleViewAllActivities = () => {
    navigate("/agenda");
  };

  // Handler for activity click
  const handleActivityClick = (
    activity: Activity & { userRole: "organizer" | "participant" }
  ) => {
    setSelectedActivity(activity);
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
      <PersonalOverview
        userCreatedActivities={userCreatedActivities}
        userJoinedActivities={userJoinedActivities}
        onCreateActivity={handleCreateActivity}
        onViewAll={handleViewAllActivities}
        onActivityClick={handleActivityClick}
      />{" "}
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
          <button
            onClick={handleCreateActivity}
            className="btn-minimal px-4 py-2 text-sm font-medium cursor-pointer"
          >
            Create Activity
          </button>
        </div>
      )}
      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedActivity(null)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  {getSportIcon(selectedActivity.sport)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedActivity.title}
                </h3>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  selectedActivity.userRole === "organizer"
                    ? "bg-gray-100 text-gray-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {selectedActivity.userRole === "organizer"
                  ? "Organizer"
                  : "Joined"}
              </span>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <HiCalendarDays className="w-4 h-4" />
                <span>
                  {new Date(selectedActivity.startTime).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    }
                  )}{" "}
                  at{" "}
                  {new Date(selectedActivity.startTime).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )}
                </span>
              </div>

              <div>
                <strong>Location:</strong> {selectedActivity.location}
              </div>

              <div>
                <strong>Duration:</strong> {selectedActivity.durationMinutes}{" "}
                minutes
              </div>

              <div>
                <strong>Capacity:</strong>{" "}
                {selectedActivity.capacity - selectedActivity.spotsLeft}/
                {selectedActivity.capacity} joined
                {selectedActivity.spotsLeft > 0 && (
                  <span className="text-green-600 ml-2">
                    ({selectedActivity.spotsLeft} spots left)
                  </span>
                )}
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setSelectedActivity(null)}
                className="flex-1 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Close
              </button>
              {selectedActivity.userRole === "organizer" ? (
                <button className="flex-1 px-4 py-2 text-sm bg-gray-900 text-white rounded hover:bg-gray-800">
                  Manage
                </button>
              ) : (
                <button className="flex-1 px-4 py-2 text-sm bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100">
                  Leave
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Create Activity Modal */}
      <CreateActivityModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
      />
    </div>
  );
}
