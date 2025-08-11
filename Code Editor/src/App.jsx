import { useState } from 'react';
import Header from './Components/Header';
import Sidenav from './Components/Sidenav';
import Codeditor from './Components/Codeditor';
import { EditorProvider } from './EditorContext';
import './App.css';

function App() {
  const [openTabs, setOpenTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [explorerTree, setExplorerTree] = useState([]); // <-- holds the folder structure

  // Open file tab
  const handleOpenFile = async (file) => {
    // If file already open, just activate
    setOpenTabs((prevTabs) => {
      const exists = prevTabs.find((tab) => tab.path === file.path);
      return exists ? prevTabs : prevTabs;
    });
    setActiveTab(file.path); // Use file.path as tab ID

    // If file already open, don't reload content
    if (openTabs.find((tab) => tab.path === file.path)) return;

    // If file has content (opened from Header), use it
    if (file.content !== undefined) {
      setOpenTabs((prevTabs) => {
        const exists = prevTabs.find((tab) => tab.path === file.path);
        return exists ? prevTabs : [...prevTabs, file];
      });
      return;
    }

    // Otherwise, load content from disk
    if (window.electronAPI && window.electronAPI.readFile) {
      try {
        const content = await window.electronAPI.readFile(file.path);
        setOpenTabs((prevTabs) => {
          const exists = prevTabs.find((tab) => tab.path === file.path);
          return exists ? prevTabs : [...prevTabs, { ...file, content }];
        });
      } catch (err) {
        alert('Failed to read file: ' + err.message);
      }
    } else {
      alert('File reading not supported.');
    }
  };

  // Close tab
  const handleCloseTab = (path) => {
    setOpenTabs((prev) => prev.filter((tab) => tab.path !== path));
    if (activeTab === path && openTabs.length > 1) {
      const nextTab = openTabs.find((tab) => tab.path !== path);
      setActiveTab(nextTab?.path || null);
    } else if (openTabs.length === 1) {
      setActiveTab(null);
    }
  };

  return (
    <EditorProvider>
      <div className="app-container">
        <Header
          setExplorerTree={setExplorerTree}
          openFileInTab={handleOpenFile}
        />
        <div className="main-content">
          <Sidenav
            tree={explorerTree}
            onFileClick={handleOpenFile}
            setExplorerTree={setExplorerTree}
          />
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
    </EditorProvider>
  );
}

export default App;
