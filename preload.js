const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods for file-based storage
contextBridge.exposeInMainWorld('electronStore', {
    // Get data from file storage
    get: (key) => ipcRenderer.invoke('store-get', key),

    // Set data in file storage
    set: (key, value) => ipcRenderer.invoke('store-set', key, value),

    // Delete key from storage
    delete: (key) => ipcRenderer.invoke('store-delete', key),

    // Check if running in Electron
    isElectron: true,

    // Get storage file path (for user info)
    getPath: () => ipcRenderer.invoke('store-get-path')
});
