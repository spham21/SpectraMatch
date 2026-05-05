/**
 * Supabase auto-generated database types stub.
 *
 * Run `npx supabase gen types typescript --linked > lib/database.types.ts`
 * after linking your project to regenerate with real types.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          display_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      personality_profiles: {
        Row: {
          id: string
          user_id: string
          mbti_type: string
          ei_score: number
          sn_score: number
          tf_score: number
          jp_score: number
          personality_excerpt: string | null
          compatibility_excerpt: string | null
          excerpt_feedback: boolean | null
          is_current: boolean
          schema_version: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mbti_type: string
          ei_score: number
          sn_score: number
          tf_score: number
          jp_score: number
          personality_excerpt?: string | null
          compatibility_excerpt?: string | null
          excerpt_feedback?: boolean | null
          is_current?: boolean
          schema_version?: number
          created_at?: string
        }
        Update: {
          personality_excerpt?: string | null
          compatibility_excerpt?: string | null
          excerpt_feedback?: boolean | null
          is_current?: boolean
        }
      }
      test_answers: {
        Row: {
          id: string
          user_id: string
          session_id: string
          question_id: string
          score: number
          answered_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_id: string
          question_id: string
          score: number
          answered_at?: string
        }
        Update: Record<string, never>
      }
      excerpt_prompts: {
        Row: {
          id: string
          prompt_type: string
          mbti_type: string | null
          system_prompt: string
          user_prompt_template: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          prompt_type: string
          mbti_type?: string | null
          system_prompt: string
          user_prompt_template: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          system_prompt?: string
          user_prompt_template?: string
          is_active?: boolean
        }
      }
      compatibility_map: {
        Row: {
          id: string
          mbti_type: string
          compatible_types: string[]
          compatibility_rationale: string
          created_at: string
        }
        Insert: {
          id?: string
          mbti_type: string
          compatible_types: string[]
          compatibility_rationale: string
          created_at?: string
        }
        Update: {
          compatible_types?: string[]
          compatibility_rationale?: string
        }
      }
      match_scores: {
        Row: {
          id: string
          user_a: string
          user_b: string
          final_score: number
          created_at: string
        }
        Insert: {
          id?: string
          user_a: string
          user_b: string
          final_score: number
          created_at?: string
        }
        Update: Record<string, never>
      }
      feature_flags: {
        Row: {
          id: string
          name: string
          enabled: boolean
          rollout_pct: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          enabled?: boolean
          rollout_pct?: number | null
          created_at?: string
        }
        Update: {
          enabled?: boolean
          rollout_pct?: number | null
        }
      }
      analytics_events: {
        Row: {
          id: string
          user_id: string | null
          event_name: string
          properties: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          event_name: string
          properties?: Json
          created_at?: string
        }
        Update: Record<string, never>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
