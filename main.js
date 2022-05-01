// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const remoteMain = require('@electron/remote/main')
const {ipcMain} = require('electron')
require('@electron/remote/main').initialize()

async function createWindow (url) {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon: path.join(__dirname, 'icon.ico'),
    width: 800,
    height: 600,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#DDDDD',
      symbolColor: '#33333'
    },
    webPreferences: {
	nodeIntegration: true,
  enableRemoteModule: true,
	preload: path.join(__dirname, "preload.js")
    }
  })
  mainWindow.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });
  ipcMain.on('titlebar-ping', (event, arg) => {
    mainWindow.setTitleBarOverlay({
      color: arg
    })
  })
  // and load the index.html of the app.
  mainWindow.loadURL(url)
  // devtools
  mainWindow.webContents.openDevTools()
}
ipcMain.on('openWindow', (event, url) => {
  createWindow(url)
})
async function createVSCodeServerPopup() {
   const mainWindow = new BrowserWindow({
    icon: path.join(__dirname, 'icon.ico'),
    width: 500,
    height: 250,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
        preload: path.join(__dirname, "preload.js")
    }
  })
  remoteMain.enable(mainWindow.webContents);
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  // Open the DevTools
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
   createVSCodeServerPopup()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createVSCodeServerPopup()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
