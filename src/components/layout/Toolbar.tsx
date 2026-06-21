import { useUIStore } from '../../store/uiStore'
import { usePlanogramStore } from '../../store/planogramStore'

export function Toolbar() {
  const viewMode = useUIStore((s) => s.viewMode)
  const showLabels = useUIStore((s) => s.showLabels)
  const toggleView = useUIStore((s) => s.toggleView)
  const toggleLabels = useUIStore((s) => s.toggleLabels)
  const editorMode = useUIStore((s) => s.editorMode)
  const panelOpen = useUIStore((s) => s.panelOpen)
  const togglePanel = useUIStore((s) => s.togglePanel)

  const addBay = usePlanogramStore((s) => s.addBay)
  const planogram = usePlanogramStore((s) => s.activePlanogram)
  const removeBay = usePlanogramStore((s) => s.removeBay)
  const addShelf = usePlanogramStore((s) => s.addShelf)
  const removeShelf = usePlanogramStore((s) => s.removeShelf)

  const lastBayId = planogram?.bays[planogram.bays.length - 1]?.id
  const lastBayShelves = planogram?.shelves.filter((s) => s.bayId === lastBayId) ?? []
  const lastShelfId = lastBayShelves[lastBayShelves.length - 1]?.id

  return (
    <div style={styles.toolbar}>
      <button style={styles.panelToggle} onClick={togglePanel}>
        {panelOpen ? '◀' : '▶'}
      </button>

      <span style={styles.title}>Planogram AI</span>

      <span style={styles.modeBadge}>
        {editorMode === 'ai' ? 'AI Mode' : 'Manual'}
      </span>

      <div style={styles.divider} />

      <button
        style={{
          ...styles.btn,
          ...(viewMode === '2d' ? styles.btnActive : {}),
        }}
        onClick={toggleView}
      >
        2D
      </button>
      <button
        style={{
          ...styles.btn,
          ...(viewMode === '3d' ? styles.btnActive : {}),
        }}
        onClick={toggleView}
      >
        3D
      </button>

      <div style={styles.divider} />

      <button
        style={{
          ...styles.btn,
          ...(showLabels ? styles.btnActive : {}),
        }}
        onClick={toggleLabels}
      >
        Aa Labels
      </button>

      <div style={styles.divider} />

      <button style={styles.btn} onClick={addBay}>+ Bay</button>
      <button
        style={styles.btn}
        onClick={() => lastBayId && removeBay(lastBayId)}
        disabled={!planogram || planogram.bays.length <= 1}
      >
        - Bay
      </button>
      <button
        style={styles.btn}
        onClick={() => lastBayId && addShelf(lastBayId)}
      >
        + Shelf
      </button>
      <button
        style={styles.btn}
        onClick={() => lastShelfId && removeShelf(lastShelfId)}
        disabled={lastBayShelves.length <= 1}
      >
        - Shelf
      </button>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    background: 'var(--toolbar-bg)',
    borderBottom: '1px solid var(--panel-border)',
    flexShrink: 0,
  },
  panelToggle: {
    padding: '4px 8px',
    borderRadius: 4,
    background: 'var(--staging-bg)',
    fontSize: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
    marginRight: 8,
  },
  modeBadge: {
    fontSize: 11,
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: 4,
    background: 'var(--selected)',
    color: 'var(--primary)',
  },
  divider: {
    width: 1,
    height: 20,
    background: 'var(--panel-border)',
    margin: '0 4px',
  },
  btn: {
    padding: '5px 10px',
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 500,
    color: 'var(--text-primary)',
    background: 'var(--staging-bg)',
    transition: 'background 0.1s',
  },
  btnActive: {
    background: 'var(--selected)',
    color: 'var(--primary)',
  },
}
