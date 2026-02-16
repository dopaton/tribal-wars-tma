import { create } from 'zustand';
import type { Village } from '../types/game';

interface MapStore {
  villages: Village[];
  playerVillage: Village;
  selectedVillage: Village | null;
  selectVillage: (village: Village | null) => void;
  generateMap: () => void;
}

export const useMapStore = create<MapStore>((set) => ({
  villages: [],
  playerVillage: {
    id: 'player-village',
    name: 'My Village',
    x: 500,
    y: 500,
    playerId: 'player',
  },
  selectedVillage: null,
  
  selectVillage: (village) => {
    set({ selectedVillage: village });
  },
  
  generateMap: () => {
    // Generate some random villages around the player
    const villages: Village[] = [];
    const centerX = 500;
    const centerY = 500;
    
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 * i) / 30;
      const radius = 50 + Math.random() * 150;
      const x = Math.floor(centerX + Math.cos(angle) * radius);
      const y = Math.floor(centerY + Math.sin(angle) * radius);
      
      villages.push({
        id: `village-${i}`,
        name: `Village ${i + 1}`,
        x,
        y,
        playerId: `player-${i}`,
      });
    }
    
    set({ villages });
  },
}));
