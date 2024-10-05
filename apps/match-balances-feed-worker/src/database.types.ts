export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      match_balance_feed: {
        Row: {
          balance: number
          id: string
          participant_id: string
          timestamp: string
        }
        Insert: {
          balance: number
          id?: string
          participant_id: string
          timestamp?: string
        }
        Update: {
          balance?: number
          id?: string
          participant_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_balance_feed_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "match_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_balance_feed_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "match_participants_view"
            referencedColumns: ["id"]
          },
        ]
      }
      match_participants: {
        Row: {
          game_wallet_private_key: string
          id: string
          invite_state: Database["public"]["Enums"]["match_invite_state"]
          match_id: string
          user_id: string
        }
        Insert: {
          game_wallet_private_key: string
          id?: string
          invite_state: Database["public"]["Enums"]["match_invite_state"]
          match_id: string
          user_id: string
        }
        Update: {
          game_wallet_private_key?: string
          id?: string
          invite_state?: Database["public"]["Enums"]["match_invite_state"]
          match_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_participants_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string
          game_type: Database["public"]["Enums"]["game_type"]
          id: string
          individual_trade_amount: number
          individual_wage_amount: number
          status: Database["public"]["Enums"]["match_status_state"]
          token: string
        }
        Insert: {
          created_at?: string
          game_type: Database["public"]["Enums"]["game_type"]
          id?: string
          individual_trade_amount: number
          individual_wage_amount: number
          status?: Database["public"]["Enums"]["match_status_state"]
          token: string
        }
        Update: {
          created_at?: string
          game_type?: Database["public"]["Enums"]["game_type"]
          id?: string
          individual_trade_amount?: number
          individual_wage_amount?: number
          status?: Database["public"]["Enums"]["match_status_state"]
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_token_fkey"
            columns: ["token"]
            isOneToOne: false
            referencedRelation: "support_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      price_feed: {
        Row: {
          id: string
          price: number
          symbol: string
          timestamp: string
        }
        Insert: {
          id?: string
          price: number
          symbol: string
          timestamp?: string
        }
        Update: {
          id?: string
          price?: number
          symbol?: string
          timestamp?: string
        }
        Relationships: []
      }
      support_tokens: {
        Row: {
          id: string
          name: string
          token_pubkey: string
        }
        Insert: {
          id?: string
          name: string
          token_pubkey: string
        }
        Update: {
          id?: string
          name?: string
          token_pubkey?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          id: string
          pubkey: string
          wallet_private_key: string
        }
        Insert: {
          created_at?: string
          id?: string
          pubkey: string
          wallet_private_key: string
        }
        Update: {
          created_at?: string
          id?: string
          pubkey?: string
          wallet_private_key?: string
        }
        Relationships: []
      }
    }
    Views: {
      match_participants_view: {
        Row: {
          id: string | null
          invite_state: Database["public"]["Enums"]["match_invite_state"] | null
          match_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string | null
          invite_state?:
            | Database["public"]["Enums"]["match_invite_state"]
            | null
          match_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string | null
          invite_state?:
            | Database["public"]["Enums"]["match_invite_state"]
            | null
          match_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_participants_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      game_type: "one_vs_one"
      match_invite_state: "pending" | "expire" | "accepted" | "decline"
      match_status_state: "pending" | "active" | "finished" | "resolved"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

