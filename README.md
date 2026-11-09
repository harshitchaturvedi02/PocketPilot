# Pocket Pilot

A phone-first VS Code companion prototype. The included demo simulates a paired workspace and lets you send coding requests, inspect files, and review proposed changes from a phone browser.

## Run the phone demo

```sh
npm start
```

Then, with phone and computer on the same Wi-Fi, open the address printed in the terminal (for example, `http://<your-computer-LAN-IP>:4173`) on the phone. The server listens on all local network interfaces. If port 4173 is occupied, it automatically uses 4174 instead.

## Architecture selected

- **Mobile web app / PWA-ready UI**: no App Store install, one URL and fast iteration.
- **Node.js local bridge**: keeps filesystem and VS Code access on the developer's machine; the phone never receives direct shell access.
- **VS Code extension**: the natural pairing/control point; production version would authenticate the phone, expose a localhost-only secure bridge or relay, and send reviewed edits to the editor.

The `vscode-extension/` folder is a minimal command scaffold. The demo API deliberately uses mock workspace data so it is safe to try immediately.
