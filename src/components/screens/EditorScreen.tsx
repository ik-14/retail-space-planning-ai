import { useUIStore } from '../../store/uiStore'
import { usePlanogramStore } from '../../store/planogramStore'
import { PlanogramScene } from '../scene/PlanogramScene'
import { Toolbar } from '../layout/Toolbar'
import { LeftPanel } from '../layout/LeftPanel'
import { Notifications } from '../layout/Notifications'

export function EditorScreen() {
  const planogram = usePlanogramStore((s) => s.activePlanogram)
  const setScreen = useUIStore((s) => s.setScreen)
  const savePlanogram = usePlanogramStore((s) => s.savePlanogram)

  if (!planogram) return null

  return (
    <div style={styles.container}>
      <Notifications />
      <Toolbar />

      <div style={styles.body}>
        <LeftPanel />
        <div style={styles.canvas}>
          <PlanogramScene />
        </div>
      </div>

      {/* Status bar */}
      <div style={styles.statusBar}>
        <span>{planogram.name}</span>
        <div style={styles.statusActions}>
          <button style={styles.statusBtn} onClick={savePlanogram}>Save</button>
          <button style={styles.statusBtn} onClick={() => setScreen('home')}>Home</button>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  body: {
    display: 'flex',
    flex: 1,
    minHeight: 0,
  },
  canvas: {
    flex: 1,
    background: '#fafafa',
  },
  statusBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 20px',
    background: 'var(--panel-bg)',
    borderTop: '1px solid var(--panel-border)',
    fontSize: 13,
    color: 'var(--text-secondary)',
  },
  statusActions: {
    display: 'flex',
    gap: 8,
  },
  statusBtn: {
    padding: '4px 12px',
    borderRadius: 4,
    background: 'var(--staging-bg)',
    fontSize: 12,
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
}
