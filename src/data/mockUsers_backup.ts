import type { User } from "../domain  {
    id: "4",
    email: "emma@example.com",
    name: "Emma Davis",
    avatar: "ED",
    bio: "Tennis doubles specialist. Looking for consistent playing partners!",
    location: "Amsterdam, Netherlands",
    sports: ["tennis"],
    joinedDate: "2024-02-05",
    friendIds: ["1", "3", "5", "6"],
  },port const mockUsers: User[] = [
  {
    id: "1",
    email: "gil@moovle.app",
    name: "Gil Coopmans",
    avatar: "GC",
    bio: "Tennis and padel enthusiast, app creator. Always up for a good match!",
    location: "Amsterdam, Netherlands",
    sports: ["tennis", "padel"],
    joinedDate: "2024-01-15",
    friendIds: ["2", "3", "4"],
  },
  {
    id: "2",
    email: "sarah@example.com",
    name: "Sarah Wilson",
    avatar: "SW",
    bio: "Professional tennis coach. Level 4.5 player, love organizing group sessions!",
    location: "Amsterdam, Netherlands",
    sports: ["tennis"],
    joinedDate: "2024-02-20",
    friendIds: ["1", "3", "5"],
  },
  {
    id: "3",
    email: "mike@example.com",
    name: "Mike Johnson",
    avatar: "MJ",
    bio: "Padel addict and weekend warrior. Former tennis player, now obsessed with padel!",
    location: "Amsterdam, Netherlands",
    sports: ["padel", "tennis"],
    joinedDate: "2024-03-10",
    friendIds: ["1", "2", "4"],
  },
  {
    id: "4",
    email: "emma@example.com",
    name: "Emma Davis",
    avatar: "�",
    bio: "Tennis doubles specialist. Looking for consistent playing partners!",
    location: "Amsterdam, Netherlands",
    sports: ["tennis"],
    joinedDate: "2024-02-05",
    friendIds: ["1", "3", "5", "6"],
  },
  {
    id: "5",
    email: "alex@example.com",
    name: "Alex Chen",
    avatar: "🏓",
    bio: "Beginner padel player, eager to learn and improve. Tennis background.",
    location: "Utrecht, Netherlands",
    sports: ["padel", "tennis"],
    joinedDate: "2024-04-12",
    friendIds: ["2", "4"],
  },
  {
    id: "6",
    email: "lisa@example.com",
    name: "Lisa Rodriguez",
    avatar: "🎾",
    bio: "Competitive tennis player and padel enthusiast. Tournament regular!",
    location: "Rotterdam, Netherlands",
    sports: ["tennis", "padel"],
    joinedDate: "2024-01-30",
    friendIds: ["4"],
  },
  {
    id: "7",
    email: "maria@example.com",
    name: "Maria Garcia",
    avatar: "🏓",
    bio: "Padel instructor and former tennis pro. Love teaching and playing!",
    location: "Amsterdam, Netherlands",
    sports: ["padel", "tennis"],
    joinedDate: "2024-03-15",
    friendIds: ["1", "3"],
  },
  {
    id: "8",
    email: "james@example.com",
    name: "James Wilson",
    avatar: "🎾",
    bio: "Social tennis and padel player. Prefer fun matches over competition!",
    location: "Amsterdam, Netherlands",
    sports: ["tennis", "padel"],
    joinedDate: "2024-02-28",
    friendIds: ["2", "5"],
  },
];

// Mock login function
export const mockLogin = (
  email: string,
  password: string
): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.email === email);
      if (user && password === "password123") {
        resolve(user);
      } else {
        resolve(null);
      }
    }, 800); // Simulate network delay
  });
};

export const getCurrentUser = (): User | null => {
  const userId = localStorage.getItem("moovle_user_id");
  if (userId) {
    return mockUsers.find((u) => u.id === userId) || null;
  }
  return null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem("moovle_user_id", user.id);
  } else {
    localStorage.removeItem("moovle_user_id");
  }
};
