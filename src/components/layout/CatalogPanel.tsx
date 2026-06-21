import { useCatalogStore } from '../../store/catalogStore'
import { CATEGORIES, type Category } from '../../types'

export function CatalogPanel() {
  const searchQuery = useCatalogStore((s) => s.searchQuery)
  const setSearchQuery = useCatalogStore((s) => s.setSearchQuery)
  const categoryFilter = useCatalogStore((s) => s.categoryFilter)
  const setCategoryFilter = useCatalogStore((s) => s.setCategoryFilter)
  const getFilteredProducts = useCatalogStore((s) => s.getFilteredProducts)
  const addToStaging = useCatalogStore((s) => s.addToStaging)
  const stagingProductIds = useCatalogStore((s) => s.stagingProductIds)

  const filteredProducts = getFilteredProducts()

  const categoryLabels: Record<Category, string> = {
    beverages: 'Beverages',
    snacks: 'Snacks',
    suncare: 'Suncare',
    household: 'Household',
    ice_cream: 'Ice Cream',
    fresh: 'Fresh',
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>Products</div>

      <input
        style={styles.search}
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <select
        style={styles.select}
        value={categoryFilter ?? ''}
        onChange={(e) => setCategoryFilter((e.target.value || null) as Category | null)}
      >
        <option value="">All Categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>{categoryLabels[cat]}</option>
        ))}
      </select>

      <div style={styles.list}>
        {filteredProducts.map((product) => {
          const isStaged = stagingProductIds.includes(product.id)
          return (
            <button
              key={product.id}
              style={{
                ...styles.item,
                ...(isStaged ? styles.itemStaged : {}),
              }}
              onClick={() => addToStaging(product.id)}
            >
              <div
                style={{
                  ...styles.swatch,
                  background: product.color,
                  border: product.color === '#FFFFFF' || product.color === '#FFFAF0' || product.color === '#FFF8DC'
                    ? '1px solid #d1d5db'
                    : 'none',
                }}
              />
              <div style={styles.itemText}>
                <div style={styles.itemName}>{product.name}</div>
                <div style={styles.itemCategory}>{categoryLabels[product.category]}</div>
              </div>
              {isStaged && <span style={styles.stagedBadge}>staged</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: 0,
  },
  header: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: 'var(--text-secondary)',
    padding: '12px 12px 8px',
  },
  search: {
    margin: '0 12px 8px',
    padding: '7px 10px',
    border: '1px solid var(--panel-border)',
    borderRadius: 6,
    fontSize: 13,
    outline: 'none',
  },
  select: {
    margin: '0 12px 8px',
    padding: '6px 8px',
    border: '1px solid var(--panel-border)',
    borderRadius: 6,
    fontSize: 12,
    background: 'var(--panel-bg)',
    outline: 'none',
  },
  list: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 8px 8px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    padding: '8px',
    borderRadius: 6,
    textAlign: 'left',
    transition: 'background 0.1s',
    background: 'transparent',
  },
  itemStaged: {
    background: 'var(--selected)',
  },
  swatch: {
    width: 20,
    height: 20,
    borderRadius: 4,
    flexShrink: 0,
  },
  itemText: {
    flex: 1,
    minWidth: 0,
  },
  itemName: {
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemCategory: {
    fontSize: 11,
    color: 'var(--text-secondary)',
  },
  stagedBadge: {
    fontSize: 10,
    fontWeight: 600,
    padding: '2px 5px',
    borderRadius: 3,
    background: 'var(--primary)',
    color: '#fff',
  },
}
