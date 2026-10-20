# Manual Tasks

These are the steps that **only you can perform** — they need your Udemy
credentials, your hardware, or a publishing action. All code work
(modernization, crash fix, hardening, cleanup, docs) is complete and committed;
the items below cannot be done by the automated tooling.

> Context: see the top of [`README.md`](../README.md) for the v2.0.0 change
> summary and the **DRM limitation** (most Udemy courses are now DRM-encrypted
> and intentionally cannot be downloaded by this app).

---

## 1. Run and functionally test (recommended)

The build was verified to **install and launch** cleanly, but an end-to-end
download could not be tested automatically (it needs a real Udemy account and a
**non-DRM** course you are enrolled in).

```powershell
npm install        # if the Electron binary download stalls, see section 4
npm start          # add $env:UDELER_DEBUG=1 first for DevTools + verbose logs
```

Then verify, with your own account:

- [ ] **Login — Credentials:** click "Login Using Credentials", sign in to
      Udemy in the popup window; the app should detect your session and load
      your courses.
- [ ] **Login — Access Token:** click "Login Using Access Token" and paste a
      valid `access_token` (for Udemy Business, tick the checkbox and enter your
      subdomain first).
- [ ] **Course list / search:** your enrolled courses load; search by keyword
      and by a course URL both work; "Load More" paginates.
- [ ] **Download a non-DRM course:** videos download at the chosen quality;
      articles save as `.html`; files/e-books save as `.pdf`; attachments and
      subtitles (`.srt`) download.
- [ ] **DRM course:** confirm DRM lectures are **skipped** with a console
      warning (open DevTools) rather than crashing the whole course.
- [ ] **Controls:** pause/resume; "Download Start/End" range; "Skip
      Attachments"/"Skip Subtitles"; "Auto Retry"; choose download directory.
- [ ] **Persistence:** change Settings, save, restart — values persist
      (stored in `udeler-settings.json` under the app's userData folder).
- [ ] **Downloads list:** an in-progress/finished download is restored on the
      Downloads tab after restarting.
- [ ] **Language:** switch language in Settings, restart, UI is translated.

If anything misbehaves, run with `$env:UDELER_DEBUG=1` and copy the DevTools
console output — that surfaces the detailed logs (off by default).

---

## 2. Build distributable installers (optional)

```powershell
npm run build-win      # NSIS .exe installer
npm run build-mac      # .dmg (must be run on macOS)
npm run build-linux    # .AppImage
npm run build          # all three (-wml)
```

**Code signing (only needed to distribute):**

- **Windows:** provide a code-signing certificate (`CSC_LINK` + `CSC_KEY_PASSWORD`
  env vars) or the build is unsigned (SmartScreen will warn users).
- **macOS:** signing/notarization needs an Apple Developer ID. For an **unsigned
  local** build, disable auto-discovery so it doesn't fail:
  ```powershell
  $env:CSC_IDENTITY_AUTO_DISCOVERY = "false"; npm run build-mac
  ```

---

## 3. Publish (when you're ready)

- [ ] **Push the commit** — the v2.0.0 modernization is committed **locally** on
      branch `v1` only; it has not been pushed:
      ```powershell
      git push o v1
      ```
- [ ] **(Optional) GitHub release** — attach the installers from section 2 and
      update the download links in `README.md` (they still point at the upstream
      `FaisalUmair/udemy-downloader-gui` releases).

---

## 4. Fresh-machine install caveat

On this environment, `npm install`'s automatic Electron binary download **stalls
at 0 bytes** (an `@electron/get` issue — direct HTTPS to GitHub works fine). If
`npm start` reports a missing Electron binary, download it manually:

```powershell
$ProgressPreference = 'SilentlyContinue'   # progress bar cripples download speed in PS 5.1
$v = '42.3.3'                              # keep in sync with package.json "electron"
$zip = "$env:TEMP\electron-v$v-win32-x64.zip"
Invoke-WebRequest "https://github.com/electron/electron/releases/download/v$v/electron-v$v-win32-x64.zip" -OutFile $zip -UseBasicParsing
Expand-Archive $zip -DestinationPath node_modules\electron\dist -Force
Set-Content node_modules\electron\path.txt 'electron.exe' -NoNewline
```

(For other OS/arch, change `win32-x64` accordingly.)

---

## 5. Optional future hardening (not required to ship)

These were identified during the modernization but deliberately left out of
scope (they are larger reworks, not bugs):

- [ ] **Security posture:** move off `@electron/remote` + `nodeIntegration:true`
      to a preload script + `contextBridge` + `ipcRenderer` with
      `contextIsolation:true`. Removes the renderer's full Node access (the app
      loads remote udemy.com content in the login window).
- [ ] **Shed stale transitive deps:** replace `download@8` (pulls old
      `got@10`/`decompress`) with Node's global `fetch` + streaming, and replace
      the unmaintained `dialogs` package with Electron's native dialog API.
- [ ] **Curriculum robustness:** the curriculum call uses `page_size=100000`;
      consider paginating via `response.next` for very large courses.
