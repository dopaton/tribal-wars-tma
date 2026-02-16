import { create } from 'zustand';
import type { Attack } from '../types/game';

interface AttackStore {
  attacks: Attack[];
  launchAttack: (targetVillageId: string, units: Record<string, number>) => void;
  processAttacks: () => void;
}

export const useAttackStore = create<AttackStore>((set, get) => ({
  attacks: [],
  
  launchAttack: (targetVillageId, units) => {
    const now = Date.now();
    const travelTime = 5 * 60 * 1000; // 5 minutes in ms
    const arrivalTime = now + travelTime;
    
    const attack: Attack = {
      id: `attack-${now}`,
      sourceVillageId: 'player-village',
      targetVillageId,
      units,
      launchTime: now,
      arrivalTime,
      status: 'traveling',
    };
    
    set((state) => ({
      attacks: [...state.attacks, attack],
    }));
  },
  
  processAttacks: () => {
    const now = Date.now();
    const { attacks } = get();
    
    const updatedAttacks = attacks.map((attack) => {
      if (attack.status === 'traveling' && now >= attack.arrivalTime) {
        return { ...attack, status: 'completed' as const };
      }
      return attack;
    });
    
    set({ attacks: updatedAttacks });
  },
}));
