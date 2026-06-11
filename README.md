# Udeler | Udemy Course Downloader (GUI)

A cross platform (Windows, Mac, Linux) desktop application for downloading Udemy Courses.

### Udeler 2.0 Feature Requests:

I am planning to make Udeler 2.0 a big release with a lot of new features and improvements. For requesting a feature, Click [here](https://github.com/FaisalUmair/udemy-downloader-gui/issues/172)

### What's new in this fork (v2.0.0)

This fork modernizes the original Udeler so it installs and runs on current
tooling, and fixes the long-standing download crash:

- **Electron 8 → 42** (and `electron-builder` 22 → 26). The removed `remote`
  module was migrated to [`@electron/remote`](https://github.com/electron/remote).
- **No more `Cannot read property 'startsWith' of undefined` crash.** Lectures
  with no downloadable source (most commonly **DRM-protected** videos) are now
  detected and **skipped gracefully** with a clear message, instead of taking
  the whole course download down.
- **Dependency cleanup:** dropped the obsolete `electron-download-tf`, replaced
  `electron-settings` (incompatible with modern Electron) with a tiny built-in
  synchronous settings store, replaced `mkdirp` with native
  `fs.mkdirSync({recursive:true})`, and removed the dead `socket.io`-based
  browser-extension "Authenticator" login.
- **Hardening:** missing AJAX error handlers added, the non-awaited attachment
  `forEach` fixed, download-timer leaks closed, an infinite auto-retry loop
  capped at 3 attempts, and an access-token-leaking debug log removed.

### ⚠️ Important: DRM limitation

Udemy now serves **most** course videos as **DRM-protected / encrypted** streams
(Widevine/PlayReady). **Those cannot be downloaded** by this tool and are skipped
with a notice — this app does **not** and **will not** circumvent DRM (doing so
violates Udemy's Terms of Use and DMCA anti-circumvention law). It only downloads
**non-DRM** content from courses **you are enrolled in**, for personal offline
use. Coverage therefore varies by course and is shrinking over time as Udemy
expands DRM.

#### Login

Open the app and use one of:

1. **Login Using Credentials** — opens Udemy's login in a window; the app reads
   your `access_token` from the authenticated session automatically.
2. **Login Using Access Token** — paste a Udemy `access_token` manually (enable
   "Udemy Business" and enter your subdomain first if you use Udemy Business).

![](https://i.imgur.com/nsaAgDU.gif)

### :fire: Features

- _`Choose video quality.`_
- _`Download multiple courses at once.`_
- _`Set Download Start and Download End.`_
- _`Pause/Resume download at any time.`_
- _`Choose download directory.`_
- _`Multilingual (English,Italian,Spanish).`_

### Disclaimer:

This software is intended to help you download Udemy courses for personal use only. Sharing the content of your subscribed courses is strictly prohibited under Udemy Terms of Use. Each and every course on Udemy is subjected to copyright infringement.
This software does not magically download any paid course available on Udemy, you need to provide your Udemy login credentials to download the courses you have enrolled in. Udeler downloads the lecture videos by simply using the source of the video player returned to the user by Udemy after proper authentication, you can also do the same manually. Many download managers use same method to download videos on a web page. This app only automates the process of a user doing this manually in a web browser.

### Downloads:

| Platform | Arch    | Version | Link                                                                                                                         |
| -------- | ------- | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Windows  | x64     | 1.8.2   | [Download](https://github.com/FaisalUmair/udemy-downloader-gui/releases/download/v1.8.2/Udeler-Setup-1.8.2-windows-x64.exe)  |
| Windows  | x86     | 1.8.2   | [Download](https://github.com/FaisalUmair/udemy-downloader-gui/releases/download/v1.8.2/Udeler-Setup-1.8.2-windows-x86.exe)  |
| Mac      | x64     | 1.8.2   | [Download](https://github.com/FaisalUmair/udemy-downloader-gui/releases/download/v1.8.2/Udeler-1.8.2-mac.dmg)                |
| Linux    | x86_x64 | 1.8.2   | [Download](https://github.com/FaisalUmair/udemy-downloader-gui/releases/download/v1.8.2/Udeler-1.8.2-linux-x86_x64.AppImage) |

### Note:

By default the courses will be downloaded to the user's Download folder. The structure of course content will be preserved.

# For Developers

### Contributing:

Any contributions are welcome, if you plan to contribute please read the [contributing](https://github.com/FaisalUmair/udemy-downloader-gui/blob/master/CONTRIBUTING.md) docs first.

### Prerequisites:

```
Node.js >= 22.12 and npm (required by Electron 42). Tested on Node 26 / npm 11.
```

> Note: Electron bundles its own Node.js at runtime, so your installed Node
> version only matters for `npm install` and building.

### To use the application:

```
1. Clone the project
2. Run npm install
3. Run npm start
```

### Build:

Detect Platform:

```
npm run dist
```

Windows:

```
npm run build-win
```

Mac:

```
npm run build-mac
```

Linux:

```
npm run build-linux
```

Cross Platform:

```
npm run build
```

#### To force 32 bit build:

_Append "-- --ia32" to npm run command_

Example:

```
npm run build-win -- --ia32
```

## Donate

Udeler is free and without any ads. If you appreciate that, please consider donating to the Developer.

[![Donate](https://raw.githubusercontent.com/FaisalUmair/udemy-downloader-gui/master/assets/images/donate.png)](https://www.udeler.com/donate)
