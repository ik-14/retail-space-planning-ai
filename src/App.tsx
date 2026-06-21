import { useUIStore } from './store/uiStore'
import { HomeScreen } from './components/screens/HomeScreen'
import { EditorScreen } from './components/screens/EditorScreen'

function App() {
  const activeScreen = useUIStore((s) => s.activeScreen)

  if (activeScreen === 'editor') {
    return <EditorScreen />
  }

  return <HomeScreen />
}

export default App
