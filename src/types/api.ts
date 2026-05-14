export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
export type Quadrant = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'unclassified'
export type Priority = 'urgent' | 'high' | 'medium' | 'low'

export interface LocalizedText {
  en: string
  zh?: string
}

export interface Task {
  id: string
  title: LocalizedText
  description?: LocalizedText
  status: TaskStatus
  quadrant: Quadrant
  priority: Priority
  today: boolean
  due_date?: string
  estimated_mins?: number
  actual_mins: number
  estimated_pomos: number
  actual_pomos: number
  ai_reason?: LocalizedText
  conviction?: number
  created_at: string
  updated_at: string
  started_at?: string
  completed_at?: string
}

export interface AIRecommendation {
  task: Task
  reason: LocalizedText
  conviction: number
  not_now: Array<{ task_id: string; reason: LocalizedText }>
}

export interface ClassifyResult {
  task_id: string
  suggested_quadrant: 'Q1' | 'Q2' | 'Q3' | 'Q4'
  reason: LocalizedText
}

export interface PomodoroSession {
  id: string
  task_id: string
  started_at: string
  completed_at?: string
  abandoned_at?: string
  duration_mins: number
  status: 'active' | 'paused' | 'completed' | 'abandoned'
}

export interface AppSettings {
  accent: 'green' | 'violet' | 'coral' | 'gold'
  language: 'en' | 'zh'
  density: 'compact' | 'default' | 'spacious'
  reduced_motion: boolean
  today_card_variant: 'classic' | 'conviction' | 'path'
  matrix_layout: '2x2' | 'list' | 'hybrid'
  pomodoro_duration_mins: number
  short_break_mins: number
  long_break_mins: number
  pomos_before_long_break: number
}

export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'deepseek' | 'gemini'
  api_key_masked?: string
  model: string
  max_tokens: number
}

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
}

export interface ApiResponse<T> {
  data: T
  error?: string
}

export interface TasksResponse {
  data: Task[]
  total: number
}

export interface TodayResponse {
  tasks: Task[]
  recommended: AIRecommendation | null
}
