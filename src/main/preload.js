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
});
