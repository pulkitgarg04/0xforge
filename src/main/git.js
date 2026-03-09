const { ipcMain, shell } = require('electron');
const { execFile, exec } = require('child_process');
const path = require('path');

function setupGitHandlers(getMainWindow) {
    ipcMain.handle('git:check', async () => {
        return new Promise((resolve) => {
            const cmd = process.platform === 'win32' ? 'where' : 'which';
            execFile(cmd, ['git'], (error) => {
                resolve(!error);
            });
        });
    });

    ipcMain.handle('git:install', async () => {
        if (process.platform === 'darwin') {
            return new Promise((resolve) => {
                exec('xcode-select --install', (error) => {
                    if (error) {
                        shell.openExternal('https://git-scm.com/download/mac');
                    }
                    resolve(true);
                });
            });
        } else if (process.platform === 'win32') {
            shell.openExternal('https://git-scm.com/download/win');
            return true;
        } else {
            shell.openExternal('https://git-scm.com/download/linux');
            return true;
        }
    });

    ipcMain.handle('git:clone', async (_event, repoUrl, destDir) => {
        const repoName = repoUrl.split('/').pop().replace('.git', '') || 'repo';
        const clonePath = path.join(destDir, repoName);

        return new Promise((resolve, reject) => {
            const proc = execFile('git', ['clone', '--progress', repoUrl, clonePath], { timeout: 120000 }, (error) => {
                if (error) {
                    reject(error.message);
                } else {
                    resolve(clonePath);
                }
            });

            const win = getMainWindow();
            proc.stderr.on('data', (data) => {
                if (win && !win.isDestroyed()) {
                    win.webContents.send('git:clone:progress', data.toString());
                }
            });
        });
    });
}

module.exports = { setupGitHandlers };
