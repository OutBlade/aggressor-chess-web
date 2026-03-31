# Aggressor Chess

![Aggressor Chess](https://placehold.co/800x400/1a1a2e/4ecca3?text=Aggressor+Chess+Web+Game)

A web-based chess game with intelligent AI opponent. This application provides a modern chess experience with a challenging computer opponent offering multiple difficulty levels.

## Features

- **Complete Chess**: All standard chess rules and pieces
- **AI Opponent**: Intelligent computer opponent with various difficulty levels
- **Interactive Interface**: Drag-and-drop piece movement
- **Game Analysis**: Real-time move evaluation and position assessment
- **Difficulty Levels**: Beginner, Intermediate, Master
- **Mobile-Friendly**: Responsive design for all devices
- **Game States**: Automatic save and load functionality

## Live Demo

Visit the live demo to experience the full chess game:

[Aggressor Chess Live Demo](https://outblade.github.io/aggressor-chess-web/)

**Key Features:**
- Fully functional chess game with AI opponent
- Intelligent AI engine with multiple difficulty levels
- Drag-and-drop interface for piece movement
- Real-time game analysis and position evaluation
- Mobile-optimized responsive design

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/en/) (>= 14.0)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Modern web browser with JavaScript support

### Quick Start
```bash
# Clone the repository
git clone https://github.com/OutBlade/aggressor-chess-web.git
cd aggressor-chess-web

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
# Build for production
npm run build

# Deploy the built files from /public directory
```

## Usage

### Basic Usage
```javascript
// Initialize the game
const game = new ChessGame({
    difficulty: 'medium', // 'easy', 'medium', 'hard'
    playerColor: 'white',
    aiOpponent: true
});

// Initialize the board
game.initialize();

// Move pieces
game.movePiece('e2', 'e4'); // Pawn to e4
game.movePiece('d1', 'h5'); // Queen to h5

// Get AI move
const aiMove = game.getAIMove();
game.makeMove(aiMove.from, aiMove.to);
```

### Advanced Features
```javascript
// Adjust difficulty
game.setDifficulty('hard');

// Analyze position
const analysis = game.analyzePosition();
console.log('Position evaluation:', analysis.score);

// Save game
game.saveGame('my_game_001');

// Load game history
const history = game.getGameHistory();
game.loadGame('my_game_001');
```

### AI Engine Configuration
```javascript
// Configure AI behavior
const aiConfig = {
    depth: 4,           // Search depth
    timeLimit: 5000,    // Time limit per move in ms
    style: 'aggressive', // 'defensive', 'balanced'
    openingBook: true   // Use opening book
};

game.setAIConfig(aiConfig);
```

## Project Structure

```
aggressor-chess-web/
├── src/                    # Source code
│   ├── chess.js          # Game logic
│   ├── ai.js             # AI engine
│   ├── ui.js             # User interface
│   └── pieces.js         # Chess pieces
├── public/                 # Static files
│   ├── index.html        # Main page
│   ├── css/              # Stylesheets
│   └── js/               # Bundled JavaScript
├── package.json          # Dependencies
├── README.md             # This file
└── LICENSE               # MIT License
```

## Testing

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Playwright E2E tests
npm run test:e2e
```

### Test Coverage
- Game logic: Chess rules and piece movement
- AI engine: Move calculation and strategy
- User interface: Interaction and responsiveness
- Cross-browser: Chrome, Firefox, Safari, Edge

## Statistics

| Metric | Value |
|--------|-------|
| Lines of Code | ~2,500 |
| Test Coverage | 80%+ |
| Dependencies | 8 |
| Last Updated | 2026-03-31 |

## Roadmap

- [ ] **Phase 1**: Multiple AI strategies
- [ ] **Phase 2**: Online multiplayer
- [ ] **Phase 3**: Chess puzzles and tutorials
- [ ] **Phase 4**: Mobile app
- [ ] **Phase 5**: Chess engine API

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup
```bash
# Clone and setup
git clone https://github.com/OutBlade/aggressor-chess-web.git
cd aggressor-chess-web

# Install dependencies
npm install

# Start development server
npm run dev
```

### Code Style
- JavaScript ES6+ standards
- Clear variable names
- Comments for complex logic
- CSS with BEM conventions

## Changelog

### [1.0.0] - Initial Release
- Basic chess functionality
- AI opponent with difficulty levels
- Modern responsive interface
- Comprehensive documentation

[View Full Changelog](CHANGELOG.md)

## Acknowledgments

- [Chess.js](https://chessboardjs.com/) for chess engine foundations
- [Stockfish](https://stockfishchess.org/) for AI chess inspiration
- [Material Design](https://material.io/) for UI components
- The open-source chess community for algorithms and patterns

## License

This project is licensed under MIT License - see the [LICENSE](LICENSE) file for details.

## Links

[Play Online](https://outblade.github.io/aggressor-chess-web/) • [Chess Rules](https://en.wikipedia.org/wiki/Rules_of_chess) • [Issues](https://github.com/OutBlade/aggressor-chess-web/issues) • [Discussions](https://github.com/OutBlade/aggressor-chess-web/discussions)

---

Made with passion by [OutBlade](https://github.com/OutBlade)
