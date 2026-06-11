/*
 * Minimal synchronous settings store.
 *
 * Drop-in replacement for the `electron-settings` v3 API that this app used
 * (settings.get / settings.set / settings.getAll, with dot-notation key paths).
 *
 * Why replace it:
 *   - electron-settings v3 reads `electron.remote.app` in the renderer. The
 *     built-in `remote` module was removed in Electron 14, so v3 throws on a
 *     modern Electron.
 *   - electron-settings v4+ switched get/set to an async (Promise) API and
 *     removed getAll(), which would break the ~30 synchronous call sites here.
 *
 * This module keeps the exact synchronous surface the renderer relies on and
 * persists to a JSON file under the app's userData directory.
 */
const fs = require('fs')
const path = require('path')

function resolveUserDataDir () {
  try {
    return require('@electron/remote').app.getPath('userData')
  } catch (e) {
    // Fallback if @electron/remote isn't available in this context yet.
    return path.join(require('os').homedir(), '.udeler')
  }
}

const SETTINGS_FILE = path.join(resolveUserDataDir(), 'udeler-settings.json')

function readStore () {
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8')) || {}
  } catch (e) {
    return {}
  }
}

function writeStore (data) {
  try {
    fs.mkdirSync(path.dirname(SETTINGS_FILE), { recursive: true })
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf8')
  } catch (e) {
    console.error('Failed to persist settings:', e)
  }
}

// In-memory cache kept in sync on every write, so reads stay synchronous.
let store = readStore()

function getByPath (obj, keyPath) {
  if (keyPath === undefined || keyPath === null || keyPath === '') return obj
  const parts = String(keyPath).split('.')
  let cur = obj
  for (const part of parts) {
    if (cur === null || cur === undefined || typeof cur !== 'object') {
      return undefined
    }
    cur = cur[part]
  }
  return cur
}

function setByPath (obj, keyPath, value) {
  const parts = String(keyPath).split('.')
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    if (cur[part] === null || typeof cur[part] !== 'object') {
      cur[part] = {}
    }
    cur = cur[part]
  }
  cur[parts[parts.length - 1]] = value
}

module.exports = {
  get (keyPath) {
    return getByPath(store, keyPath)
  },
  set (keyPath, value) {
    setByPath(store, keyPath, value)
    writeStore(store)
    return this
  },
  has (keyPath) {
    return getByPath(store, keyPath) !== undefined
  },
  getAll () {
    return store
  },
  setAll (obj) {
    store = obj || {}
    writeStore(store)
    return this
  },
  delete (keyPath) {
    const parts = String(keyPath).split('.')
    let cur = store
    for (let i = 0; i < parts.length - 1; i++) {
      if (cur[parts[i]] === null || typeof cur[parts[i]] !== 'object') {
        return this
      }
      cur = cur[parts[i]]
    }
    delete cur[parts[parts.length - 1]]
    writeStore(store)
    return this
  },
  file () {
    return SETTINGS_FILE
  }
}
