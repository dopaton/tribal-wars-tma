# tribal-wars-tma
⚔️ Tribal Wars - Telegram Mini App Game

A strategy game built as a Telegram Mini App using React, TypeScript, and Vite.

## Features

- 🏘️ **Village Management**: Monitor resources and buildings
- 🗺️ **Interactive Map**: Explore and find targets on a draggable canvas map
- ⚔️ **Barracks**: Train different types of military units
- 🏗️ **Building System**: Upgrade buildings with costs and timers
- 🎯 **Rally Point**: Launch attacks on other villages
- 📊 **Resource Production**: Automated resource generation system
- ⏱️ **Real-time Updates**: Game loop processing for timers and production
- 🎨 **Telegram Theme Integration**: Uses Telegram's native color scheme
- 📱 **Mobile-First Design**: Touch-friendly UI with bottom navigation

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Zustand** for state management
- **React Router** for navigation
- **@tma.js/sdk-react** for Telegram Mini App integration
- **@telegram-apps/telegram-ui** for native Telegram UI components

## Game Mechanics

### Resources
- 🪵 Wood
- 🧱 Clay
- ⚙️ Iron
- 🌾 Food

Resources are produced automatically based on building levels.

### Buildings
- **Headquarters**: Unlocks new buildings
- **Barracks**: Enables unit training
- **Sawmill**: Produces wood
- **Clay Pit**: Produces clay
- **Iron Mine**: Produces iron
- **Farm**: Produces food
- **Warehouse**: Stores resources
- **Wall**: Provides defense bonus

### Units
- **Spearman**: Basic infantry
- **Swordsman**: Defensive infantry
- **Axeman**: Offensive infantry
- **Archer**: Ranged unit
- **Light Cavalry**: Fast mounted unit

### Combat
Combat is calculated based on unit attack/defense values and includes:
- Attack power calculation
- Defense bonuses from walls
- Resource plundering for victors

## Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

The app is configured for GitHub Pages deployment. Push to the main branch to trigger automatic deployment via GitHub Actions.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components (Village, Map, Barracks, Build, RallyPoint)
├── stores/        # Zustand state management stores
├── types/         # TypeScript type definitions
├── utils/         # Utility functions and constants
└── App.tsx        # Main app component with routing
```

## License

MIT
