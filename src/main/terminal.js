const pty = require('node-pty');
const os = require('os');
const { ipcMain } = require('electron');

const ptys = new Map();

function setupTerminalHandlers(mainWindow) {
    ipcMain.handle('terminal:create', (event, id, cols, rows, cwd) => {
        const shell = os.platform() === 'win32' ? 'powershell.exe' : process.env.SHELL || 'bash';
        try {
            const ptyProcess = pty.spawn(shell, [], {
                name: 'xterm-color',
                cols: cols || 80,
                rows: rows || 24,
                cwd: cwd || process.env.HOME,
                env: process.env
            });

            ptys.set(id, ptyProcess);

            ptyProcess.onData((data) => {
                if (!mainWindow.isDestroyed()) {
                    mainWindow.webContents.send(`terminal:data:${id}`, data);
                }
            });

            ptyProcess.onExit((e) => {
                if (!mainWindow.isDestroyed()) {
                    mainWindow.webContents.send(`terminal:exit:${id}`, e.exitCode);
                }
                ptys.delete(id);
            });

            return true;
        } catch (error) {
            console.error('Failed to create terminal:', error);
            return false;
        }
    });

    ipcMain.handle('terminal:resize', (event, id, cols, rows) => {
        const ptyProcess = ptys.get(id);
        if (ptyProcess) {
            try {
                ptyProcess.resize(cols, rows);
            } catch (error) {
                console.error('Failed to resize terminal:', error);
            }
        }
    });

    ipcMain.handle('terminal:write', (event, id, data) => {
        const ptyProcess = ptys.get(id);
        if (ptyProcess) {
            try {
                ptyProcess.write(data);
            } catch (error) {
                console.error('Failed to write to terminal:', error);
            }
        }
    });

    ipcMain.handle('terminal:kill', (event, id) => {
        const ptyProcess = ptys.get(id);
        if (ptyProcess) {
            try {
                ptyProcess.kill();
            } catch (error) {
                console.error('Failed to kill terminal:', error);
            }
            ptys.delete(id);
        }
    });
}

module.exports = { setupTerminalHandlers };
