export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
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
      events: {
        Row: {
          id: number
          info: string
          letter: string
          mystery_id: number | null
          show_at_message: number
        }
        Insert: {
          id?: number
          info: string
          letter: string
          mystery_id?: number | null
          show_at_message: number
        }
        Update: {
          id?: number
          info?: string
          letter?: string
          mystery_id?: number | null
          show_at_message?: number
        }
        Relationships: [
          {
            foreignKeyName: "events_mystery_id_fkey"
            columns: ["mystery_id"]
            isOneToOne: false
            referencedRelation: "mysteries"
            referencedColumns: ["id"]
          }
        ]
      }
      for_free_users: {
        Row: {
          amount: number
          daily_limit: number
          id: number
        }
        Insert: {
          amount: number
          daily_limit: number
          id?: number
        }
        Update: {
          amount?: number
          daily_limit?: number
          id?: number
        }
        Relationships: []
      }
      mysteries: {
        Row: {
          accuse_letter_prompt: string
          action_clues: Database["public"]["CompositeTypes"]["action_clue_type"][]
          description: string
          filepath: string
          id: number
          letter_info: string
          letter_prompt: string
          murderer: Database["public"]["CompositeTypes"]["murderer_type"]
          name: string
          setting: string
          suspects: Database["public"]["CompositeTypes"]["suspect_type"][]
          theme: string
          timeframe: Database["public"]["CompositeTypes"]["timeframe_type"][]
          victim_description: string
          victim_name: string
        }
        Insert: {
          accuse_letter_prompt: string
          action_clues: Database["public"]["CompositeTypes"]["action_clue_type"][]
          description: string
          filepath: string
          id?: number
          letter_info: string
          letter_prompt: string
          murderer: Database["public"]["CompositeTypes"]["murderer_type"]
          name: string
          setting: string
          suspects: Database["public"]["CompositeTypes"]["suspect_type"][]
          theme: string
          timeframe: Database["public"]["CompositeTypes"]["timeframe_type"][]
          victim_description: string
          victim_name: string
        }
        Update: {
          accuse_letter_prompt?: string
          action_clues?: Database["public"]["CompositeTypes"]["action_clue_type"][]
          description?: string
          filepath?: string
          id?: number
          letter_info?: string
          letter_prompt?: string
          murderer?: Database["public"]["CompositeTypes"]["murderer_type"]
          name?: string
          setting?: string
          suspects?: Database["public"]["CompositeTypes"]["suspect_type"][]
          theme?: string
          timeframe?: Database["public"]["CompositeTypes"]["timeframe_type"][]
          victim_description?: string
          victim_name?: string
        }
        Relationships: []
      }
      solved: {
        Row: {
          id: number
          mystery_name: string
          rating: number | null
          user_id: string
        }
        Insert: {
          id?: number
          mystery_name: string
          rating?: number | null
          user_id: string
        }
        Update: {
          id?: number
          mystery_name?: string
          rating?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "solved_mystery_name_fkey"
            columns: ["mystery_name"]
            isOneToOne: false
            referencedRelation: "mysteries"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "solved_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      stripe_customers: {
        Row: {
          customer_id: string
          user_id: string
        }
        Insert: {
          customer_id: string
          user_id: string
        }
        Update: {
          customer_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      stripe_events: {
        Row: {
          event_id: string
          id: number
        }
        Insert: {
          event_id: string
          id?: number
        }
        Update: {
          event_id?: string
          id?: number
        }
        Relationships: []
      }
      subscription_tiers: {
        Row: {
          active: boolean
          daily_message_limit: number
          description: string
          name: string
          stripe_price_id: string
          tier_id: number
        }
        Insert: {
          active?: boolean
          daily_message_limit: number
          description: string
          name: string
          stripe_price_id: string
          tier_id?: number
        }
        Update: {
          active?: boolean
          daily_message_limit?: number
          description?: string
          name?: string
          stripe_price_id?: string
          tier_id?: number
        }
        Relationships: []
      }
      terms_and_conditions_privacy_policy_consent: {
        Row: {
          accepted: boolean
          accepted_on: string
          user_id: string
        }
        Insert: {
          accepted?: boolean
          accepted_on?: string
          user_id: string
        }
        Update: {
          accepted?: boolean
          accepted_on?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "terms_and_conditions_privacy_policy_consent_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_messages: {
        Row: {
          amount: number
          non_refillable_amount: number
          user_id: string
        }
        Insert: {
          amount: number
          non_refillable_amount?: number
          user_id: string
        }
        Update: {
          amount?: number
          non_refillable_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_mystery_brain_messages: {
        Row: {
          chain_of_thought: string
          conversation_id: number | null
          created_at: string
          id: number
          info: string
          mood: string
        }
        Insert: {
          chain_of_thought: string
          conversation_id?: number | null
          created_at?: string
          id?: number
          info: string
          mood: string
        }
        Update: {
          chain_of_thought?: string
          conversation_id?: number | null
          created_at?: string
          id?: number
          info?: string
          mood?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_mystery_brain_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "user_mystery_conversations"
            referencedColumns: ["id"]
          }
        ]
      }
      user_mystery_conversations: {
        Row: {
          archived: boolean
          created_at: string
          id: number
          mystery_name: string
          user_id: string | null
        }
        Insert: {
          archived?: boolean
          created_at?: string
          id?: number
          mystery_name: string
          user_id?: string | null
        }
        Update: {
          archived?: boolean
          created_at?: string
          id?: number
          mystery_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_mystery_conversations_mystery_name_fkey"
            columns: ["mystery_name"]
            isOneToOne: false
            referencedRelation: "mysteries"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "user_mystery_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_mystery_messages: {
        Row: {
          content: string
          conversation_id: number | null
          created_at: string
          id: number
        }
        Insert: {
          content: string
          conversation_id?: number | null
          created_at?: string
          id?: number
        }
        Update: {
          content?: string
          conversation_id?: number | null
          created_at?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_mystery_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "user_mystery_conversations"
            referencedColumns: ["id"]
          }
        ]
      }
      user_subscriptions: {
        Row: {
          active: boolean
          end_date: string | null
          start_date: string
          subscription_id: number
          tier_id: number | null
          user_id: string | null
        }
        Insert: {
          active?: boolean
          end_date?: string | null
          start_date: string
          subscription_id?: number
          tier_id?: number | null
          user_id?: string | null
        }
        Update: {
          active?: boolean
          end_date?: string | null
          start_date?: string
          subscription_id?: number
          tier_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["tier_id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_subscription: {
        Args: {
          the_user_id: string
          price_id: string
        }
        Returns: undefined
      }
      decrement_for_free_users: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      decrement_message_for_user: {
        Args: {
          the_user_id: string
        }
        Returns: undefined
      }
      increase_message_for_user_by_amount: {
        Args: {
          the_user_id: string
          increase: number
        }
        Returns: undefined
      }
      update_daily_messages: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_subscription: {
        Args: {
          stripe_customer: string
          price_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      action_clue_type: {
        action: string
        clue: string
      }
      murderer_type: {
        name: string
        description: string
        imagepath: string
        motive: string
        opportunity: string
        evidence: string
      }
      suspect_type: {
        name: string
        imagepath: string
        description: string
      }
      timeframe_type: {
        timeframe: string
        event_happened: string
      }
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

