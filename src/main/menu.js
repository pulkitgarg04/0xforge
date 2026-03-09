const { app, Menu, dialog, BrowserWindow } = require('electron');

const isMac = process.platform === 'darwin';

const setupAppMenu = (createWindow) => {
    const getMainWindow = () => BrowserWindow.getAllWindows()[0];

    const sendAction = (action, ...args) => {
        const win = getMainWindow();
        if (win) {
            win.webContents.send('menu:action', action, ...args);
        }
    };

    const template = [
        ...(isMac
            ? [{
                label: app.name,
                submenu: [
                    { role: 'about' },
                    { type: 'separator' },
                    { role: 'services' },
                    { type: 'separator' },
                    { role: 'hide' },
                    { role: 'hideOthers' },
                    { role: 'unhide' },
                    { type: 'separator' },
                    { role: 'quit' }
                ]
            }]
            : []),
        {
            label: 'File',
            submenu: [
                { label: 'New File...', accelerator: 'Ctrl+Alt+Cmd+N', click: () => sendAction('newFile') },
                { label: 'New Window', accelerator: 'CmdOrCtrl+Shift+N', click: () => createWindow() },
                { type: 'separator' },
                {
                    label: 'Open Folder...', click: async () => {
                        const win = getMainWindow();
                        const result = await dialog.showOpenDialog(win, { properties: ['openDirectory'] });
                        if (!result.canceled && result.filePaths.length > 0) {
                            sendAction('openFolder', result.filePaths[0]);
                        }
                    }
                },
                { label: 'Open Recent', submenu: [{ label: 'Clear Recently Opened', click: () => sendAction('clearRecent') }] },
                { type: 'separator' },
                { label: 'Save', accelerator: 'CmdOrCtrl+S', click: () => sendAction('save') },
                {
                    label: 'Save As...', accelerator: 'CmdOrCtrl+Shift+S', click: async () => {
                        const win = getMainWindow();
                        const result = await dialog.showSaveDialog(win, {});
                        if (!result.canceled && result.filePath) {
                            sendAction('saveAs', result.filePath);
                        }
                    }
                },
                { label: 'Save All', accelerator: 'Alt+CmdOrCtrl+S', click: () => sendAction('saveAll') },
                { type: 'separator' },
                { label: 'Share', submenu: [{ label: 'Export...', click: () => sendAction('export') }] },
                { type: 'separator' },
                { label: 'Auto Save', type: 'checkbox', checked: true, click: (item) => sendAction('toggleAutoSave', item.checked) },
                { type: 'separator' },
                { label: 'Revert File', click: () => sendAction('revertFile') },
                { label: 'Close Editor', accelerator: 'CmdOrCtrl+W', click: () => sendAction('closeEditor') },
                { label: 'Close Folder', click: () => sendAction('closeFolder') },
                {
                    label: 'Close Window', accelerator: 'CmdOrCtrl+Shift+W', click: () => {
                        const win = getMainWindow();
                        if (win) win.close();
                    }
                },
                { type: 'separator' },
                isMac ? { role: 'quit' } : { role: 'quit' }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'selectAll' }
            ]
        },
        {
            label: 'Selection',
            submenu: [
                { role: 'selectAll' },
                { label: 'Expand Selection', accelerator: 'Ctrl+Shift+Cmd+Right', click: () => sendAction('expandSelection') },
                { label: 'Shrink Selection', accelerator: 'Ctrl+Shift+Cmd+Left', click: () => sendAction('shrinkSelection') }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Go',
            submenu: [
                { label: 'Go to File...', accelerator: 'CmdOrCtrl+P', click: () => sendAction('goToFile') },
                { label: 'Go to Symbol...', accelerator: 'CmdOrCtrl+Shift+O', click: () => sendAction('goToSymbol') },
                { label: 'Go to Line/Column...', accelerator: 'Ctrl+G', click: () => sendAction('goToLine') }
            ]
        },
        {
            label: 'Run',
            submenu: [
                { label: 'Run Code', accelerator: 'CmdOrCtrl+R', click: () => sendAction('runCode') },
                { label: 'Run Tests', accelerator: 'CmdOrCtrl+Shift+T', click: () => sendAction('runTests') }
            ]
        },
        {
            label: 'Terminal',
            submenu: [
                { label: 'New Terminal', accelerator: 'Ctrl+Shift+`', click: () => sendAction('newTerminal') },
                { label: 'New Terminal Window', accelerator: 'Ctrl+Shift+C', click: () => sendAction('newTerminalWindow') },
                { label: 'Split Terminal', accelerator: 'CmdOrCtrl+\\', click: () => sendAction('splitTerminal') }
            ]
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac
                    ? [
                        { type: 'separator' },
                        { role: 'front' },
                        { type: 'separator' },
                        { role: 'window' }
                    ]
                    : [
                        { role: 'close' }
                    ])
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: async () => {
                        const { shell } = require('electron')
                        await shell.openExternal('https://electronjs.org')
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
};

module.exports = { setupAppMenu };
