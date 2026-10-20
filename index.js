const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const remoteMain = require('@electron/remote/main')
const path = require('path')
const url = require('url')

// Initialize @electron/remote once, before any window is created.
// The built-in `remote` module was removed in Electron 14; the renderer
// (assets/js/app.js) relies on it for dialog/BrowserWindow/session access.
remoteMain.initialize()

var downloadsSaved = false
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    // width: 550,
    // height: 700,
    icon: __dirname + '/assets/images/build/icon.png',
    resizable: true,
    webPreferences: {
      // The renderer requires Node modules and @electron/remote directly.
      // contextIsolation defaults to true since Electron 12 and sandbox to
      // true since Electron 20; both must be disabled to keep this working
      // without a full preload/IPC rewrite.
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false
    }
  })

  // Required per-WebContents in Electron 14+ so the renderer can use
  // @electron/remote (remote.dialog, remote.BrowserWindow, remote.session...).
  remoteMain.enable(win.webContents)

  win.maximize()
  if (process.env.UDELER_DEBUG) {
    win.webContents.openDevTools()
  }

  // and load the index.html of the app.
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  )

  // Open the DevTools.
  // win.webContents.openDevTools();

  win.on('close', event => {
    if (!downloadsSaved) {
      event.preventDefault()
      win.webContents.send('saveDownloads')
    }
  })

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  const template = [
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })

    template[1].submenu.push(
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }]
      }
    )
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

// app.allowRendererProcessReuse = true

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('quitApp', function () {
  downloadsSaved = true
  app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
