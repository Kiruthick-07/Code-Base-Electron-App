const { app, BrowserWindow } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:5173'); // Make sure this matches your Vite port
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, 'Code Editor/dist/index.html'));
  }
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
