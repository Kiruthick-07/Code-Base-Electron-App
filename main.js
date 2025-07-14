const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;
const { spawn } = require('node-pty');

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

// Save file content
ipcMain.handle('file:save', async (event, filePath, content) => {
  fs.writeFileSync(filePath, content, 'utf-8');
  return true;
});

// Terminal integration
let mainWindow; // Will be assigned in createWindow
let shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';
let ptyProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load your Vite dev server
  mainWindow.loadURL('http://localhost:5173');

  // Start terminal process after window is created
  ptyProcess = spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.HOME || process.env.USERPROFILE,
    env: process.env,
  });

  ipcMain.on('terminal-input', (event, data) => {
    ptyProcess.write(data);
  });

  ptyProcess.onData((data) => {
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send('terminal-output', data);
    }
  });
}

app.whenReady().then(createWindow);


// Read file content
ipcMain.handle('file:read', async (event, filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content;
});
