const { app, BrowserWindow } = require('electron');
const path = require('path');

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 450,
        height: 800,
        minWidth: 380,
        minHeight: 600,
        icon: path.join(__dirname, 'icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
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

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
    createWindow();

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
