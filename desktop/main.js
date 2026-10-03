const { app, BrowserWindow, shell } = require('electron')
const path = require('path')
const { start } = require('./server')

const API_ORIGIN = process.env.EVENTRA_API_ORIGIN || 'https://eventra-backend-psi.vercel.app'
// Packaged: dist is copied to resources/web. Dev: it's the sibling web build.
const webRoot = app.isPackaged ? path.join(process.resourcesPath, 'web') : path.join(__dirname, '..', 'dist')

async function createWindow() {
  const port = await start(webRoot, API_ORIGIN)
  const origin = `http://127.0.0.1:${port}`
  const win = new BrowserWindow({
    width: 1280, height: 860, minWidth: 900, minHeight: 600, title: 'Eventra',
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  })
  // Anything outside the app (Paystack, Google, links) opens in the system browser.
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith(origin)) { e.preventDefault(); shell.openExternal(url) }
  })
  win.loadURL(origin)
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
