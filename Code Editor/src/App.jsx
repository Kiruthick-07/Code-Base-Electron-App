import { useState } from 'react'
import Header from './Components/Header'
import Sidenav from './Components/Sidenav'
import Codeditor from './Components/Codeditor'
import './App.css'

function App() {
  
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <Sidenav />
        <div className="editor-container">
          <Codeditor />
        </div>
      </div>
    </div>
  )
}

export default App
