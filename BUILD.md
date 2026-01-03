# Playbook 2026 - Desktop App bauen

## Voraussetzungen

1. **Node.js installieren** (falls nicht vorhanden)
   - Download: https://nodejs.org/
   - Empfohlen: LTS Version (20.x)

## .exe erstellen

1. **Terminal/PowerShell öffnen** im Projektordner

2. **Dependencies installieren:**
   ```bash
   npm install
   ```

3. **App testen (optional):**
   ```bash
   npm start
   ```
   Die App öffnet sich als Fenster. Schließen mit X.

4. **.exe bauen:**
   ```bash
   npm run build
   ```

5. **Fertig!**
   Die .exe findest du in: `dist/Playbook 2026 Setup 1.0.0.exe`

## Dateien

Nach dem Build:
```
dist/
├── Playbook 2026 Setup 1.0.0.exe   <- Installer
└── win-unpacked/
    └── Playbook 2026.exe           <- Portable Version
```

## Hinweise

- Die App speichert Daten in: `%APPDATA%/playbook-2026/`
- Erste Build dauert länger (Electron wird heruntergeladen)
- Installer erstellt Desktop-Verknüpfung
