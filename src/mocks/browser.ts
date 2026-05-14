import { setupWorker } from 'msw/browser'
import { taskHandlers } from './handlers/tasks'
import { aiHandlers } from './handlers/ai'
import { settingsHandlers } from './handlers/settings'

export const worker = setupWorker(...taskHandlers, ...aiHandlers, ...settingsHandlers)
