# Playbook 2026 - Fitness Tracker

Ein persönlicher Fitness-Tracker als Desktop-App für das Ziel: **89,9 kg bis 23. Dezember 2026**.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey)
![Electron](https://img.shields.io/badge/electron-28.0-47848F)

---

## Features

### Dashboard
- **Gewichts-Fortschritt** mit visuellem Fortschrittsbalken
- **Training Streak** - Zählt aufeinanderfolgende Trainingstage
- **Quartalsziele** (Q1-Q4) mit Status-Tracking
- **Wöchentliche Statistiken** (Ø Kalorien, Protein, Trainingstage)
- **"Never Miss Twice"** Warnung bei verpasstem Training

### Wissenschaftliche Ziele
- **BMI-Berechnung** mit WHO-Kategorien und visueller Anzeige
- **Dynamisches Protein-Ziel** basierend auf Gewicht und Aktivitätslevel
- **Kalorien-Ziel** berechnet nach Mifflin-St. Jeor Formel
- **Idealgewicht** bei BMI 22

### Trainingsplan (A/B Split)
| Tag | Workout |
|-----|---------|
| Tag A | Laufen / Cardio |
| Tag B1 | Push (Brust, Schultern, Trizeps) |
| Tag B2 | Pull (Rücken, Bizeps) |
| Tag B3 | Legs + Core |
| Samstag | Cheat Day (optional) |

### Gamification System
- **13 Level** mit XP-System (Anfänger → Gott-Modus)
- **52 Medaillen** in verschiedenen Kategorien:
  - Streak-Erfolge (7, 14, 30, 60, 100 Tage)
  - Training-Meilensteine (10, 25, 50, 100, 200 Trainings)
  - Gewichtsverlust (5, 10, 15, 20 kg)
  - BMI-Ziele (unter 30, unter 25, Normalgewicht)
  - Perfekte Tage/Wochen
  - Level-Achievements
  - Spezial-Medaillen
- **Tägliche Challenges** (Training, Protein, IF, Kalorien)
- **Wöchentliche Challenges** mit Bonus-XP

### Gewichts-Grafik
- **Interaktiver Chart** mit Canvas-Rendering
- **7-Tage Durchschnittslinie**
- **Zeitfilter** (7 Tage, 14 Tage, 30 Tage, 3 Monate, 1 Jahr, Alles)
- **Prognose** für Ziel-Erreichung basierend auf aktuellem Trend
- **Statistiken** (Höchstes, Niedrigstes, Durchschnitt, Veränderung)

### Benutzereinstellungen
- **Körpergröße** (Slider 150-210 cm)
- **Alter** (Slider 16-80 Jahre)
- **Geschlecht** (für BMR-Berechnung)
- **Aktivitätslevel** (4 Stufen mit PAL-Faktoren):
  - Wenig aktiv (PAL 1.2, Protein 1.0g/kg)
  - Moderat aktiv (PAL 1.5, Protein 1.5g/kg)
  - Sehr aktiv (PAL 1.8, Protein 1.8g/kg)
  - Athletisch (PAL 2.2, Protein 2.2g/kg)

---

## Installation

### Voraussetzungen
- [Node.js](https://nodejs.org/) (LTS Version empfohlen)

### Build erstellen

```bash
# 1. Repository klonen
git clone https://github.com/jemimakilab/sport.git
cd sport

# 2. Dependencies installieren
npm install

# 3. App testen (optional)
npm start

# 4. Windows .exe erstellen
npm run build
```

### Build-Ausgabe

```
dist/
├── Playbook 2026 Setup 1.0.0.exe   # Installer mit Desktop-Verknüpfung
└── win-unpacked/
    └── Playbook 2026.exe           # Portable Version
```

---

## Datenspeicherung

Die App speichert alle Daten persistent als JSON-Datei:

```
%APPDATA%/playbook-2026/playbook-data.json
```

### Vorteile
- Daten bleiben nach App-Neuinstallation erhalten
- Einfaches Backup durch Kopieren der JSON-Datei
- Keine Cloud-Abhängigkeit

### Backup erstellen
1. Navigiere zu `%APPDATA%/playbook-2026/`
2. Kopiere `playbook-data.json` an einen sicheren Ort

### Backup wiederherstellen
1. Schließe die App
2. Ersetze die JSON-Datei im AppData-Ordner
3. Starte die App neu

---

## Projektstruktur

```
sport/
├── index.html          # HTML-Struktur
├── main.js             # Electron Main Process
├── preload.js          # Electron Preload (IPC Bridge)
├── package.json        # NPM Konfiguration & Build-Settings
├── css/
│   └── styles.css      # Alle Styles (~1200 Zeilen)
└── js/
    ├── storage.js      # Datenspeicherung & Hilfsfunktionen
    ├── settings.js     # Benutzereinstellungen & Berechnungen
    ├── gamification.js # XP, Level, Medaillen, Challenges
    ├── charts.js       # Canvas Chart-Rendering
    └── app.js          # Main App Logic & Event Handler
```

---

## Verwendete Formeln

### BMI (Body Mass Index)
```
BMI = Gewicht (kg) / (Größe in m)²
```

### BMR (Grundumsatz) - Mifflin-St. Jeor
```
Männer: BMR = 10 × Gewicht + 6.25 × Größe - 5 × Alter + 5
Frauen: BMR = 10 × Gewicht + 6.25 × Größe - 5 × Alter - 161
```

### TDEE (Tagesbedarf)
```
TDEE = BMR × PAL-Faktor
```

### Kalorien-Ziel (Defizit)
```
Ziel = TDEE - 500 kcal
```

### Protein-Ziel
```
Protein = Gewicht × Aktivitätsfaktor (1.0 - 2.2 g/kg)
```

---

## Streak-Logik

Die Training-Streak zählt aufeinanderfolgende Trainingstage:

| Tag | Mit Training | Ohne Training |
|-----|--------------|---------------|
| Mo-Fr, So | Streak +1 | Streak bricht |
| Samstag (Cheat Day) | Streak +1 | Streak bleibt |

Samstag ist optional - kein Training bricht nicht die Streak.

---

## Technologie-Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Desktop**: Electron 28
- **Speicherung**: electron-store (JSON)
- **Charts**: HTML5 Canvas API
- **Build**: electron-builder

---

## Scripts

```bash
npm start        # App im Development-Modus starten
npm run build    # Windows .exe erstellen
npm run build:all # Für Windows, Mac und Linux bauen
```

---

## Browser-Nutzung

Die App funktioniert auch ohne Electron direkt im Browser:

1. Öffne `index.html` in einem modernen Browser
2. Daten werden in `localStorage` gespeichert

**Hinweis:** Im Browser-Modus gehen Daten beim Löschen der Browser-Daten verloren.

---

## Lizenz

MIT License

---

## Autor

Playbook 2026 - Dein Weg zu 89,9 kg
