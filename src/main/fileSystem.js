const { ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

function setupFileSystemHandlers() {
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

    ipcMain.handle('fs:pathJoin', async (_event, ...args) => {
        return path.join(...args);
    });
}

module.exports = { setupFileSystemHandlers };
