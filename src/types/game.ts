export interface Resources {
  wood: number;
  clay: number;
  iron: number;
  food: number;
}

export interface Building {
  id: string;
  name: string;
  level: number;
  woodCost: number;
  clayCost: number;
  ironCost: number;
  buildTime: number; // in seconds
  upgrading: boolean;
  upgradeEndTime?: number;
  description: string;
  effect?: string;
}

export interface Unit {
  id: string;
  name: string;
  woodCost: number;
  clayCost: number;
  ironCost: number;
  foodCost: number;
  trainTime: number; // in seconds
  attack: number;
  defense: number;
  description: string;
}

export interface TrainingQueue {
  unitId: string;
  amount: number;
  startTime: number;
  endTime: number;
}

export interface Village {
  id: string;
  name: string;
  x: number;
  y: number;
  playerId: string;
}

export interface Attack {
  id: string;
  sourceVillageId: string;
  targetVillageId: string;
  units: Record<string, number>;
  launchTime: number;
  arrivalTime: number;
  status: 'pending' | 'traveling' | 'completed';
}
