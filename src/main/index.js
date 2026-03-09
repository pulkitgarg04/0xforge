const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

const getSettingsPath = () => path.join(app.getPath('userData'), 'settings.json');

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#0e0e10',
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

ipcMain.handle('dialog:openFolder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select Workspace Folder',
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

ipcMain.handle('dialog:newFile', async () => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Create New File',
    buttonLabel: 'Create',
    filters: [
      { name: 'C++ Files', extensions: ['cpp', 'h'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });
  if (result.canceled || !result.filePath) return null;
  try {
    await fs.promises.writeFile(result.filePath, '', 'utf-8');
    return result.filePath;
  } catch {
    return null;
  }
});

ipcMain.handle('fs:readDir', async (_event, dirPath) => {
  try {
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
    const items = entries
      .filter((e) => !e.name.startsWith('.'))
      .map((e) => ({
        name: e.name,
        path: path.join(dirPath, e.name),
        isDirectory: e.isDirectory(),
      }))
      .sort((a, b) => {
        if (a.isDirectory === b.isDirectory) return a.name.localeCompare(b.name);
        return a.isDirectory ? -1 : 1;
      });
    return items;
  } catch {
    return [];
  }
});

ipcMain.handle('fs:readFile', async (_event, filePath) => {
  try {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return content;
  } catch {
    return null;
  }
});

ipcMain.handle('fs:writeFile', async (_event, filePath, content) => {
  try {
    await fs.promises.writeFile(filePath, content, 'utf-8');
    return true;
  } catch {
    return false;
  }
});

ipcMain.handle('fs:createFile', async (_event, filePath) => {
  try {
    await fs.promises.writeFile(filePath, '', 'utf-8');
    return true;
  } catch {
    return false;
  }
});

ipcMain.handle('fs:createFolder', async (_event, dirPath) => {
  try {
    await fs.promises.mkdir(dirPath, { recursive: true });
    return true;
  } catch {
    return false;
  }
});

ipcMain.handle('fs:deleteFile', async (_event, filePath) => {
  try {
    const stat = await fs.promises.stat(filePath);
    if (stat.isDirectory()) {
      await fs.promises.rm(filePath, { recursive: true, force: true });
    } else {
      await fs.promises.unlink(filePath);
    }
    return true;
  } catch {
    return false;
  }
});

ipcMain.handle('store:get', async (_event, key) => {
  try {
    const settingsPath = getSettingsPath();
    if (!fs.existsSync(settingsPath)) return null;
    const data = await fs.promises.readFile(settingsPath, 'utf-8');
    const settings = JSON.parse(data);
    return key ? settings[key] : settings;
  } catch (error) {
    console.error('Failed to read settings:', error);
    return null;
  }
});

ipcMain.handle('store:set', async (_event, key, value) => {
  try {
    const settingsPath = getSettingsPath();
    let settings = {};
    if (fs.existsSync(settingsPath)) {
      const data = await fs.promises.readFile(settingsPath, 'utf-8');
      settings = JSON.parse(data);
    }
    settings[key] = value;
    await fs.promises.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Failed to write settings:', error);
    return false;
  }
});

app.whenReady().then(() => {
  createWindow();

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