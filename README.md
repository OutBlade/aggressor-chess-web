# ♟️ Aggressor Chess Web

<div align="center">

![JavaScript](https://img.shields.io/badge/JavaScript-yellow.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26.svg)
![CSS3](https://img.shields.io/badge/CSS3-1572B6.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Stars](https://img.shields.io/github/stars/OutBlade/aggressor-chess-web?style=social)
![Forks](https://img.shields.io/github/forks/OutBlade/aggressor-chess-web?style=social)

[♟️ Play Online](#live-demo) • [📖 Documentation](#documentation) • [🛠️ Installation](#installation) • [💡 Usage](#usage) • [🤝 Contributing](#contributing)

</div>

---

## 📋 Overview

Ein webbasiertes Schachspiel mit aggressiver KI-Gegner. Diese Anwendung bietet eine moderne Schach-Erfahrung mit einem intelligenten Computergegner, der verschiedene Schwierigkeitsgrade bietet.

**🎯 Perfekt für Schach-Enthusiasten, die ihre Fähigkeiten gegen einen herausfordernden KI-Gegner testen möchten.**

---

## ✨ Key Features

- ♟️ **Vollständiges Schach**: Alle Standard-Schachregeln und Figuren
- 🤖 **KI-Gegner**: Intelligenter Computergegner mit verschiedenen Schwierigkeitsgraden
- 🎮 **Interaktives Interface**: Drag-and-Drop Figurenbewegung
- 📊 **Spielanalyse**: Echtzeitige Bewertung von Zügen und Positionen
- 🏆 **Schwierigkeitsgrade**: Anfänger, Fortgeschrittene, Meister
- 📱 **Mobile-Friendly**: Responsives Design für alle Geräte
- 💾 **Spielstände**: Automatisches Speichern und Laden von Spielen

---

## 🎬 Live Demo

<div align="center">

### 🖼️ Website-Vorschau
**🔗 [▶️ Aggressor Chess Live Demo](https://outblade.github.io/aggressor-chess-web/)**

**Besuchen Sie die Live-Demo:**
- ♟️ Voll funktionsfähiges Schachspiel mit KI-Gegner
- 🤖 Intelligente KI-Engine mit verschiedenen Schwierigkeitsgraden
- 🎮 Drag-and-Drop Interface für Figurenbewegung
- 📊 Echtzeit-Spielanalyse und Positionsbewertung
- 📱 Mobile-optimiertes responsives Design

**Funktionen im Überblick:**
- Vollständige Schachregeln und Figurenbewegung
- Mehrere Schwierigkeitsgrade (Anfänger bis Meister)
- Automatisches Speichern und Laden von Spielständen
- Zugverlauf und Spielhistorie

---

### 🌐 Technische Details

**�️ Technologie-Stack:**
- **Frontend:** HTML5 Canvas, CSS3, Vanilla JavaScript
- **Game Engine:** Custom Chess Engine mit Minimax-Algorithmus
- **AI:** Alpha-Beta-Pruning mit Positionsbewertung
- **Deployment:** GitHub Pages mit HTTPS

**⚡ Performance-Features:**
- Clientseitige Spiellogik ohne Serverlatenz
- Optimierte KI-Berechnungen mit Web Workers
- Smooth Canvas-Rendering mit 60 FPS
- Responsive Touch-Unterstützung

---

## 🛠️ Installation

### Voraussetzungen
- [Node.js](https://nodejs.org/en/) (>= 14.0)
- [npm](https://www.npmjs.com/) oder [yarn](https://yarnpkg.com/)
- Moderner Webbrowser mit JavaScript-Unterstützung

### Schnellstart
```bash
# Repository klonen
git clone https://github.com/OutBlade/aggressor-chess-web.git
cd aggressor-chess-web

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

### Produktionsbuild
```bash
# Für Produktion optimieren
npm run build

# Anwendung bereitstellen
# Die gebauten Dateien im /public Verzeichnis bereitstellen
```

---

## 💡 Usage

### Grundlegende Bedienung
```javascript
// Spiel initialisieren
const game = new ChessGame({
    difficulty: 'medium', // 'easy', 'medium', 'hard'
    playerColor: 'white',
    aiOpponent: true
});

// Spielbrett initialisieren
game.initialize();

// Figur bewegen
game.movePiece('e2', 'e4'); // Bauer nach e4
game.movePiece('d1', 'h5'); // Dame nach h5

// KI-Zug abrufen
const aiMove = game.getAIMove();
game.makeMove(aiMove.from, aiMove.to);
```

### Erweiterte Funktionen
```javascript
// Schwierigkeit anpassen
game.setDifficulty('hard');

// Spiel analysieren
const analysis = game.analyzePosition();
console.log('Positionsbewertung:', analysis.score);

// Spielstand speichern
game.saveGame('mein_spiel_001');

// Historie laden
const history = game.getGameHistory();
game.loadGame('mein_spiel_001');
```

### KI-Engine Konfiguration
```javascript
// KI-Verhalten anpassen
const aiConfig = {
    depth: 4,           // Suchtiefe
    timeLimit: 5000,    // Zeitlimit pro Zug in ms
    style: 'aggressive', // 'defensive', 'balanced'
    openingBook: true    // Eröffnungsbuch verwenden
};

game.setAIConfig(aiConfig);
```

---

## 🏗️ Project Structure

```
aggressor-chess-web/
├── 📁 src/                    # Quellcode
│   ├── 📄 chess.js          # Spiellogik
│   ├── 📄 ai.js             # KI-Engine
│   ├── 📄 ui.js             # Benutzeroberfläche
│   └── 📄 pieces.js         # Schachfiguren
├── 📁 public/                 # Statische Dateien
│   ├── 📄 index.html        # Hauptseite
│   ├── 📄 css/              # Stylesheets
│   └── 📄 js/               # Gebündeltes JavaScript
├── 📄 package.json          # Abhängigkeiten
├── 📄 README.md             # Diese Datei
└── 📄 LICENSE               # MIT Lizenz
```

---

## 🧪 Testing

```bash
# Einheitentests
npm test

# Integrationstests
npm run test:integration

# Playwright E2E-Tests
npm run test:e2e
```

### Testabdeckung
- Spiellogik: Schachregeln und Figurenbewegung
- KI-Engine: Zugberechnung und Strategie
- Benutzeroberfläche: Interaktion und Responsivität
- Cross-Browser: Chrome, Firefox, Safari, Edge

---

## 📊 Statistics

<div align="center">

| Metrik | Wert |
|--------|-------|
| 📝 Codezeilen | ~2,500 |
| 🧪 Testabdeckung | 80%+ |
| 📦 Abhängigkeiten | 8 |
| 🔄 Zuletzt aktualisiert | {{DATUM}} |

</div>

---

## 🛣️ Roadmap

- [ ] **Phase 1**: Mehrere KI-Strategien
- [ ] **Phase 2**: Online-Multiplayer
- [ ] **Phase 3**: Schachaufgaben und Tutorials
- [ ] **Phase 4**: Mobile App
- [ ] **Phase 5**: Schach-Engine API

---

## 🤝 Contributing

Wir begrüßen Beiträge! So können Sie helfen:

1. 🍴 **Fork** des Repository
2. 🌿 **Feature-Branch erstellen** (`git checkout -b feature/amazing-feature`)
3. 💾 **Änderungen committen** (`git commit -m 'Add amazing feature'`)
4. 📤 **Zum Branch pushen** (`git push origin feature/amazing-feature`)
5. 🔃 **Pull Request öffnen**

### Development Setup
```bash
# Klonen und einrichten
git clone https://github.com/OutBlade/aggressor-chess-web.git
cd aggressor-chess-web

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

### Code Style
- JavaScript ES6+ Standards verwenden
- Verständliche Variablennamen
- Kommentare für komplexe Logik
- CSS mit BEM-Konventionen

---

## 📝 Changelog

### [1.0.0] - Initiales Release
- ✨ Grundlegende Schachfunktionalität
- 🤖 KI-Gegner mit verschiedenen Schwierigkeitsgraden
- 🎨 Modernes responsives Interface
- 📚 Umfassende Dokumentation

[View Full Changelog](CHANGELOG.md)

---

## 🙏 Acknowledgments

- [Chess.js](https://chessboardjs.com/) für Schach-Engine-Grundlagen
- [Stockfish](https://stockfishchess.org/) für KI-Schach-Inspiration
- [Material Design](https://material.io/) für UI-Komponenten
- Die Open-Source-Schach-Community für Algorithmen und Patterns

---

## 📄 License

Dieses Projekt steht unter MIT Lizenz - siehe [LICENSE](LICENSE) Datei für Details.

---

## 🔗 Links

<div align="center">

[♟️ Play Online](https://outblade.github.io/aggressor-chess-web/) • [📖 Chess Rules](https://en.wikipedia.org/wiki/Rules_of_chess) • [🐛 Issues](https://github.com/OutBlade/aggressor-chess-web/issues) • [💬 Discussions](https://github.com/OutBlade/aggressor-chess-web/discussions)

[![GitHub followers](https://img.shields.io/github/followers/OutBlade?style=social)](https://github.com/OutBlade)
[![GitHub stars](https://img.shields.io/github/stars/OutBlade/aggressor-chess-web?style=social)](https://github.com/OutBlade/aggressor-chess-web)

</div>

---

<div align="center">
Made with ♟️ and ❤️ by [OutBlade](https://github.com/OutBlade)
</div>
