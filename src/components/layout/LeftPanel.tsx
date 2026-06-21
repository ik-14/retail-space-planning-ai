import { useUIStore } from '../../store/uiStore'
import { CatalogPanel } from './CatalogPanel'
import { PropertiesPanel } from './PropertiesPanel'

export function LeftPanel() {
  const panelOpen = useUIStore((s) => s.panelOpen)

  if (!panelOpen) return null

  return (
    <div style={styles.panel}>
      <CatalogPanel />
      <PropertiesPanel />
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    width: 240,
    background: 'var(--panel-bg)',
    borderRight: '1px solid var(--panel-border)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    flexShrink: 0,
  },
}
