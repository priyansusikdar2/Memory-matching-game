<div align="center">

# 🎮 Memory Matching Game

### *Test Your Memory • Challenge Your Friends • Unlock Achievements*

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-11.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

<br/>

</div>

---

## ✨ **Live Demo**

> 🎯 **Play Now:** [https://memory-game-82996.web.app](https://memory-game-82996.web.app)

---

## 📖 **About The Game**

Memory Matching Game is an interactive, feature-rich web game designed to test and improve your memory skills. Built with modern web technologies, it offers a smooth, engaging experience with multiple themes, difficulty levels, and game modes.

### 🎯 **Core Concept**
Flip cards, match pairs, and complete the grid in the fewest moves and fastest time. The better your memory, the higher your score!

---

## 🚀 **Features**

### 🎮 **Gameplay Features**
| Feature | Description |
|---------|-------------|
| 🎯 **Multiple Difficulty Levels** | Easy (6 pairs), Medium (8 pairs), Hard (12 pairs) |
| ⏱️ **Two Timer Modes** | Count Up (classic) or Countdown (race against time) |
| 👥 **Multiplayer Mode** | Two-player turn-based gameplay |
| 💡 **Hint System** | Get visual hints when you're stuck |
| 🔊 **Sound Effects** | Card flip, match, victory sounds with toggle |

### 🎨 **Visual Features**
| Feature | Description |
|---------|-------------|
| 🐾 **6 Card Themes** | Animals, Food, Space, Holidays, Vehicles, Emojis |
| 🃏 **4 Card Backs** | Default (?), Pattern (◆), Stars (★), Hearts (♥) |
| 🌙 **Dark/Light Mode** | Toggle between themes with smooth transitions |
| ✨ **Smooth Animations** | Card flips, matches, and victory celebrations |

### 🏆 **Progression System**
| Feature | Description |
|---------|-------------|
| 🏆 **Achievements** | Unlock badges for special accomplishments |
| 📊 **Leaderboard** | Top 10 scores saved locally |
| 📈 **Statistics** | Track your performance over time |
| ⭐ **Best Score** | Persistent high score tracking |

### 🔧 **Technical Features**
| Feature | Description |
|---------|-------------|
| 🎯 **TypeScript** | Full type safety across the application |
| 🧪 **Testing** | Unit tests with Vitest and React Testing Library |
| ☁️ **Firebase** | Cloud leaderboard and analytics |
| 📱 **Responsive** | Works on all devices (mobile, tablet, desktop) |

---

## 🎯 **How To Play**

### **Single Player Mode**
1. Click **"New Game"** to start
2. Select your **difficulty** (Easy/Medium/Hard)
3. Choose **timer mode** (Count Up/Countdown)
4. Pick your favorite **theme** and **card back**
5. Click cards to reveal and match pairs
6. Complete all matches to win!

### **Multiplayer Mode**
1. Toggle **"Multiplayer"** mode
2. Players take turns flipping cards
3. Each match earns 100 points
4. Player with highest score wins!

### **Controls**
| Button | Action |
|--------|--------|
| 🎮 New Game | Start a fresh game |
| ⏸️ Pause | Pause the current game |
| ▶️ Resume | Resume paused game |
| 💡 Hint | Reveal a random card briefly |
| 👥 Multiplayer | Toggle two-player mode |
| 🌙/☀️ | Toggle dark/light mode |
| 🔊/🔇 | Toggle sound effects |

---

## 📊 **Scoring System**

| Component | Calculation |
|-----------|-------------|
| **Base Score** | 1,000 points |
| **Move Penalty** | Moves × (2, 3, or 5 based on difficulty) |
| **Time Bonus** | (Time Bonus × 10) - Time Elapsed |
| **Match Bonus** | Matches × 50 |

### **Difficulty Multipliers**
- Easy: 1.0x
- Medium: 1.5x
- Hard: 2.0x

---

## 🏆 **Achievements**

| Achievement | Icon | Requirement |
|-------------|------|-------------|
| **High Scorer** | 🏆 | Score over 800 points in a single game |
| **Perfect Game** | ⭐ | Complete with minimum moves possible |
| **Speed Demon** | ⚡ | Finish with 70% or more time remaining |
| **Marathon Player** | 🏃 | Play 10 or more games total |

---

## 🛠️ **Tech Stack**

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3 | UI Framework |
| TypeScript | 5.6 | Type Safety |
| Tailwind CSS | 3.4 | Styling |
| Framer Motion | 11.11 | Animations |
| Vite | 5.4 | Build Tool |

### **Backend & Services**
| Service | Purpose |
|---------|---------|
| Firebase Hosting | Web hosting |
| Firebase Firestore | Cloud leaderboard |
| Firebase Auth | Anonymous authentication |

### **Testing**
| Tool | Purpose |
|------|---------|
| Vitest | Test runner |
| React Testing Library | Component testing |
| JSDOM | DOM simulation |

---

## 📁 Project Structure

```text
memory-matching-game/
├── src/
│   ├── tests/                      # Unit tests
│   │   ├── App.test.tsx
│   │   └── gameUtils.test.ts
│   │
│   ├── components/                 # React components
│   │   ├── Card.tsx
│   │   ├── GameBoard.tsx
│   │   ├── GameControls.tsx
│   │   ├── GameStats.tsx
│   │   └── VictoryModal.tsx
│   │
│   ├── config/                     # Configuration files
│   │   └── firebase.ts
│   │
│   ├── context/                    # React Context
│   │   └── FirebaseContext.tsx
│   │
│   ├── data/                       # Static data
│   │   └── cardIcons.ts
│   │
│   ├── hooks/                      # Custom hooks
│   │   ├── useGameLogic.ts
│   │   └── useTimer.ts
│   │
│   ├── types/                      # TypeScript types
│   │   └── game.types.ts
│   │
│   ├── utils/                      # Utility functions
│   │   └── gameUtils.ts
│   │
│   ├── App.tsx                     # Main game component
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles
│
├── public/                         # Static assets
├── index.html                      # HTML template
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite configuration
├── vitest.config.ts                # Vitest configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── firebase.json                   # Firebase configuration
├── .firebaserc                     # Firebase project settings
└── README.md                       # Documentation
```

---

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 22.3 or higher
- npm 10.0 or higher

### **Installation**

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/memory-matching-game.git
cd memory-matching-game

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
Available Scripts
bash
# Development
npm run dev          # Start development server
npm run build        # Create production build
npm run preview      # Preview production build

# Testing
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage report

# Deployment
firebase deploy      # Deploy to Firebase Hosting
🧪 Running Tests
bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode (auto-run on changes)
npm run test:watch

# Run specific test file
npm test -- src/__tests__/App.test.tsx
🌐 Deployment
Deploy to Firebase Hosting
bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy --only hosting

# Your game will be live at:
# https://memory-game-82996.web.app
Deploy to GitHub Pages
bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json
"homepage": "https://YOUR_USERNAME.github.io/memory-matching-game",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run deploy
📊 Game Statistics Tracked
Statistic	Description
Total Games	Number of games played
Wins	Games completed successfully
Average Moves	Average moves per game
Average Time	Average completion time
Best Score	Highest score ever achieved
Games Played	History of moves per game
🎨 Themes Available
Theme	Icons
🐾 Animals	🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮
🍕 Food	🍎 🍕 🍔 🌮 🍣 🍩 🍪 🍫 🍦 🍉 🍒 🥑
🚀 Space	🌍 🌙 ⭐ 🪐 🚀 👽 🛸 🌌 🔭 ☄️ 🌠 🛰️
🎄 Holidays	🎄 🎅 🦌 🎃 👻 🕯️ 🥚 🐇 🎆 🍾 🎉 💝
🚗 Vehicles	🚗 🚕 🚙 🚌 🚎 🏎️ 🚓 🚑 🚒 🚐 🚚 🚛
😀 Emojis	😀 😂 😍 🥺 😎 🤔 😴 🥳 😡 😱 🥶 🤯
🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Icons: Unicode Emojis

Sound Effects: Mixkit

Fonts: Google Fonts (Inter)

Inspiration: Classic memory matching games

📞 Contact & Support
Platform	Link
GitHub	@priyansusikdar2
Project Link	Memory Matching Game
Live Demo	Play Now
⭐ Show Your Support
If you found this project helpful or enjoyable, please consider:

⭐ Starring the repository on GitHub

🍴 Forking the project

🐛 Reporting issues

💡 Suggesting new features


                                                Made with ❤️ using React, TypeScript, and Tailwind CSS

