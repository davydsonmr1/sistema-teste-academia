const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    // Funções ou eventos que você pode querer expor para uso na página web
});
