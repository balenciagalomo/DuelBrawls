import { Database } from "./database.types";

export type GameType = Database["public"]["Enums"]["game_type"]

export type MatchInviteState = Database["public"]["Enums"]["match_invite_state"]

export const ACTIVE_MATCH_INVITE_STATE: MatchInviteState[] = ['pending', 'accepted']

export type MatchStatusState = Database["public"]["Enums"]["match_status_state"]

export type Match = Database["public"]["Tables"]["matches"]['Row'];

export type SupportToken = Database["public"]["Tables"]["support_tokens"]['Row'];