import { useRef, useState } from 'react'
import Header from './Components/Header'
import Sidenav from './Components/Sidenav'
import Codeditor from './Components/Codeditor'
import './App.css'

function App() {
  const [openTabs, setOpenTabs] = useState([])
  const [activeTab, setActiveTab] = useState(null)

  const handleOpenFile = (file) => {
    setOpenTabs((prevTabs) => {
      // Prevent duplicate tabs
      const exists = prevTabs.find((tab) => tab.id === file.id)
      return exists ? prevTabs : [...prevTabs, file]
    })
    setActiveTab(file.id)
  }

  const handleCloseTab = (id) => {
    setOpenTabs((prev) => prev.filter((tab) => tab.id !== id))
    if (activeTab === id && openTabs.length > 1) {
      const nextTab = openTabs.find((tab) => tab.id !== id)
      setActiveTab(nextTab?.id || null)
    } else if (openTabs.length === 1) {
      setActiveTab(null)
    }
  }

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <Sidenav onFileOpen={handleOpenFile} />
        <div className="editor-container">
          <Codeditor
            openTabs={openTabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onCloseTab={handleCloseTab}
            setOpenTabs={setOpenTabs}
          />
        </div>
      </div>
    </div>
  )
}

export default App
