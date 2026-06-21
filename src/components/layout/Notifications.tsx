import { useNotificationStore } from '../../store/notificationStore'

export function Notifications() {
  const notifications = useNotificationStore((s) => s.notifications)
  const removeNotification = useNotificationStore((s) => s.removeNotification)

  if (notifications.length === 0) return null

  return (
    <div style={styles.container}>
      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            ...styles.toast,
            ...(n.type === 'error' ? styles.error : styles.info),
          }}
          onClick={() => removeNotification(n.id)}
        >
          {n.message}
        </div>
      ))}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    top: 60,
    right: 20,
    zIndex: 2000,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  toast: {
    padding: '10px 16px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    cursor: 'pointer',
    maxWidth: 300,
  },
  error: {
    background: '#fef2f2',
    color: '#991b1b',
    border: '1px solid #fecaca',
  },
  info: {
    background: '#eff6ff',
    color: '#1e40af',
    border: '1px solid #bfdbfe',
  },
}
