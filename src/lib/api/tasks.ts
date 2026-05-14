import { api } from './client'
import type {
  Task,
  TasksResponse,
  TodayResponse,
  ApiResponse,
  Quadrant,
  Priority,
} from '../../types/api'

export interface CreateTaskPayload {
  title: string
  description?: string
  quadrant?: Quadrant
  priority?: Priority
  today?: boolean
  due_date?: string
  estimated_mins?: number
  estimated_pomos?: number
}

export interface UpdateTaskPayload {
  title?: string
  description?: string
  quadrant?: Quadrant
  priority?: Priority
  status?: string
  today?: boolean
  due_date?: string
  estimated_mins?: number
  estimated_pomos?: number
}

export const tasksApi = {
  list: (params?: { quadrant?: Quadrant; today?: boolean }) => {
    const q = params?.quadrant ? `?quadrant=${params.quadrant}` : ''
    const t = params?.today ? `${q ? '&' : '?'}today=true` : ''
    return api.get<TasksResponse>(`/tasks${q}${t}`)
  },

  today: () => api.get<ApiResponse<TodayResponse>>('/tasks/today'),

  get: (id: string) => api.get<ApiResponse<Task>>(`/tasks/${id}`),

  create: (payload: CreateTaskPayload) =>
    api.post<ApiResponse<Task>>('/tasks', payload),

  update: (id: string, payload: UpdateTaskPayload) =>
    api.patch<ApiResponse<Task>>(`/tasks/${id}`, payload),

  complete: (id: string, actual_mins?: number) =>
    api.patch<ApiResponse<Task>>(`/tasks/${id}/complete`, { actual_mins }),

  toggleToday: (id: string, today: boolean) =>
    api.patch<ApiResponse<Task>>(`/tasks/${id}/today`, { today }),

  delete: (id: string) => api.delete<ApiResponse<{ deleted: boolean }>>(`/tasks/${id}`),

  startPomodoro: (taskId: string) =>
    api.post<ApiResponse<{ session_id: string }>>(`/tasks/${taskId}/pomodoros`),
}
