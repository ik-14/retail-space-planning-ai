import { useState } from 'react'
import { useUIStore } from '../../store/uiStore'
import { usePlanogramStore } from '../../store/planogramStore'
import { storeProfiles } from '../../data/storeProfiles'
import type { PlanogramSummary, StoreProfile } from '../../types'
import { generatePlanogram } from '../../logic/generatePlanogram'
import { products } from '../../data/products'

export function HomeScreen() {
  const setScreen = useUIStore((s) => s.setScreen)
  const setEditorMode = useUIStore((s) => s.setEditorMode)
  const { createPlanogram, loadPlanogram, listSavedPlanograms, setPlacements } = usePlanogramStore()

  const [showAIModal, setShowAIModal] = useState(false)
  const [aiName, setAIName] = useState('')
  const [selectedProfile, setSelectedProfile] = useState<StoreProfile>(storeProfiles[0])
  const [bayCount, setBayCount] = useState(2)
  const [shelvesPerBay, setShelvesPerBay] = useState(4)

  const savedPlanograms: PlanogramSummary[] = listSavedPlanograms()

  const handleManual = () => {
    createPlanogram('New Planogram', 2, 4)
    setEditorMode('manual')
    setScreen('editor')
  }

  const handleAIGenerate = () => {
    createPlanogram(aiName || 'AI Planogram', bayCount, shelvesPerBay)
    const planogram = usePlanogramStore.getState().activePlanogram
    if (planogram) {
      const placements = generatePlanogram(selectedProfile, products, planogram.shelves)
      setPlacements(placements)
    }
    setEditorMode('ai')
    setScreen('editor')
  }

  const handleLoad = (id: string) => {
    loadPlanogram(id)
    setEditorMode('manual')
    setScreen('editor')
  }

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Planogram AI</h1>
      <p style={styles.subtitle}>AI-native 3D planogram editor</p>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Create New Planogram</h2>
        <div style={styles.cardRow}>
          <button style={styles.card} onClick={handleManual}>
            <div style={styles.cardTitle}>Manual</div>
            <div style={styles.cardDesc}>Start with empty bays and build from scratch</div>
          </button>
          <button style={styles.card} onClick={() => setShowAIModal(true)}>
            <div style={styles.cardTitle}>AI Generate</div>
            <div style={styles.cardDesc}>Pick a store profile and auto-fill shelves</div>
          </button>
        </div>
      </div>

      {savedPlanograms.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Saved Planograms</h2>
          <div style={styles.cardRow}>
            {savedPlanograms.map((p) => (
              <button key={p.id} style={styles.savedCard} onClick={() => handleLoad(p.id)}>
                <div style={styles.cardTitle}>{p.name}</div>
                <div style={styles.cardDesc}>Updated {formatTime(p.updatedAt)}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {showAIModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAIModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2>Generate Planogram</h2>
              <button style={styles.closeBtn} onClick={() => setShowAIModal(false)}>X</button>
            </div>

            <label style={styles.label}>Planogram Name</label>
            <input
              style={styles.input}
              value={aiName}
              onChange={(e) => setAIName(e.target.value)}
              placeholder="e.g. Beach Boulevard Store"
            />

            <label style={styles.label}>Select Store Profile</label>
            <div style={styles.profileRow}>
              {storeProfiles.map((profile) => (
                <button
                  key={profile.id}
                  style={{
                    ...styles.profileCard,
                    ...(selectedProfile.id === profile.id ? styles.profileSelected : {}),
                  }}
                  onClick={() => setSelectedProfile(profile)}
                >
                  <div style={styles.cardTitle}>{profile.name}</div>
                  <div style={styles.cardDesc}>{profile.description}</div>
                </button>
              ))}
            </div>

            <div style={styles.configRow}>
              <div>
                <label style={styles.label}>Bays</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  style={styles.numberInput}
                  value={bayCount}
                  onChange={(e) => setBayCount(Number(e.target.value))}
                />
              </div>
              <div>
                <label style={styles.label}>Shelves per bay</label>
                <input
                  type="number"
                  min={2}
                  max={6}
                  style={styles.numberInput}
                  value={shelvesPerBay}
                  onChange={(e) => setShelvesPerBay(Number(e.target.value))}
                />
              </div>
            </div>

            <button style={styles.generateBtn} onClick={handleAIGenerate}>
              Generate Planogram
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
    padding: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 700,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'var(--text-secondary)',
    marginBottom: 48,
  },
  section: {
    width: '100%',
    maxWidth: 600,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 16,
  },
  cardRow: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
  },
  card: {
    flex: 1,
    minWidth: 200,
    padding: 24,
    background: 'var(--panel-bg)',
    border: '1px solid var(--panel-border)',
    borderRadius: 12,
    textAlign: 'left',
    transition: 'border-color 0.15s',
  },
  savedCard: {
    padding: 16,
    background: 'var(--panel-bg)',
    border: '1px solid var(--panel-border)',
    borderRadius: 8,
    textAlign: 'left',
    minWidth: 160,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: 'var(--text-secondary)',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'var(--panel-bg)',
    borderRadius: 16,
    padding: 32,
    width: '90%',
    maxWidth: 640,
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  closeBtn: {
    fontSize: 18,
    fontWeight: 700,
    padding: '4px 12px',
    borderRadius: 4,
    background: 'var(--staging-bg)',
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--panel-border)',
    borderRadius: 8,
    fontSize: 14,
  },
  profileRow: {
    display: 'flex',
    gap: 12,
    marginTop: 8,
  },
  profileCard: {
    flex: 1,
    padding: 16,
    border: '2px solid var(--panel-border)',
    borderRadius: 10,
    textAlign: 'left',
    transition: 'border-color 0.15s',
  },
  profileSelected: {
    borderColor: 'var(--primary)',
    background: 'var(--selected)',
  },
  configRow: {
    display: 'flex',
    gap: 24,
    marginTop: 16,
  },
  numberInput: {
    width: 70,
    padding: '8px 12px',
    border: '1px solid var(--panel-border)',
    borderRadius: 8,
    fontSize: 14,
  },
  generateBtn: {
    marginTop: 24,
    width: '100%',
    padding: '12px 24px',
    background: 'var(--primary)',
    color: '#fff',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
  },
}
