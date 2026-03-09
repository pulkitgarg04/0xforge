const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    openFolder: () => ipcRenderer.invoke('dialog:openFolder'),
    newFile: () => ipcRenderer.invoke('dialog:newFile'),
    readDir: (dirPath) => ipcRenderer.invoke('fs:readDir', dirPath),
    readFile: (filePath) => ipcRenderer.invoke('fs:readFile', filePath),
    writeFile: (filePath, content) => ipcRenderer.invoke('fs:writeFile', filePath, content),
    createFile: (filePath) => ipcRenderer.invoke('fs:createFile', filePath),
    createFolder: (dirPath) => ipcRenderer.invoke('fs:createFolder', dirPath),
    deleteFile: (filePath) => ipcRenderer.invoke('fs:deleteFile', filePath),
    getStore: (key) => ipcRenderer.invoke('store:get', key),
    setStore: (key, value) => ipcRenderer.invoke('store:set', key, value),
    onMenuAction: (callback) => {
        const handler = (_event, action, ...args) => callback(action, ...args);
        ipcRenderer.on('menu:action', handler);
        return () => ipcRenderer.removeListener('menu:action', handler);
    },
    terminal: {
        create: (id, cols, rows, cwd) => ipcRenderer.invoke('terminal:create', id, cols, rows, cwd),
        resize: (id, cols, rows) => ipcRenderer.invoke('terminal:resize', id, cols, rows),
        write: (id, data) => ipcRenderer.invoke('terminal:write', id, data),
        kill: (id) => ipcRenderer.invoke('terminal:kill', id),
        onData: (id, callback) => {
            const handler = (_event, data) => callback(data);
            ipcRenderer.on(`terminal:data:${id}`, handler);
            return () => ipcRenderer.removeListener(`terminal:data:${id}`, handler);
        },
        onExit: (id, callback) => {
            const handler = (_event, exitCode) => callback(exitCode);
            ipcRenderer.on(`terminal:exit:${id}`, handler);
            return () => ipcRenderer.removeListener(`terminal:exit:${id}`, handler);
        }
    },
    git: {
        check: () => ipcRenderer.invoke('git:check'),
        install: () => ipcRenderer.invoke('git:install'),
        clone: (repoUrl, destDir) => ipcRenderer.invoke('git:clone', repoUrl, destDir),
        onCloneProgress: (callback) => {
            const handler = (_event, data) => callback(data);
            ipcRenderer.on('git:clone:progress', handler);
            return () => ipcRenderer.removeListener('git:clone:progress', handler);
        }
    }
});
