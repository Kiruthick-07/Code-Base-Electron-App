const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFolder: () => ipcRenderer.invoke('dialog:openFolder'),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  readFile: (filePath) => ipcRenderer.invoke('file:read', filePath),
  saveFile: (filePath, content) => ipcRenderer.invoke('file:save', filePath, content),
  createFile: (parentPath, name) => ipcRenderer.invoke('file:create', { parentPath, name }),
  createFolder: (parentPath, name) => ipcRenderer.invoke('folder:create', { parentPath, name }),
});