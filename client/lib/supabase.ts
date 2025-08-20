import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database schema
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: 'user' | 'admin'
          department: string | null
          created_at: string
          last_login: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          role: 'user' | 'admin'
          department?: string | null
          created_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'user' | 'admin'
          department?: string | null
          created_at?: string
          last_login?: string | null
        }
      }
      machines: {
        Row: {
          id: string
          name: string
          type: string
          location: string
          status: 'operational' | 'maintenance' | 'offline'
          last_maintenance: string | null
          next_maintenance: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          location: string
          status?: 'operational' | 'maintenance' | 'offline'
          last_maintenance?: string | null
          next_maintenance?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          location?: string
          status?: 'operational' | 'maintenance' | 'offline'
          last_maintenance?: string | null
          next_maintenance?: string | null
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          machine_id: string
          machine_name: string
          task_name: string
          description: string
          frequency: 'daily' | 'weekly' | 'monthly'
          category: 'maintenance' | 'inspection' | 'cleaning'
          estimated_time_minutes: number
          weekly_day: string | null
          safety_notes: string[]
          required_tools: string[]
          is_active: boolean
          created_date: string
          next_due_date: string
          last_completed_date: string | null
        }
        Insert: {
          id?: string
          machine_id: string
          machine_name: string
          task_name: string
          description: string
          frequency: 'daily' | 'weekly' | 'monthly'
          category: 'maintenance' | 'inspection' | 'cleaning'
          estimated_time_minutes: number
          weekly_day?: string | null
          safety_notes: string[]
          required_tools: string[]
          is_active?: boolean
          created_date?: string
          next_due_date: string
          last_completed_date?: string | null
        }
        Update: {
          id?: string
          machine_id?: string
          machine_name?: string
          task_name?: string
          description?: string
          frequency?: 'daily' | 'weekly' | 'monthly'
          category?: 'maintenance' | 'inspection' | 'cleaning'
          estimated_time_minutes?: number
          weekly_day?: string | null
          safety_notes?: string[]
          required_tools?: string[]
          is_active?: boolean
          created_date?: string
          next_due_date?: string
          last_completed_date?: string | null
        }
      }
      task_completions: {
        Row: {
          id: string
          task_id: string
          user_id: string
          user_name: string
          completed_date: string
          notes: string | null
          time_spent_minutes: number | null
          photos: string[]
          checklist_items: any
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          user_name: string
          completed_date?: string
          notes?: string | null
          time_spent_minutes?: number | null
          photos?: string[]
          checklist_items: any
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          user_name?: string
          completed_date?: string
          notes?: string | null
          time_spent_minutes?: number | null
          photos?: string[]
          checklist_items?: any
        }
      }
      task_progress: {
        Row: {
          id: string
          task_id: string
          user_id: string
          user_name: string
          saved_date: string
          checklist_items: any
          notes: string | null
          photos: string[]
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          user_name: string
          saved_date?: string
          checklist_items: any
          notes?: string | null
          photos?: string[]
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          user_name?: string
          saved_date?: string
          checklist_items?: any
          notes?: string | null
          photos?: string[]
        }
      }
    }
  }
}
