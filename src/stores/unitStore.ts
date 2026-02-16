import { create } from 'zustand';
import type { TrainingQueue } from '../types/game';
import { UNITS } from '../utils/constants';

interface UnitStore {
  units: Record<string, number>; // unitId -> count
  trainingQueue: TrainingQueue[];
  addToQueue: (unitId: string, amount: number) => void;
  processQueue: () => void;
  getUnitCount: (unitId: string) => number;
}

export const useUnitStore = create<UnitStore>((set, get) => ({
  units: {
    spearman: 0,
    swordsman: 0,
    axeman: 0,
    archer: 0,
    cavalry: 0,
  },
  trainingQueue: [],
  
  addToQueue: (unitId, amount) => {
    const now = Date.now();
    const queue = get().trainingQueue;
    
    // Calculate start time (after last item in queue)
    let startTime = now;
    if (queue.length > 0) {
      const lastItem = queue[queue.length - 1];
      startTime = lastItem.endTime;
    }
    
    const unit = UNITS[unitId];
    const totalTime = unit.trainTime * amount * 1000; // seconds to ms
    const endTime = startTime + totalTime;
    
    set((state) => ({
      trainingQueue: [
        ...state.trainingQueue,
        {
          unitId,
          amount,
          startTime,
          endTime,
        },
      ],
    }));
  },
  
  processQueue: () => {
    const now = Date.now();
    const { trainingQueue } = get();
    
    const completed: TrainingQueue[] = [];
    const remaining: TrainingQueue[] = [];
    
    trainingQueue.forEach((item) => {
      if (now >= item.endTime) {
        completed.push(item);
      } else {
        remaining.push(item);
      }
    });
    
    if (completed.length > 0) {
      set((state) => {
        const newUnits = { ...state.units };
        completed.forEach((item) => {
          newUnits[item.unitId] = (newUnits[item.unitId] || 0) + item.amount;
        });
        
        return {
          units: newUnits,
          trainingQueue: remaining,
        };
      });
    }
  },
  
  getUnitCount: (unitId) => {
    return get().units[unitId] || 0;
  },
}));
