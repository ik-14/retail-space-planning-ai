import { useUIStore } from '../../store/uiStore'
import { usePlanogramStore } from '../../store/planogramStore'
import { useCatalogStore } from '../../store/catalogStore'

export function PropertiesPanel() {
  const selectedPlacementId = useUIStore((s) => s.selectedPlacementId)
  const selectPlacement = useUIStore((s) => s.selectPlacement)
  const planogram = usePlanogramStore((s) => s.activePlanogram)
  const updatePlacement = usePlanogramStore((s) => s.updatePlacement)
  const removePlacement = usePlanogramStore((s) => s.removePlacement)
  const products = useCatalogStore((s) => s.products)
  const addShelf = usePlanogramStore((s) => s.addShelf)
  const removeShelf = usePlanogramStore((s) => s.removeShelf)

  if (!planogram) return null

  const placement = selectedPlacementId
    ? planogram.placements.find((p) => p.id === selectedPlacementId)
    : null

  const product = placement
    ? products.find((p) => p.id === placement.productId)
    : null

  const shelf = placement
    ? planogram.shelves.find((s) => s.id === placement.shelfId)
    : null

  const bay = shelf
    ? planogram.bays.find((b) => b.id === shelf.bayId)
    : null

  if (!placement || !product) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>Properties</div>
        <div style={styles.empty}>
          <p style={styles.emptyText}>Click a product in the 3D scene to view its properties</p>
        </div>

        <div style={styles.header}>Bays</div>
        <div style={styles.bayList}>
          {[...planogram.bays].sort((a, b) => a.order - b.order).map((b) => {
            const bayShelves = planogram.shelves.filter((s) => s.bayId === b.id)
            return (
              <div key={b.id} style={styles.bayItem}>
                <span style={styles.bayLabel}>Bay {b.order + 1}</span>
                <span style={styles.bayInfo}>{bayShelves.length} shelves</span>
                <button
                  style={styles.smallBtn}
                  onClick={() => addShelf(b.id)}
                >+</button>
                <button
                  style={styles.smallBtn}
                  onClick={() => {
                    const last = bayShelves[bayShelves.length - 1]
                    if (last && bayShelves.length > 1) removeShelf(last.id)
                  }}
                  disabled={bayShelves.length <= 1}
                >-</button>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>Properties</div>

      <div style={styles.section}>
        <div style={styles.productRow}>
          <div style={{ ...styles.swatch, background: product.color }} />
          <div>
            <div style={styles.productName}>{product.name}</div>
            <div style={styles.productMeta}>
              Bay {bay ? bay.order + 1 : '?'}, Shelf {shelf ? shelf.order + 1 : '?'}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.label}>Facings</div>
        <div style={styles.facingsRow}>
          <button
            style={styles.facingBtn}
            onClick={() => {
              if (placement.facings > 1) {
                updatePlacement(placement.id, { facings: placement.facings - 1 })
              }
            }}
            disabled={placement.facings <= 1}
          >-</button>
          <span style={styles.facingValue}>{placement.facings}</span>
          <button
            style={styles.facingBtn}
            onClick={() => updatePlacement(placement.id, { facings: placement.facings + 1 })}
          >+</button>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.hint}>Drag product in 3D scene to move it</div>
      </div>

      <div style={styles.section}>
        <button
          style={styles.deleteBtn}
          onClick={() => {
            removePlacement(placement.id)
            selectPlacement(null)
          }}
        >
          Delete Product
        </button>
      </div>

      <div style={styles.section}>
        <button
          style={styles.deselectBtn}
          onClick={() => selectPlacement(null)}
        >
          Deselect
        </button>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '0 0 12px',
    borderTop: '1px solid var(--panel-border)',
  },
  header: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: 'var(--text-secondary)',
    padding: '12px 12px 8px',
  },
  empty: {
    padding: '8px 12px',
  },
  emptyText: {
    fontSize: 12,
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  section: {
    padding: '4px 12px',
  },
  productRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  swatch: {
    width: 24,
    height: 24,
    borderRadius: 4,
    flexShrink: 0,
  },
  productName: {
    fontSize: 14,
    fontWeight: 600,
  },
  productMeta: {
    fontSize: 11,
    color: 'var(--text-secondary)',
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: 4,
  },
  facingsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  facingBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    background: 'var(--staging-bg)',
    fontSize: 16,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  facingValue: {
    fontSize: 16,
    fontWeight: 600,
    minWidth: 20,
    textAlign: 'center',
  },
  hint: {
    fontSize: 11,
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
    marginTop: 4,
  },
  deleteBtn: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 6,
    background: 'var(--danger)',
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
    marginTop: 4,
  },
  deselectBtn: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 6,
    background: 'var(--staging-bg)',
    color: 'var(--text-secondary)',
    fontSize: 12,
    fontWeight: 500,
  },
  bayList: {
    padding: '0 12px',
  },
  bayItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 0',
  },
  bayLabel: {
    fontSize: 13,
    fontWeight: 500,
    flex: 1,
  },
  bayInfo: {
    fontSize: 11,
    color: 'var(--text-secondary)',
  },
  smallBtn: {
    width: 22,
    height: 22,
    borderRadius: 4,
    background: 'var(--staging-bg)',
    fontSize: 14,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}
