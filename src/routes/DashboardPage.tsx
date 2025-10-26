import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockActivities } from "../data/mockActivities";
import type { Activity } from "../domain/types";
import {
  HiPuzzlePiece,
  HiPlus,
  HiUsers,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi2";
import { TennisIcon, PadelIcon } from "../components/sportIcons";
import ActivityCard from "../components/ActivityCard";
import { useAuth } from "../hooks/useAuth";
import { CreateActivityModal } from "../components/CreateActivityModal";
import { ActivityDetailsModal } from "../components/ActivityDetailsModal";

// Helper functions

// Returns the correct sport icon for a given sport string
const getSportIcon = (sport: Activity["sport"]) => {
  const sportIcons = {
    tennis: <TennisIcon className="w-5 h-5" />,
    padel: <PadelIcon className="w-5 h-5" />,
  };
  return sportIcons[sport] || <TennisIcon className="w-5 h-5" />;
};

// Carousel Component with Arrow Navigation
function ActivityCarousel({
  activities,
  onJoin,
  emptyMessage,
  emptySubMessage,
}: {
  activities: Activity[];
  onJoin: (activityId: string) => void;
  emptyMessage: string;
  emptySubMessage?: string;
}) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  let scrollContainerRef: HTMLDivElement | null = null;

  const updateScrollButtons = (container: HTMLDivElement) => {
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef) return;

    const cardWidth = 320; // w-80 = 320px
    const gap = 16; // gap-4 = 16px
    const scrollAmount = cardWidth + gap;

    const newScrollLeft =
      direction === "left"
        ? scrollContainerRef.scrollLeft - scrollAmount
        : scrollContainerRef.scrollLeft + scrollAmount;

    scrollContainerRef.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 card-minimal border border-gray-200">
        <div className="flex justify-center mb-4">
          <HiUsers className="w-8 h-8 text-gray-300" />
        </div>
        <p className="text-gray-500 text-sm">{emptyMessage}</p>
        {emptySubMessage && (
          <p className="text-gray-400 text-xs mt-1">{emptySubMessage}</p>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Left Arrow */}
      {canScrollLeft && (
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
          style={{ transform: "translateY(-50%) translateX(-48px)" }}
        >
          <button
            onClick={() => scroll("left")}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <HiChevronLeft className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Right Arrow */}
      {canScrollRight && (
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
          style={{ transform: "translateY(-50%) translateX(48px)" }}
        >
          <button
            onClick={() => scroll("right")}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <HiChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Carousel Container */}
      <div
        ref={(ref) => {
          if (ref) {
            scrollContainerRef = ref;
            updateScrollButtons(ref);
          }
        }}
        className="overflow-x-auto carousel-scroll"
        onScroll={(e) => updateScrollButtons(e.currentTarget)}
      >
        <div className="flex gap-4 pb-2 px-1" style={{ width: "max-content" }}>
          {activities.map((activity) => (
            <div key={activity.id} className="flex-shrink-0 w-80">
              <ActivityCard activity={activity} onJoin={onJoin} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
  // Generate current week from Monday to Sunday
  const generateWeekDays = () => {
    const days = [];
    const today = new Date();

    // Get the Monday of this week
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Sunday being 0
    const mondayOfThisWeek = new Date(today);
    mondayOfThisWeek.setDate(today.getDate() - daysFromMonday);

    // Generate 7 days starting from Monday
    for (let i = 0; i < 7; i++) {
      const date = new Date(mondayOfThisWeek);
      date.setDate(mondayOfThisWeek.getDate() + i);
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
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getDayNumber = (date: Date) => {
    return date.getDate();
  };

  const getActivityTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
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
            <div
              key={index}
              className={`flex flex-col ${
                index < weekDays.length - 1 ? "border-r border-gray-100" : ""
              }`}
            >
              {/* Day Header */}
              <div className="text-center py-2">
                <div
                  className={`inline-flex flex-col items-center justify-center ${
                    isToday(day)
                      ? "w-12 h-12 rounded-full bg-gray-100"
                      : "w-12 h-12"
                  }`}
                >
                  <div
                    className={`text-xs font-medium ${
                      isToday(day) ? "text-gray-900" : "text-gray-700"
                    }`}
                  >
                    {getDayLabel(day)}
                  </div>
                  <div
                    className={`text-xs ${
                      isToday(day) ? "text-gray-700" : "text-gray-500"
                    }`}
                  >
                    {getDayNumber(day)}
                  </div>
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
  >(null);

  // User's created activities (activities where user is the organizer)
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
      {/* Friends Activities - Primary Focus */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              From Your Mates
            </h2>
            <p className="text-sm text-gray-500">
              Activities organized by people you know
            </p>
          </div>
          <span className="text-sm text-gray-500">
            {matesActivities.length} activities
          </span>
        </div>

        <ActivityCarousel
          activities={matesActivities}
          onJoin={handleJoinActivity}
          emptyMessage="No activities from your mates yet"
          emptySubMessage="Connect with more friends to see their activities"
        />
      </div>
      {/* Public Activities - Secondary Section */}
      {publicActivities.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Public Activities
              </h2>
              <p className="text-sm text-gray-500">
                Open activities from the community
              </p>
            </div>
            <span className="text-sm text-gray-500">
              {publicActivities.length} activities
            </span>
          </div>

          <ActivityCarousel
            activities={publicActivities}
            onJoin={handleJoinActivity}
            emptyMessage="No public activities available"
            emptySubMessage="Check back later for community activities"
          />
        </div>
      )}
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
      <ActivityDetailsModal
        activity={selectedActivity!}
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        onLeave={() => {
          // Optionally implement leave logic here
          setSelectedActivity(null);
        }}
        onManage={() => {
          // Optionally implement manage logic here
          setSelectedActivity(null);
        }}
      />
      {/* Create Activity Modal */}
      <CreateActivityModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
      />
    </div>
  );
}
