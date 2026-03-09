const { ipcMain, dialog } = require('electron');
const fs = require('fs');

function setupDialogHandlers(getMainWindow) {
    ipcMain.handle('dialog:openFolder', async () => {
        const win = getMainWindow();
        const result = await dialog.showOpenDialog(win, {
            properties: ['openDirectory'],
            title: 'Select Workspace Folder',
        });

        if (result.canceled || result.filePaths.length === 0) return null;
        return result.filePaths[0];
    });

    ipcMain.handle('dialog:newFile', async () => {
        const win = getMainWindow();
        const result = await dialog.showSaveDialog(win, {
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
}

module.exports = { setupDialogHandlers };
