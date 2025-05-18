export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_cooldowns: {
        Row: {
          activity_type: string
          created_at: string
          end_time: string
          id: string
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          end_time: string
          id?: string
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          end_time?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
        profiles: {
            Row: {
              avatar_color: string | null
              avatar_url: string | null
              country_code: string | null
              created_at: string
              full_name: string | null
              id: string
              phone_number: string | null
              updated_at: string
            }
            Insert: {
              avatar_color?: string | null
              avatar_url?: string | null
              country_code?: string | null
              created_at?: string
              full_name?: string | null
              id: string
              phone_number?: string | null
              updated_at?: string
            }
            Update: {
              avatar_color?: string | null
              avatar_url?: string | null
              country_code?: string | null
              created_at?: string
              full_name?: string | null
              id?: string
              phone_number?: string | null
              updated_at?: string
            }
            Relationships: []
          }

      community_messages: {
        Row: {
          background_color: string | null
          created_at: string
          id: string
          is_highlighted: boolean
          is_translated: boolean
          likes: number
          message_id: string
          reply_to: string | null
          text: string
          timestamp: number
        }
        Insert: {
          background_color?: string | null
          created_at?: string
          id?: string
          is_highlighted?: boolean
          is_translated?: boolean
          likes?: number
          message_id: string
          reply_to?: string | null
          text: string
          timestamp: number
        }
        Update: {
          background_color?: string | null
          created_at?: string
          id?: string
          is_highlighted?: boolean
          is_translated?: boolean
          likes?: number
          message_id?: string
          reply_to?: string | null
          text?: string
          timestamp?: number
        }
        Relationships: []
      }
      daily_earnings: {
        Row: {
          created_at: string
          date: string
          id: string
          name: string
          updated_at: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
          value?: number
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      daily_progress: {
        Row: {
          date: string
          earnings: number
          id: string
          tasks_completed: number
          updated_at: string
          user_id: string
        }
        Insert: {
          date?: string
          earnings?: number
          id?: string
          tasks_completed?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          date?: string
          earnings?: number
          id?: string
          tasks_completed?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lucky_wheel_data: {
        Row: {
          created_at: string
          id: string
          last_reset_date: string
          spins_remaining: number
          successful_spins: number
          today_winnings: number
          unsuccessful_spins: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_reset_date?: string
          spins_remaining?: number
          successful_spins?: number
          today_winnings?: number
          unsuccessful_spins?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_reset_date?: string
          spins_remaining?: number
          successful_spins?: number
          today_winnings?: number
          unsuccessful_spins?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      product_evaluations: {
        Row: {
          created_at: string
          earned_amount: number
          evaluation_type: string
          id: string
          is_approved: boolean | null
          is_liked: boolean | null
          product_id: string
          review: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          earned_amount?: number
          evaluation_type: string
          id?: string
          is_approved?: boolean | null
          is_liked?: boolean | null
          product_id: string
          review?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          earned_amount?: number
          evaluation_type?: string
          id?: string
          is_approved?: boolean | null
          is_liked?: boolean | null
          product_id?: string
          review?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profile_configs: {
        Row: {
          id: string
          settings: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          settings?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          settings?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }

      recent_activities: {
        Row: {
          action_type: string
          created_at: string
          id: string
          metadata: Json | null
          target_id: string | null
          target_table: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_table?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_table?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          activity: string
          amount: number
          created_at: string
          date: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          activity: string
          amount: number
          created_at?: string
          date?: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          activity?: string
          amount?: number
          created_at?: string
          date?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      user_balances: {
        Row: {
          amount: number
          created_at: string
          id: string
          receipt_url: string | null
          source: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          receipt_url?: string | null
          source: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          receipt_url?: string | null
          source?: string
          user_id?: string
        }
        Relationships: []
      }
      user_cooldowns: {
        Row: {
          created_at: string
          end_time: string
          feature: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_time: string
          feature: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_time?: string
          feature?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_earnings: {
        Row: {
          balance: number
          created_at: string
          id: string
          like_for_money_completed: number
          lucky_wheel_spins: number
          product_inspector_completed: number
          total_earned: number
          total_withdrawn: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          like_for_money_completed?: number
          lucky_wheel_spins?: number
          product_inspector_completed?: number
          total_earned?: number
          total_withdrawn?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          like_for_money_completed?: number
          lucky_wheel_spins?: number
          product_inspector_completed?: number
          total_earned?: number
          total_withdrawn?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          language: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          language?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          language?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          balance: number
          id: string
          inspector_reviews_completed: number
          last_review_reset: string | null
          last_updated: string
          like_reviews_completed: number
          reviews_completed: number
          reviews_limit : number
          user_id: string
          wheels_remaining: number
          theme: string
          balance: number
        }
        Insert: {
          balance?: number
          id?: string
          inspector_reviews_completed?: number
          last_review_reset?: string | null
          last_updated?: string
          like_reviews_completed?: number
          reviews_completed?: number
          user_id: string
          wheels_remaining?: number
          reviews_limit?: number
          theme?: string
          balance?: number
        }
        Update: {
          balance?: number
          id?: string
          inspector_reviews_completed?: number
          last_review_reset?: string | null
          last_updated?: string
          like_reviews_completed?: number
          reviews_completed?: number
          user_id?: string
          wheels_remaining?: number
          reviews_limit?: number
          theme?: string
          balance?: number
        }
        Relationships: []
      }
      user_withdrawal_details: {
        Row: {
          created_at: string
          details: Json
          id: string
          is_default: boolean | null
          method_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          details: Json
          id?: string
          is_default?: boolean | null
          method_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          details?: Json
          id?: string
          is_default?: boolean | null
          method_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_withdrawal_details_method_id_fkey"
            columns: ["method_id"]
            isOneToOne: false
            referencedRelation: "withdrawal_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          address: string
          balance: number
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          balance?: number
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          balance?: number
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      withdrawal_methods: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          amount: number
          created_at: string
          details: Json | null
          id: string
          method_id: string
          processed_at: string | null
          status: string
          updated_at: string
          user_id: string
          withdrawal_detail_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          details?: Json | null
          id?: string
          method_id: string
          processed_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
          withdrawal_detail_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          details?: Json | null
          id?: string
          method_id?: string
          processed_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          withdrawal_detail_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_method_id_fkey"
            columns: ["method_id"]
            isOneToOne: false
            referencedRelation: "withdrawal_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "withdrawals_withdrawal_detail_id_fkey"
            columns: ["withdrawal_detail_id"]
            isOneToOne: false
            referencedRelation: "user_withdrawal_details"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
