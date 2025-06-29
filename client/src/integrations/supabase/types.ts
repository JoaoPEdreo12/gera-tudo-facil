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
          full_name: string | null
          email: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          email?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          email?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          color: string
          priority: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          color: string
          priority: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          color?: string
          priority?: number
          created_at?: string
          updated_at?: string
        }
      }
      study_sessions: {
        Row: {
          id: string
          user_id: string
          subject_id: string | null
          topic_id: string | null
          title: string
          description: string | null
          scheduled_date: string
          scheduled_time: string | null
          duration_minutes: number
          status: 'pending' | 'in_progress' | 'completed' | 'skipped'
          priority: number
          type: 'study' | 'review' | 'exercise' | 'exam'
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id?: string | null
          topic_id?: string | null
          title: string
          description?: string | null
          scheduled_date: string
          scheduled_time?: string | null
          duration_minutes: number
          status?: 'pending' | 'in_progress' | 'completed' | 'skipped'
          priority: number
          type: 'study' | 'review' | 'exercise' | 'exam'
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string | null
          topic_id?: string | null
          title?: string
          description?: string | null
          scheduled_date?: string
          scheduled_time?: string | null
          duration_minutes?: number
          status?: 'pending' | 'in_progress' | 'completed' | 'skipped'
          priority?: number
          type?: 'study' | 'review' | 'exercise' | 'exam'
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      flashcards: {
        Row: {
          id: string
          user_id: string
          subject_id: string | null
          topic_id: string | null
          question: string
          answer: string
          difficulty: number
          next_review_date: string
          review_count: number
          correct_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject_id?: string | null
          topic_id?: string | null
          question: string
          answer: string
          difficulty: number
          next_review_date: string
          review_count?: number
          correct_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string | null
          topic_id?: string | null
          question?: string
          answer?: string
          difficulty?: number
          next_review_date?: string
          review_count?: number
          correct_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          total_points: number
          level: number
          streak_days: number
          last_study_date: string | null
          total_study_time_minutes: number
          completed_sessions: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_points?: number
          level?: number
          streak_days?: number
          last_study_date?: string | null
          total_study_time_minutes?: number
          completed_sessions?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_points?: number
          level?: number
          streak_days?: number
          last_study_date?: string | null
          total_study_time_minutes?: number
          completed_sessions?: number
          created_at?: string
          updated_at?: string
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
      [_ in never]: never
    }
  }
}