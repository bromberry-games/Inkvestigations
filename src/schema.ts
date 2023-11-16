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
      murderers: {
        Row: {
          id: number
          murder_reasons: string
          suspect_id: number
        }
        Insert: {
          id?: number
          murder_reasons: string
          suspect_id: number
        }
        Update: {
          id?: number
          murder_reasons?: string
          suspect_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "murderers_suspect_id_fkey"
            columns: ["suspect_id"]
            referencedRelation: "suspects"
            referencedColumns: ["id"]
          }
        ]
      }
      mysteries: {
        Row: {
          accuse_letter_prompt: string
          accuse_prompt: string
          brain_prompt: string
          description: string
          filepath: string
          id: number
          letter_info: string
          letter_prompt: string
          name: string
        }
        Insert: {
          accuse_letter_prompt: string
          accuse_prompt: string
          brain_prompt: string
          description: string
          filepath: string
          id?: number
          letter_info: string
          letter_prompt: string
          name: string
        }
        Update: {
          accuse_letter_prompt?: string
          accuse_prompt?: string
          brain_prompt?: string
          description?: string
          filepath?: string
          id?: number
          letter_info?: string
          letter_prompt?: string
          name?: string
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
            referencedRelation: "mysteries"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "solved_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
      suspects: {
        Row: {
          description: string
          id: number
          imagepath: string
          mystery_name: string
          name: string
        }
        Insert: {
          description: string
          id?: number
          imagepath: string
          mystery_name: string
          name: string
        }
        Update: {
          description?: string
          id?: number
          imagepath?: string
          mystery_name?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "suspects_mystery_name_fkey"
            columns: ["mystery_name"]
            referencedRelation: "mysteries"
            referencedColumns: ["name"]
          }
        ]
      }
      user_messages: {
        Row: {
          amount: number
          user_id: string
        }
        Insert: {
          amount: number
          user_id: string
        }
        Update: {
          amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_messages_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
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
            referencedRelation: "mysteries"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "user_mystery_conversations_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_mystery_info_messages: {
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
            foreignKeyName: "user_mystery_info_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            referencedRelation: "user_mystery_conversations"
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
            referencedRelation: "subscription_tiers"
            referencedColumns: ["tier_id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
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
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
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
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
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

