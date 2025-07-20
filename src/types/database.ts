export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: "owner" | "admin" | "user"
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          email: string
          role?: "owner" | "admin" | "user"
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          role?: "owner" | "admin" | "user"
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      api_keys: {
        Row: {
          id: string
          user_id: string
          key_name: string
          api_key: string
          is_active: boolean
          rate_limit: number
          usage_count: number
          created_at: string
          updated_at: string
          last_used_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          key_name: string
          api_key: string
          is_active?: boolean
          rate_limit?: number
          usage_count?: number
          created_at?: string
          updated_at?: string
          last_used_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          key_name?: string
          api_key?: string
          is_active?: boolean
          rate_limit?: number
          usage_count?: number
          created_at?: string
          updated_at?: string
          last_used_at?: string | null
        }
      }
      sms_logs: {
        Row: {
          id: string
          api_key_id: string
          phone_number: string
          message: string
          status: "pending" | "sent" | "failed"
          response_data: any
          created_at: string
          sent_at: string | null
        }
        Insert: {
          id?: string
          api_key_id: string
          phone_number: string
          message: string
          status?: "pending" | "sent" | "failed"
          response_data?: any
          created_at?: string
          sent_at?: string | null
        }
        Update: {
          id?: string
          api_key_id?: string
          phone_number?: string
          message?: string
          status?: "pending" | "sent" | "failed"
          response_data?: any
          created_at?: string
          sent_at?: string | null
        }
      }
      usage_stats: {
        Row: {
          id: string
          api_key_id: string
          date: string
          sms_count: number
          success_count: number
          failed_count: number
          created_at: string
        }
        Insert: {
          id?: string
          api_key_id: string
          date: string
          sms_count?: number
          success_count?: number
          failed_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          api_key_id?: string
          date?: string
          sms_count?: number
          success_count?: number
          failed_count?: number
          created_at?: string
        }
      }
      coupon_codes: {
        Row: {
          id: string
          code: string
          value: number
          usage_limit: number
          current_uses: number
          expires_at: string | null
          created_by: string | null
          created_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          code: string
          value: number
          usage_limit?: number
          current_uses?: number
          expires_at?: string | null
          created_by?: string | null
          created_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          code?: string
          value?: number
          usage_limit?: number
          current_uses?: number
          expires_at?: string | null
          created_by?: string | null
          created_at?: string
          is_active?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "owner" | "admin" | "user"
      sms_status: "pending" | "sent" | "failed"
    }
  }
}

// Explicit re-export so Build tools always detect it

// ⬇️ put this at the very end of the file
// A dummy value so tools that do a dynamic import see a real export.
export const Database: Database = {} as any
