export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string; // Can be initials (e.g., "GC") or image URL (e.g., "https://..." or "/uploads/...")
  bio?: string;
  location?: string;
  sports: string[];
  joinedDate: string;
  friendIds: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
