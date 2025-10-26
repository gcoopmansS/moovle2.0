import { useState } from "react";
import {
  HiCalendarDays,
  HiTrophy,
  HiViewColumns,
  HiListBullet,
} from "react-icons/hi2";
import { mockActivities } from "../data/mockActivities";
import ActivityCard from "../components/ActivityCard";
import type { Activity } from "../domain/types";
import { ActivityDetailsModal } from "../components/ActivityDetailsModal";

export default function AgendaPage() {
  // State for joined activities (should match dashboard)
  const [joinedActivityIds] = useState<string[]>(["2", "3"]);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar");
  // Add week offset state
  const [weekOffset, setWeekOffset] = useState(0);
  // State for activity detail modal
  const [selectedActivity, setSelectedActivity] = useState<
    (Activity & { userRole?: "organizer" | "participant" }) | null
  >(null);

  // Mock current user name (should match dashboard)
  const currentUserName = "Gil Coopmans";

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

  // Combine all user activities (both created and joined)
  const userActivities = [...userCreatedActivities, ...userJoinedActivities];

  // Separate into upcoming and past
  const now = new Date();
  const upcomingActivities = userActivities.filter(
    (activity) => new Date(activity.startTime) > now
  );
  const pastActivities = userActivities.filter(
    (activity) => new Date(activity.startTime) <= now
  );

  // Helper function to organize activities by date for calendar view
  const getActivitiesForDate = (date: Date) => {
    // Create a date string in YYYY-MM-DD format for the calendar date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    // Use all user activities, not just upcoming ones, for calendar display
    return userActivities
      .filter((activity) => {
        // Parse the activity date and convert to local date string
        const activityDate = new Date(activity.startTime);
        const activityYear = activityDate.getFullYear();
        const activityMonth = String(activityDate.getMonth() + 1).padStart(
          2,
          "0"
        );
        const activityDay = String(activityDate.getDate()).padStart(2, "0");
        const activityDateStr = `${activityYear}-${activityMonth}-${activityDay}`;

        return activityDateStr === dateStr;
      })
      .sort((a, b) => {
        // Sort activities by start time (earliest first)
        return (
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
      });
  };

  // Get week dates (Monday to Sunday) for a given offset
  const getWeekDates = (offset: number) => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const diff = currentDay === 0 ? -6 : 1 - currentDay; // Adjust for Monday start
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff + offset * 7);
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const weekDates = getWeekDates(weekOffset);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const handleJoinActivity = (activityId: string) => {
    console.log("Join activity:", activityId);
    // TODO: Integrate with real API
  };
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">My Agenda</h1>
        <p className="text-gray-500">Activities you've joined or created</p>
      </div>

      {/* View Toggle */}
      <div className="mb-6">
        <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setViewMode("calendar")}
            className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              viewMode === "calendar"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <HiViewColumns className="w-4 h-4" />
            <span>Calendar</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              viewMode === "list"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <HiListBullet className="w-4 h-4" />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === "list" ? (
        /* List View */
        <div className="space-y-8">
          {/* Upcoming Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming</h2>
              <span className="text-sm text-gray-500">
                {upcomingActivities.length} activities
              </span>
            </div>

            {upcomingActivities.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingActivities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onJoin={handleJoinActivity}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 card-minimal border border-gray-200">
                <div className="flex justify-center mb-4">
                  <HiCalendarDays className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Your schedule is clear
                </h3>
                <p className="text-gray-500 mb-4">
                  Join some activities from the feed to see them here!
                </p>
              </div>
            )}
          </section>

          {/* Past Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Past</h2>
              <span className="text-sm text-gray-500">
                {pastActivities.length} activities
              </span>
            </div>

            {pastActivities.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pastActivities.map((activity) => (
                  <div key={activity.id} className="relative">
                    <ActivityCard
                      activity={activity}
                      onJoin={handleJoinActivity}
                    />
                    {/* Past activity overlay */}
                    <div className="absolute inset-0 bg-gray-50/80 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded shadow-sm">
                        Completed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 card-minimal border border-gray-200">
                <div className="flex justify-center mb-4 opacity-50">
                  <HiTrophy className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No activity history yet
                </h3>
                <p className="text-gray-500">
                  Your completed activities will appear here
                </p>
              </div>
            )}
          </section>
        </div>
      ) : (
        /* Calendar View */
        <div className="space-y-6">
          {/* Calendar Header with week navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                className="px-2 py-1 rounded hover:bg-gray-100 text-gray-600 cursor-pointer"
                onClick={() => setWeekOffset((w) => w - 1)}
                aria-label="Previous week"
              >
                {"<"}
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                Week of{" "}
                {weekDates[0].toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
                {" - "}
                {weekDates[6].toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h2>
              <button
                className="px-2 py-1 rounded hover:bg-gray-100 text-gray-600 cursor-pointer"
                onClick={() => setWeekOffset((w) => w + 1)}
                aria-label="Next week"
              >
                {">"}
              </button>
              {weekOffset !== 0 && (
                <button
                  className="ml-2 px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium transition-colors cursor-pointer"
                  onClick={() => setWeekOffset(0)}
                >
                  Today
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Your Activities
              </span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="card-minimal p-6 border border-gray-200">
            {/* Days Header */}
            <div className="grid grid-cols-7 gap-px mb-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day, index) => {
                  const dayDate = weekDates[index];
                  const isToday =
                    dayDate.toDateString() === today.toDateString();
                  return (
                    <div
                      key={day}
                      className={`text-center py-3 text-sm font-medium border-b ${
                        isToday
                          ? "text-gray-900 bg-gray-100 border-gray-300"
                          : "text-gray-700 border-gray-200"
                      }`}
                    >
                      {day}
                    </div>
                  );
                }
              )}
            </div>

            {/* Calendar Body */}
            <div className="grid grid-cols-7 gap-px min-h-[400px]">
              {weekDates.map((date, index) => {
                const dayActivities = getActivitiesForDate(date);
                const isToday = date.toDateString() === today.toDateString();
                const isLastDay = index === 6;

                return (
                  <div
                    key={date.toISOString()}
                    className={`p-3 ${
                      isToday
                        ? "bg-gray-50 border-r border-gray-200"
                        : "bg-white border-r border-gray-100"
                    } ${isLastDay ? "border-r-0" : ""}`}
                  >
                    <div
                      className={`text-sm font-medium mb-2 ${
                        isToday ? "text-gray-900" : "text-gray-700"
                      }`}
                    >
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayActivities.map((activity) => {
                        const activityDate = new Date(activity.startTime);
                        const time = activityDate.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        });
                        const isPast = activityDate <= now;
                        const isOrganizer =
                          activity.organizer === currentUserName;
                        return (
                          <div
                            key={activity.id}
                            className={`text-xs px-2 py-1 rounded border-l-2 cursor-pointer hover:opacity-80 transition-opacity ${
                              isPast
                                ? "bg-gray-100 text-gray-600 border-gray-400 opacity-75"
                                : isOrganizer
                                ? isToday
                                  ? "bg-gray-200 text-gray-900 border-gray-600 font-medium"
                                  : "bg-gray-100 text-gray-800 border-gray-500"
                                : isToday
                                ? "bg-green-200 text-green-900 border-green-600 font-medium"
                                : "bg-green-100 text-green-800 border-green-500"
                            }`}
                            title={`${activity.title} at ${
                              activity.location || "TBD"
                            }${isPast ? " (Completed)" : ""}${
                              isOrganizer ? " (Organizer)" : " (Joined)"
                            }`}
                            onClick={() =>
                              setSelectedActivity({
                                ...(activity as Activity),
                                userRole: isOrganizer
                                  ? "organizer"
                                  : "participant",
                              })
                            }
                          >
                            {activity.title}
                            <div
                              className={
                                isPast
                                  ? "text-gray-500"
                                  : isOrganizer
                                  ? isToday
                                    ? "text-gray-700"
                                    : "text-gray-600"
                                  : isToday
                                  ? "text-green-700"
                                  : "text-green-600"
                              }
                            >
                              {time}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Activity Details Modal */}
          <ActivityDetailsModal
            activity={selectedActivity!}
            isOpen={!!selectedActivity}
            onClose={() => setSelectedActivity(null)}
            onLeave={() => setSelectedActivity(null)}
            onManage={() => setSelectedActivity(null)}
          />
        </div>
      )}
    </div>
  );
}
