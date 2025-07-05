import React from 'react'
import Editor from '@monaco-editor/react'
import { useState } from 'react'

const Codeditor = () => {
  const editorOptions = {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'JetBrains Mono, Consolas, monospace',
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    automaticLayout: true,
  }
  const [value, setValue] = useState('')

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#000000' }}>
        <Editor 
          height="100%" 
          theme='vs-dark'  
          defaultLanguage="javascript" 
          defaultValue="// some comment" 
          options={editorOptions}
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
    </div>
  )
}

export default Codeditor