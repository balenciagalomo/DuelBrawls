import { Database } from "./database.types";

export type User = Database["public"]["Tables"]["users"]['Row'];

export type MatchParticipant = Database["public"]["Tables"]["match_participants"]['Row'];