import { useEffect, useState } from 'react'
import { useTasksStore } from '../../store/tasks'
import { useSettingsStore } from '../../store/settings'
import { SegControl } from '../../components/common/SegControl'
import { Btn } from '../../components/common/Btn'
import { QuadrantGrid } from './QuadrantGrid'
import { MatrixList } from './MatrixList'
import { ClassifyDialog } from './ClassifyDialog'
import type { MatrixLayout } from '../../types/ui'
import type { ClassifyResult } from '../../types/api'
import styles from './Matrix.module.css'

export function MatrixScreen() {
  const { tasks, fetchTasks, classifyTasks, updateTask } = useTasksStore()
  const { matrixLayout, setMatrixLayout } = useSettingsStore()
  const [classifyOpen, setClassifyOpen] = useState(false)
  const [classifyResults, setClassifyResults] = useState<ClassifyResult[]>([])
  const [classifyLoading, setClassifyLoading] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const unclassified = tasks.filter(t => t.quadrant === 'unclassified' && t.status !== 'completed')

  const handleClassifyAll = async () => {
    if (!unclassified.length) return
    setClassifyLoading(true)
    try {
      const results = await classifyTasks(unclassified.map(t => t.id))
      setClassifyResults(results as ClassifyResult[])
      setClassifyOpen(true)
    } finally {
      setClassifyLoading(false)
    }
  }

  const handleAcceptAll = async (results: ClassifyResult[]) => {
    await Promise.all(
      results.map(r =>
        updateTask(r.task_id, { quadrant: r.suggested_quadrant })
      )
    )
    setClassifyOpen(false)
  }

  const LAYOUT_OPTIONS: { value: MatrixLayout; label: string }[] = [
    { value: '2x2', label: '2×2' },
    { value: 'list', label: 'List' },
    { value: 'hybrid', label: 'Hybrid' },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <SegControl
          options={LAYOUT_OPTIONS}
          value={matrixLayout}
          onChange={setMatrixLayout}
        />
        {unclassified.length > 0 && (
          <Btn
            variant="secondary"
            size="sm"
            loading={classifyLoading}
            onClick={handleClassifyAll}
          >
            ✦ Classify All ({unclassified.length})
          </Btn>
        )}
      </div>

      {matrixLayout === '2x2' || matrixLayout === 'hybrid' ? (
        <QuadrantGrid tasks={tasks} layout={matrixLayout} />
      ) : (
        <MatrixList tasks={tasks} />
      )}

      {classifyOpen && (
        <ClassifyDialog
          results={classifyResults}
          tasks={unclassified}
          onAcceptAll={handleAcceptAll}
          onClose={() => setClassifyOpen(false)}
        />
      )}
    </div>
  )
}
