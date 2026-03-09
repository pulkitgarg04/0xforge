const { app, BrowserWindow } = require('electron');
const path = require('path');

const { setupAppMenu } = require('./menu');
const { setupTerminalHandlers } = require('./terminal');
const { setupDialogHandlers } = require('./dialogs');
const { setupFileSystemHandlers } = require('./fileSystem');
const { setupGitHandlers } = require('./git');
const { setupStoreHandlers } = require('./store');

app.name = '0xForge';

let mainWindow = null;

const getMainWindow = () => mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#1a1510',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 15, y: 14 },
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    show: false,
  });

  if (process.env.VITE_DEV_SERVER) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
};

setupDialogHandlers(getMainWindow);
setupFileSystemHandlers();
setupGitHandlers(getMainWindow);
setupStoreHandlers();

app.whenReady().then(() => {
  setupAppMenu(createWindow);
  createWindow();
  setupTerminalHandlers(mainWindow);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});