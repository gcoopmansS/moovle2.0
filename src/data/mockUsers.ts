import type { User } from "../domain/auth";

export const mockUsers: User[] = [
  {
    id: "1",
    email: "gil@moovle.app",
    name: "Gil Coopmans",
    avatar: "👨‍💻",
    bio: "Tennis enthusiast and app creator. Always up for a good match!",
    location: "Amsterdam, Netherlands",
    sports: ["tennis", "padel", "cycling"],
    joinedDate: "2024-01-15",
    friendIds: ["2", "3", "4"],
  },
  {
    id: "2",
    email: "sarah@example.com",
    name: "Sarah Wilson",
    avatar: "🎾",
    bio: "Professional tennis coach. Love organizing group sessions!",
    location: "Amsterdam, Netherlands",
    sports: ["tennis", "running"],
    joinedDate: "2024-02-20",
    friendIds: ["1", "3", "5"],
  },
  {
    id: "3",
    email: "mike@example.com",
    name: "Mike Johnson",
    avatar: "🏓",
    bio: "Padel addict and weekend warrior. Let's play!",
    location: "Amsterdam, Netherlands",
    sports: ["padel", "gym", "cycling"],
    joinedDate: "2024-03-10",
    friendIds: ["1", "2", "4"],
  },
  {
    id: "4",
    email: "emma@example.com",
    name: "Emma Davis",
    avatar: "🏃‍♀️",
    bio: "Marathon runner and fitness enthusiast. Join my morning runs!",
    location: "Amsterdam, Netherlands",
    sports: ["running", "cycling", "gym"],
    joinedDate: "2024-02-05",
    friendIds: ["1", "3", "5", "6"],
  },
  {
    id: "5",
    email: "alex@example.com",
    name: "Alex Chen",
    avatar: "🚴‍♂️",
    bio: "Cycling fanatic exploring the Netherlands one route at a time.",
    location: "Utrecht, Netherlands",
    sports: ["cycling", "running"],
    joinedDate: "2024-04-12",
    friendIds: ["2", "4"],
  },
  {
    id: "6",
    email: "lisa@example.com",
    name: "Lisa Rodriguez",
    avatar: "💪",
    bio: "Gym trainer and fitness coach. Let's get stronger together!",
    location: "Rotterdam, Netherlands",
    sports: ["gym", "running", "tennis"],
    joinedDate: "2024-01-30",
    friendIds: ["4"],
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
