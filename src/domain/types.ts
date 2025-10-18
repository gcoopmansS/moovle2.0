export type Privacy = "MATES" | "PUBLIC" | "INVITE_ONLY";

export type Sport =
  | "tennis"
  | "padel"
  | "running"
  | "cycling"
  | "walking"
  | "gym"
  | "other";

export interface Activity {
  id: string;
  title: string;
  sport: Sport;
  startTime: string;
  durationMinutes?: number;
  location?: string;
  privacy: Privacy;
  capacity: number;
  autoAccept: boolean;
  spotsLeft: number;
  organizer: string;
}
