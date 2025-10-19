import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useFriends } from "../hooks/useFriends";
import { mockUsers } from "../data/mockUsers";
import {
  DiscoveryFilters,
  type FilterState,
} from "../components/DiscoveryFilters";
import { FriendManagement } from "../components/FriendManagement";
import type { User } from "../domain/auth";

export default function MatesPage() {
  const { user } = useAuth();
  const {
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    getPendingRequests,
    hasPendingRequest,
    removeFriend,
  } = useFriends();
  const [activeTab, setActiveTab] = useState<
    "friends" | "requests" | "discover"
  >("friends");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isFriendManagementOpen, setIsFriendManagementOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    sports: [],
    location: "",
    distance: 25,
    skillLevel: "",
  });

  // Get user's friends
  const friends = mockUsers.filter((u) => user?.friendIds.includes(u.id));

  // Get actual pending requests for the current user
  const pendingRequests = getPendingRequests(user?.id || "");
  const requestUsers = pendingRequests
    .map((req) => mockUsers.find((u) => u.id === req.fromUserId))
    .filter(Boolean) as User[];

  // Discover new mates (excluding current friends and user)
  const allDiscoverMates = mockUsers.filter(
    (u) => !user?.friendIds.includes(u.id) && u.id !== user?.id
  );

  // Apply filters to discovery
  const discoverMates = allDiscoverMates.filter((mate) => {
    // Sport filter
    if (filters.sports.length > 0) {
      const hasMatchingSport = filters.sports.some((sport) =>
        mate.sports.includes(sport)
      );
      if (!hasMatchingSport) return false;
    }

    // Location filter
    if (filters.location && mate.location !== filters.location) {
      return false;
    }

    // For skill level, we'd need to add that to the user profile
    // For now, we'll skip this filter

    return true;
  });

  const TabButton = ({
    tab,
    label,
    count,
  }: {
    tab: typeof activeTab;
    label: string;
    count?: number;
  }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
        activeTab === tab
          ? "bg-gray-900 text-white border border-gray-900"
          : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200"
      }`}
    >
      {label}
      {count !== undefined && (
        <span
          className={`ml-2 px-2 py-1 text-xs border ${
            activeTab === tab
              ? "bg-gray-800 border-gray-700"
              : "bg-gray-100 border-gray-300"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );

  const UserCard = ({
    mate,
    type,
    requestId,
  }: {
    mate: User;
    type: "friend" | "request" | "discover";
    requestId?: string;
  }) => (
    <div className="bg-white p-6 border border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-900 flex items-center justify-center text-white text-lg font-semibold">
            {mate.avatar}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{mate.name}</h3>
            <p className="text-sm text-gray-500">{mate.location}</p>
          </div>
        </div>

        {type === "friend" && (
          <div className="flex space-x-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>
            <button className="p-2 text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        )}

        {type === "request" && requestId && (
          <div className="flex space-x-2">
            <button
              onClick={() => acceptFriendRequest(requestId)}
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Accept
            </button>
            <button
              onClick={() => declineFriendRequest(requestId)}
              className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Decline
            </button>
          </div>
        )}

        {type === "discover" && (
          <button
            onClick={() => sendFriendRequest(mate.id)}
            disabled={hasPendingRequest(user?.id || "", mate.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              hasPendingRequest(user?.id || "", mate.id)
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
            }`}
          >
            {hasPendingRequest(user?.id || "", mate.id) ? "Pending" : "Connect"}
          </button>
        )}
      </div>

      <p className="text-gray-600 text-sm mb-3">{mate.bio}</p>

      <div className="flex flex-wrap gap-2">
        {mate.sports.map((sport) => (
          <span
            key={sport}
            className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200"
          >
            {sport}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Mates</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Connect with fellow athletes, discover new training partners, and
          build your sports community.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex space-x-2 bg-gray-50 p-2 border border-gray-200">
          <TabButton tab="friends" label="Friends" count={friends.length} />
          <TabButton
            tab="requests"
            label="Requests"
            count={requestUsers.length}
          />
          <TabButton tab="discover" label="Discover" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {activeTab === "friends" && (
          <div className="space-y-6">
            {friends.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Your Friends ({friends.length})
                  </h2>
                  <button
                    onClick={() => setIsFriendManagementOpen(true)}
                    className="px-4 py-2 bg-white/80 text-gray-600 rounded-xl text-sm font-medium hover:bg-white transition-colors border border-gray-200"
                  >
                    Manage Friends
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {friends.map((friend) => (
                    <UserCard key={friend.id} mate={friend} type="friend" />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No friends yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start connecting with other athletes to build your network!
                </p>
                <button
                  onClick={() => setActiveTab("discover")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Discover Mates
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "requests" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Friend Requests ({requestUsers.length})
            </h2>
            {requestUsers.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {requestUsers.map((requestUser, index) => {
                  const request = pendingRequests[index];
                  return (
                    <UserCard
                      key={requestUser.id}
                      mate={requestUser}
                      type="request"
                      requestId={request.id}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No pending requests
                </h3>
                <p className="text-gray-600">
                  Friend requests will appear here when you receive them.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "discover" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Discover New Mates
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsFiltersOpen(true)}
                  className="px-4 py-2 bg-white/80 text-gray-600 rounded-xl text-sm font-medium hover:bg-white transition-colors border border-gray-200"
                >
                  <svg
                    className="w-4 h-4 inline mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
                    />
                  </svg>
                  Filters
                  {(filters.sports.length > 0 ||
                    filters.location ||
                    filters.skillLevel) && (
                    <span className="ml-2 px-2 py-1 bg-blue-600 text-white rounded-full text-xs">
                      {filters.sports.length +
                        (filters.location ? 1 : 0) +
                        (filters.skillLevel ? 1 : 0)}
                    </span>
                  )}
                </button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {discoverMates.slice(0, 6).map((mate) => (
                <UserCard key={mate.id} mate={mate} type="discover" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Discovery Filters Modal */}
      <DiscoveryFilters
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onFiltersChange={setFilters}
      />

      {/* Friend Management Modal */}
      <FriendManagement
        isOpen={isFriendManagementOpen}
        onClose={() => setIsFriendManagementOpen(false)}
        friends={friends}
        onRemoveFriend={removeFriend}
      />
    </div>
  );
}
