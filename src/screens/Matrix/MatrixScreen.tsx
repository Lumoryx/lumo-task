import { useEffect, useState } from 'react'
import { useTasksStore } from '../../store/tasks'
import { useSettingsStore } from '../../store/settings'
import { LumoStatus } from '../../components/ai/LumoStatus'
import { QuadrantGrid } from './QuadrantGrid'
import { MatrixList } from './MatrixList'
import { MatrixHybrid } from './MatrixHybrid'
import { ClassifyDialog } from './ClassifyDialog'
import { UnclassifiedStrip } from './UnclassifiedStrip'

export function MatrixScreen() {
  const { tasks, fetchTasks, classifyTasks, updateTask } = useTasksStore()
  const { matrixLayout, language } = useSettingsStore()
  const lang = language
  const [classifyOpen, setClassifyOpen] = useState(false)
  const [classifyLoading, setClassifyLoading] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const activeTasks = tasks.filter(t => t.status !== 'completed')
  const unclassified = activeTasks.filter(t => t.quadrant === 'unclassified')

  const byQuadrant = {
    Q1: activeTasks.filter(t => t.quadrant === 'Q1'),
    Q2: activeTasks.filter(t => t.quadrant === 'Q2'),
    Q3: activeTasks.filter(t => t.quadrant === 'Q3'),
    Q4: activeTasks.filter(t => t.quadrant === 'Q4'),
  }

  const overload = byQuadrant.Q1.length >= 4

  const handleClassifyAll = async () => {
    if (!unclassified.length) return
    setClassifyLoading(true)
    try {
      await classifyTasks(unclassified.map(t => t.id))
      setClassifyOpen(true)
    } finally {
      setClassifyLoading(false)
    }
  }

  const handleApply = async (assign: Record<string, string>) => {
    await Promise.all(
      Object.entries(assign).map(([taskId, quadrant]) =>
        updateTask(taskId, { quadrant: quadrant as 'Q1' | 'Q2' | 'Q3' | 'Q4' })
      )
    )
    setClassifyOpen(false)
  }

  return (
    <div className="fade-in" style={{
      padding: '16px 28px 24px',
      display: 'flex', flexDirection: 'column',
      height: '100%', minHeight: 0,
      position: 'relative',
    }}>
      {/* Lumo status bar */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
        <LumoStatus variant="dot" text={
          overload
            ? (lang === 'zh' ? 'Q1 有点多了。要拆几件出去吗?' : 'Q1 is getting heavy. Want me to split a few out?')
            : (lang === 'zh' ? '我帮你给未分类任务标了象限。' : "I've tagged your unclassified tasks.")
        } />
      </div>

      {/* Overload banner */}
      {overload && (
        <div style={{
          padding: '10px 14px', marginBottom: 12,
          background: 'rgba(255, 179, 71, 0.06)',
          border: '1px solid rgba(255, 179, 71, 0.30)',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', gap: 12,
          fontSize: 12, color: 'var(--text-secondary)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--status-warning)', boxShadow: '0 0 6px var(--status-warning)' }} />
          <span style={{ flex: 1 }}>
            <span style={{ color: 'var(--status-warning)', fontWeight: 500 }}>
              {lang === 'zh' ? `Q1 现有 ${byQuadrant.Q1.length} 个任务` : `Q1 has ${byQuadrant.Q1.length} tasks`}
            </span>
            <span style={{ marginLeft: 8 }}>· {lang === 'zh' ? 'Q1 任务过多，建议拆分或移至其他象限' : 'Too many urgent tasks — consider delegating or rescheduling'}</span>
          </span>
          <button className="btn btn-ghost" style={{ height: 28, padding: '0 12px', fontSize: 12 }}>
            {lang === 'zh' ? '帮我拆分' : 'Help me split'}
          </button>
        </div>
      )}

      {/* Layout variants */}
      {matrixLayout === 'list' && (
        <MatrixList byQuadrant={byQuadrant} lang={lang} />
      )}
      {matrixLayout === 'hybrid' && (
        <MatrixHybrid byQuadrant={byQuadrant} lang={lang} />
      )}
      {(matrixLayout === '2x2' || !matrixLayout) && (
        <QuadrantGrid byQuadrant={byQuadrant} lang={lang} />
      )}

      {/* Unclassified strip */}
      {unclassified.length > 0 && (
        <UnclassifiedStrip
          tasks={unclassified}
          lang={lang}
          classifyLoading={classifyLoading}
          onClassifyAll={handleClassifyAll}
        />
      )}

      {/* Classify confirm dialog */}
      {classifyOpen && (
        <ClassifyDialog
          tasks={unclassified}
          lang={lang}
          onClose={() => setClassifyOpen(false)}
          onApply={handleApply}
        />
      )}
    </div>
  )
}
