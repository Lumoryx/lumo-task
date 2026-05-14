import { api } from './client'
import type { AppSettings, AIConfig, ApiResponse } from '../../types/api'

export const settingsApi = {
  getAll: () => api.get<ApiResponse<AppSettings>>('/settings'),

  update: (key: keyof AppSettings, value: unknown) =>
    api.put<ApiResponse<AppSettings>>(`/settings/${key}`, { value }),

  getAI: () => api.get<ApiResponse<AIConfig>>('/settings/ai'),

  saveAI: (config: Partial<AIConfig> & { api_key?: string }) =>
    api.put<ApiResponse<AIConfig>>('/settings/ai', config),
}
