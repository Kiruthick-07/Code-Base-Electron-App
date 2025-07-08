const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Add any API methods you need here
  // For example:
  // saveFile: (data) => ipcRenderer.invoke('save-file', data),
  // loadFile: () => ipcRenderer.invoke('load-file'),
}) 