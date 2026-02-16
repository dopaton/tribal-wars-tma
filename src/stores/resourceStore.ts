import { create } from 'zustand';
import type { Resources } from '../types/game';
import { INITIAL_RESOURCES, PRODUCTION_RATE, PRODUCTION_INTERVAL } from '../utils/constants';

interface ResourceStore {
  resources: Resources;
  lastUpdate: number;
  addResources: (resources: Partial<Resources>) => void;
  subtractResources: (resources: Partial<Resources>) => boolean;
  updateProduction: () => void;
  canAfford: (cost: Partial<Resources>) => boolean;
}

export const useResourceStore = create<ResourceStore>((set, get) => ({
  resources: INITIAL_RESOURCES,
  lastUpdate: Date.now(),
  
  addResources: (newResources) => {
    set((state) => ({
      resources: {
        wood: state.resources.wood + (newResources.wood || 0),
        clay: state.resources.clay + (newResources.clay || 0),
        iron: state.resources.iron + (newResources.iron || 0),
        food: state.resources.food + (newResources.food || 0),
      },
    }));
  },
  
  subtractResources: (cost) => {
    const state = get();
    if (!state.canAfford(cost)) return false;
    
    set((prevState) => ({
      resources: {
        wood: prevState.resources.wood - (cost.wood || 0),
        clay: prevState.resources.clay - (cost.clay || 0),
        iron: prevState.resources.iron - (cost.iron || 0),
        food: prevState.resources.food - (cost.food || 0),
      },
    }));
    return true;
  },
  
  updateProduction: () => {
    const state = get();
    const now = Date.now();
    const elapsed = now - state.lastUpdate;
    const intervals = Math.floor(elapsed / PRODUCTION_INTERVAL);
    
    if (intervals > 0) {
      // Get building levels from building store
      const buildingStore = useBuildingStore.getState();
      const sawmillLevel = buildingStore.buildings.sawmill?.level || 0;
      const claypitLevel = buildingStore.buildings.claypit?.level || 0;
      const ironmineLevel = buildingStore.buildings.ironmine?.level || 0;
      const farmLevel = buildingStore.buildings.farm?.level || 0;
      
      const production = {
        wood: intervals * PRODUCTION_RATE * sawmillLevel,
        clay: intervals * PRODUCTION_RATE * claypitLevel,
        iron: intervals * PRODUCTION_RATE * ironmineLevel,
        food: intervals * PRODUCTION_RATE * farmLevel,
      };
      
      set((prevState) => ({
        resources: {
          wood: prevState.resources.wood + production.wood,
          clay: prevState.resources.clay + production.clay,
          iron: prevState.resources.iron + production.iron,
          food: prevState.resources.food + production.food,
        },
        lastUpdate: now,
      }));
    }
  },
  
  canAfford: (cost) => {
    const { resources } = get();
    return (
      resources.wood >= (cost.wood || 0) &&
      resources.clay >= (cost.clay || 0) &&
      resources.iron >= (cost.iron || 0) &&
      resources.food >= (cost.food || 0)
    );
  },
}));

// Import building store (defined below)
import { useBuildingStore } from './buildingStore';
