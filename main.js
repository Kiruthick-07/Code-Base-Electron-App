const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

// Recursively build tree structure
function buildFileTree(dir) {
  const stats = fs.statSync(dir);
  if (stats.isFile()) {
    return {
      id: '_' + Math.random().toString(36).substr(2, 9),
      type: 'file',
      name: path.basename(dir),
      path: dir,
    };
  }

  return {
    id: '_' + Math.random().toString(36).substr(2, 9),
    type: 'folder',
    name: path.basename(dir),
    path: dir,
    expanded: true,
    children: fs.readdirSync(dir).map((child) =>
      buildFileTree(path.join(dir, child))
    ),
  };
}

// Handle folder open
ipcMain.handle('dialog:openFolder', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  if (result.canceled) return null;

  const folderPath = result.filePaths[0];
  const tree = buildFileTree(folderPath);
  return [tree]; // Return as array for consistency with existing structure
});

// Handle file open
ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openFile'] });
  if (result.canceled) return null;

  const filePath = result.filePaths[0];
  const content = fs.readFileSync(filePath, 'utf-8');

  return {
    id: '_' + Math.random().toString(36).substr(2, 9),
    type: 'file',
    name: path.basename(filePath),
    path: filePath,
    content,
  };
});

// Create new file
ipcMain.handle('file:create', async (_event, { parentPath, name }) => {
  const filePath = path.join(parentPath, name);
  await fsPromises.writeFile(filePath, '');
  return buildFileTree(parentPath);
});

// Create new folder
ipcMain.handle('folder:create', async (_event, { parentPath, name }) => {
  const folderPath = path.join(parentPath, name);
  await fsPromises.mkdir(folderPath);
  return buildFileTree(parentPath);
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load your Vite dev server
  win.loadURL('http://localhost:5173');
}

app.whenReady().then(createWindow);


// Read file content
ipcMain.handle('file:read', async (event, filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content;
});
