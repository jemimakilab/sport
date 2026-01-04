const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');
const { autoUpdater } = require('electron-updater');

// Initialize electron-store
const store = new Store({
    name: 'playbook-data',
    defaults: {
        'playbook2026': {
            entries: {},
            startWeight: 109,
            bRotation: 0,
            gamification: {
                xp: 0,
                unlockedMedals: {},
                completedDailyChallenges: {},
                completedWeeklyChallenges: {},
                bestStreak: 0,
                perfectWeeks: 0
            }
        },
        'playbook2026_settings': {
            height: 183,
            age: 26,
            gender: 'male',
            activity: 'moderate'
        }
    }
});

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
    // Get app version from package.json
    const appVersion = app.getVersion();
    
    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 450,
        height: 800,
        minWidth: 380,
        minHeight: 600,
        title: `Playbook 2026 - v${appVersion}`,
        icon: path.join(__dirname, 'icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        // Modern look
        backgroundColor: '#0f172a',
        titleBarStyle: 'default',
        autoHideMenuBar: true
    });

    // Load the index.html of the app
    mainWindow.loadFile('index.html');

    // Open DevTools in development (uncomment if needed)
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// IPC Handlers for electron-store
ipcMain.handle('store-get', (event, key) => {
    return store.get(key);
});

ipcMain.handle('store-set', (event, key, value) => {
    store.set(key, value);
    return true;
});

ipcMain.handle('store-delete', (event, key) => {
    store.delete(key);
    return true;
});

ipcMain.handle('store-get-path', () => {
    return store.path;
});

// Auto-updater events
autoUpdater.checkForUpdatesAndNotify();

autoUpdater.on('update-available', () => {
    console.log('Update available');
});

autoUpdater.on('update-downloaded', () => {
    console.log('Update downloaded');
    autoUpdater.quitAndInstall();
});

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
    createWindow();

    // Check for updates after window is ready
    autoUpdater.checkForUpdatesAndNotify();

    app.on('activate', () => {
        // On macOS re-create window when dock icon is clicked
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
    // On macOS keep app active until Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
