import { api } from './client'
import type { AIRecommendation, ClassifyResult, ApiResponse } from '../../types/api'

export const aiApi = {
  recommend: () =>
    api.post<ApiResponse<AIRecommendation>>('/ai/recommend'),

  classify: (taskIds: string[]) =>
    api.post<ApiResponse<ClassifyResult[]>>('/ai/classify', { task_ids: taskIds }),

  testConnection: (provider: string, apiKey: string, model: string) =>
    api.post<ApiResponse<{ ok: boolean; latency_ms: number }>>('/ai/test-connection', {
      provider,
      api_key: apiKey,
      model,
    }),

  parseTask: (input: string) =>
    api.post<ApiResponse<{
      title: string
      description?: string
      quadrant?: string
      priority?: string
      due_date?: string
      estimated_pomos?: number
    }>>('/ai/parse', { input }),
}
