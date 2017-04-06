const electron = require('electron'),
      path = require('path')

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, loadKeysWindow

// A simple desktop notification.
let Notify

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', ()=> {
    createMainWindow()
    Notify = require('electron-notify')
    Notify.setConfig({
        appIcon: path.join(__dirname, 'windows/app/img/communication.svg')
    })
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createMainWindow()   
    }
})

// Show a desktop notification.
ipc.on('notify', (event, msg) => {
    Notify.notify(msg)    
})

ipc.on('toggle-load-keys-window', (event, arg) => {
    if(!loadKeysWindow) {
        createLoadKeysWindow(mainWindow)
        return
    }    
    if (loadKeysWindow.isVisible()) {
        loadKeysWindow.hide()
        return
    }
    loadKeysWindow.show()
})

// Forward the event to the mainWindow
ipc.on('load-asymm-keys', (event, arg) => {
    mainWindow.webContents.send('load-asymm-keys')
})

// Forward the keys (stored in arg) to the mainWindow
ipc.on('asymm-keys-loaded', (event, arg) => {
    loadKeysWindow.hide()
    mainWindow.webContents.send('asymm-keys-loaded', arg)
})

// Forward alert to the mainWindow    
ipc.on('alert', (event, arg) => {
    mainWindow.webContents.send('alert', arg)
})

function createMainWindow () { 
    // Create the browser window...
    const browserOptions = { 
        width: 800, 
        height: 800, 
        frame: true, 
        show: false, 
        fullscreen: false,
        backgroundColor: '#000000'
    }
    
    mainWindow = new BrowserWindow(browserOptions)	

    // ...and load the index.html of the app.
    mainWindow.loadURL(path.join(__dirname, 'windows/app/index.html'))
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })
    
    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

function createLoadKeysWindow(mainWindow) {
    const browserOptions = { 
        width: 500,
        height: 200,
        alwaysOnTop: true,
        resizable: false,
        frame: false,
        skipTaskbar: true,
        parent: mainWindow, 
        modal: true, 
        show: false                 
    }

    loadKeysWindow = new BrowserWindow(browserOptions)
    loadKeysWindow.loadURL(path.join(__dirname, 'windows/loadkeys/index.html'))
    loadKeysWindow.on('ready-to-show', () => {
        loadKeysWindow.show()
    })

    // Center the "child" window within the main window.    
    let posMain = mainWindow.getPosition(),
        sizeMain = mainWindow.getSize(),
        posThis = loadKeysWindow.getPosition(),
        sizeThis = loadKeysWindow.getSize()
    
    let x = posMain[0] + (sizeMain[0]-sizeThis[0])/2,
        y = posMain[1] + (sizeMain[1]-sizeThis[1])/2
    
    loadKeysWindow.setPosition(Math.round(x), Math.round(y))    
                         
    loadKeysWindow.on('closed', () => {
        loadKeysWindow = null
    })
}