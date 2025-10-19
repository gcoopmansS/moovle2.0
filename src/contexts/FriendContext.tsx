import React, { createContext, useState } from "react";

interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

interface FriendContextType {
  friendRequests: FriendRequest[];
  sentRequests: FriendRequest[];
  sendFriendRequest: (toUserId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  declineFriendRequest: (requestId: string) => void;
  removeFriend: (friendId: string) => void;
  getPendingRequests: (userId: string) => FriendRequest[];
  getSentRequests: (userId: string) => FriendRequest[];
  isFriend: (userId1: string, userId2: string) => boolean;
  hasPendingRequest: (fromUserId: string, toUserId: string) => boolean;
}

const FriendContext = createContext<FriendContextType | undefined>(undefined);

export function FriendProvider({ children }: { children: React.ReactNode }) {
  // Mock friend requests data
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
    {
      id: "req1",
      fromUserId: "4", // Emma
      toUserId: "1", // Gil (current user)
      status: "pending",
      createdAt: "2025-10-18T10:00:00Z",
    },
    {
      id: "req2",
      fromUserId: "6", // Lisa
      toUserId: "1", // Gil (current user)
      status: "pending",
      createdAt: "2025-10-18T14:30:00Z",
    },
  ]);

  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);

  const sendFriendRequest = (toUserId: string) => {
    const newRequest: FriendRequest = {
      id: `req_${Date.now()}`,
      fromUserId: "1", // Current user (Gil)
      toUserId,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setSentRequests((prev) => [...prev, newRequest]);
  };

  const acceptFriendRequest = (requestId: string) => {
    setFriendRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "accepted" as const } : req
      )
    );

    // In a real app, this would also update the user's friend list in the backend
    console.log("Friend request accepted:", requestId);
  };

  const declineFriendRequest = (requestId: string) => {
    setFriendRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "declined" as const } : req
      )
    );
  };

  const removeFriend = (friendId: string) => {
    // In a real app, this would remove the friendship in the backend
    console.log("Removing friend:", friendId);
  };

  const getPendingRequests = (userId: string) => {
    return friendRequests.filter(
      (req) => req.toUserId === userId && req.status === "pending"
    );
  };

  const getSentRequests = (userId: string) => {
    return sentRequests.filter(
      (req) => req.fromUserId === userId && req.status === "pending"
    );
  };

  const isFriend = (_userId1: string, _userId2: string) => {
    // This would check the actual friendship status in a real app
    // For now, we'll use the mock data structure
    return false;
  };

  const hasPendingRequest = (fromUserId: string, toUserId: string) => {
    return (
      friendRequests.some(
        (req) =>
          req.fromUserId === fromUserId &&
          req.toUserId === toUserId &&
          req.status === "pending"
      ) ||
      sentRequests.some(
        (req) =>
          req.fromUserId === fromUserId &&
          req.toUserId === toUserId &&
          req.status === "pending"
      )
    );
  };

  return (
    <FriendContext.Provider
      value={{
        friendRequests,
        sentRequests,
        sendFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        removeFriend,
        getPendingRequests,
        getSentRequests,
        isFriend,
        hasPendingRequest,
      }}
    >
      {children}
    </FriendContext.Provider>
  );
}

export default FriendContext;
