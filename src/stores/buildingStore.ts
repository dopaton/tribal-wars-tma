import { create } from 'zustand';
import type { Building } from '../types/game';
import { BUILDINGS } from '../utils/constants';

interface BuildingStore {
  buildings: Record<string, Building>;
  startUpgrade: (buildingId: string) => boolean;
  completeUpgrade: (buildingId: string) => void;
  checkUpgrades: () => void;
  getBuildingCost: (buildingId: string) => { wood: number; clay: number; iron: number };
}

export const useBuildingStore = create<BuildingStore>((set, get) => ({
  buildings: { ...BUILDINGS },
  
  startUpgrade: (buildingId) => {
    const building = get().buildings[buildingId];
    if (!building || building.upgrading) return false;
    
    const now = Date.now();
    const endTime = now + building.buildTime * 1000;
    
    set((state) => ({
      buildings: {
        ...state.buildings,
        [buildingId]: {
          ...building,
          upgrading: true,
          upgradeEndTime: endTime,
        },
      },
    }));
    return true;
  },
  
  completeUpgrade: (buildingId) => {
    const building = get().buildings[buildingId];
    if (!building) return;
    
    set((state) => ({
      buildings: {
        ...state.buildings,
        [buildingId]: {
          ...building,
          level: building.level + 1,
          upgrading: false,
          upgradeEndTime: undefined,
          // Increase costs for next level
          woodCost: Math.floor(building.woodCost * 1.5),
          clayCost: Math.floor(building.clayCost * 1.5),
          ironCost: Math.floor(building.ironCost * 1.5),
          buildTime: Math.floor(building.buildTime * 1.2),
        },
      },
    }));
  },
  
  checkUpgrades: () => {
    const now = Date.now();
    const { buildings } = get();
    
    Object.keys(buildings).forEach((buildingId) => {
      const building = buildings[buildingId];
      if (building.upgrading && building.upgradeEndTime && now >= building.upgradeEndTime) {
        get().completeUpgrade(buildingId);
      }
    });
  },
  
  getBuildingCost: (buildingId) => {
    const building = get().buildings[buildingId];
    return {
      wood: building.woodCost,
      clay: building.clayCost,
      iron: building.ironCost,
    };
  },
}));
